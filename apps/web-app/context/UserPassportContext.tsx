import { useRouter } from "next/router"
import { createContext, ReactNode, useState, useContext, useEffect } from "react"
import {
    openSignedZuzaluUUIDPopup,
    useFetchParticipant,
    usePassportPopupMessages,
    useSemaphoreSignatureProof
} from "@pcd/passport-interface"
import axios from "axios"

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
    const [uuid, setUuid] = useState<string | undefined>()
    const [pcdStr, setPcdStr] = useState("")
    const router = useRouter()
    const [loadingPassport, setLoadingPassport] = useState({
        step: 0,
        text: ""
    })
    const [errorPassport, setErrorPassport] = useState(false)

    const PASSPORT_URL = "https://zupass.org/"
    const PASSPORT_SERVER_URL = "https://api.pcd-passport.com/"

    const [pcdStr2, _passportPendingPCDStr] = usePassportPopupMessages()

    function requestSignedZuID() {
        setLoadingPassport({ step: 1, text: "Waiting to prove passport..." })
        const proofUrl = openSignedZuzaluUUIDPopup(PASSPORT_URL, `${window.location.origin}/popup`, "consumer-client")
        // requestProofFromPassport(proofUrl)
    }

    useEffect(() => {
        async function receiveMessage(ev: MessageEvent<any>) {
            if (!ev.data.encodedPcd) return
            setLoadingPassport({ step: 2, text: "Waiting response..." })
            setPcdStr(ev.data.encodedPcd)
        }
        window.addEventListener("message", receiveMessage, false)
    }, [])

    const [signatureProofValid, setSignatureProofValid] = useState<boolean | undefined>()
    const onProofVerified = (valid: boolean) => {
        setSignatureProofValid(valid)
    }

    const { signatureProof } = useSemaphoreSignatureProof(pcdStr, onProofVerified)

    useEffect(() => {
        if (signatureProofValid && signatureProof) {
            const userUuid = signatureProof.claim.signedMessage
            setUuid(userUuid)
        }
    }, [signatureProofValid, signatureProof])

    const { participant } = useFetchParticipant(PASSPORT_SERVER_URL, uuid)

    const loginProof = async (participant1: any, signatureProofProps: any) => {
        try {
            await axios({
                method: "post",
                url: "https://zuzalu-dev.vercel.app/api/passport-user-login/",
                data: { participant1, pcdStr },
                headers: {
                    "Content-Type": "application/json",
                    htmlcode: process.env.KEY_TO_API as string
                }
            })
                .then((response) => {
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
            loginProof(participant, signatureProof)
        }
    }, [participant])

    return (
        <UserPassportContext.Provider value={{ requestSignedZuID, loadingPassport, errorPassport }}>
            {children}
        </UserPassportContext.Provider>
    )
}

export const useUserPassportContext = () => useContext(UserPassportContext)
