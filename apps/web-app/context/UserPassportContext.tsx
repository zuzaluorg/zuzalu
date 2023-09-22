import { useRouter } from "next/router"
import { createContext, ReactNode, useState, useContext, useEffect } from "react"
import {
    getWithoutProvingUrl,
    User
} from "@pcd/passport-interface"
import axios from "axios"
import { EdDSATicketPCDPackage } from "@pcd/eddsa-ticket-pcd"
import { EdDSAPCDPackage } from "@pcd/eddsa-pcd"

type UserPassportContextData = {
    requestSignedZuID: () => void
    errorPassport: boolean
    loadingPassport: {
        step: number
        text: string
    }
}

type UserPassportProviderProps = {
    children: ReactNode
}

export const UserPassportContext = createContext({} as UserPassportContextData)

export function UserPassportContextProvider({ children }: UserPassportProviderProps) {
    const [pcdStr, setPcdStr] = useState("")
    const router = useRouter()
    const [loadingPassport, setLoadingPassport] = useState({
        step: 0,
        text: ""
    })
    const [errorPassport, setErrorPassport] = useState(false)

    const PASSPORT_URL: string = process.env.NEXT_PUBLIC_PASSPORT_URL as string;

    function requestSignedZuID() {
        setLoadingPassport({ step: 1, text: "Waiting to prove passport..." })
        const proofUrl = getWithoutProvingUrl(PASSPORT_URL, `${window.location.origin}/popup`, EdDSATicketPCDPackage.name);
        const popupUrl = `/popup?proofUrl=${encodeURIComponent(proofUrl)}`;
        window.open(popupUrl, "_blank", "width=360,height=480,top=100,popup");
    }

    useEffect(() => {
        async function receiveMessage(ev: MessageEvent<any>) {
            if (!ev.data.encodedPcd) return
            setLoadingPassport({ step: 2, text: "Waiting response..." })
            setPcdStr(ev.data.encodedPcd)
        }
        window.addEventListener("message", receiveMessage, false)
    }, [])

    const [participant, setParticipant] = useState<User | null>(null);

    useEffect(() => {
      if (pcdStr.length > 0) {
        (async () => {
            // @todo exception?
            await EdDSAPCDPackage.init?.({});
            await EdDSATicketPCDPackage.init?.({});
            console.log(pcdStr);
            const serializedPCD = JSON.parse(pcdStr);
            const pcd = await EdDSATicketPCDPackage.deserialize(serializedPCD.pcd);
            console.log(pcd);
            const verified = await EdDSATicketPCDPackage.verify(pcd);
            console.log(verified);
            if (verified) {
                const { ticketId, attendeeEmail, attendeeSemaphoreId, attendeeName } = pcd.claim.ticket;
                const user: User = { email: attendeeEmail, uuid: ticketId, commitment: attendeeSemaphoreId, name: attendeeName };
                setParticipant(user);
            }
        })();
      }
    }, [pcdStr, setParticipant])

    const loginProof = async () => {
        try {
            console.log("sending data to api");
            await axios({
                method: "post",
                url: "/api/passport-user-login/",
                data: { pcdStr },
                headers: {
                    "Content-Type": "application/json",
                    htmlcode: process.env.KEY_TO_API as string
                }
            })
                .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        setLoadingPassport({
                            step: 4,
                            text: "SUCCESS"
                        })

                        setTimeout(() => {
                            setLoadingPassport({
                                step: 0,
                                text: ""
                            })
                        }, 3000)
                        setErrorPassport(false)
                        router.push("/").then(() => {
                            router.reload()
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setErrorPassport(true)
                })
        } catch (error1) {
            console.error("error1", error1)
            setErrorPassport(true)
        }
    }

    useEffect(() => {
        if (participant) {
            setLoadingPassport({ step: 3, text: "Logging you in..." })
            loginProof();
        }
    }, [participant])

    return (
        <UserPassportContext.Provider value={{ requestSignedZuID, loadingPassport, errorPassport }}>
            {children}
        </UserPassportContext.Provider>
    )
}

export function getServerSideProps() {
    return {
        props: {
            PASSPORT_URL: process.env.PASSPORT_URL as string
        }
    }
}

export const useUserPassportContext = () => useContext(UserPassportContext)
