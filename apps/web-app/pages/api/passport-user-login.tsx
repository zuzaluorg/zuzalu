import { NextApiRequest, NextApiResponse } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { SerializedPCD } from "@pcd/pcd-types"
import { EdDSATicketPCDPackage } from "@pcd/eddsa-ticket-pcd"
import { EdDSAPCDPackage } from "@pcd/eddsa-pcd"
import authMiddleware from "../../hooks/auth"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res })
    const signInWithTicketPCD = async ({ pcdStr }: { pcdStr: string }) => {
        // Validate Proof of user before interacting with DB

        // pcdStr comes in a request parameter
        const serializedPcd = JSON.parse(pcdStr) as SerializedPCD

        if (serializedPcd.type !== EdDSATicketPCDPackage.name) {
            throw new Error("Invalid PCD type")
        }
        await EdDSAPCDPackage.init?.({});
        await EdDSATicketPCDPackage.init?.({});

        const pcd = await EdDSATicketPCDPackage.deserialize(serializedPcd.pcd)
        if (!(await EdDSATicketPCDPackage.verify(pcd))) {
            throw new Error("Invalid proof")
        }

        const { ticketId, attendeeEmail, attendeeSemaphoreId, attendeeName } = pcd.claim.ticket;
        const password: string = (process.env.SINGLE_KEY_LOGIN as string).trim()

        try {
            // Try to log the user in
            const { data, error } = await supabase.auth.signInWithPassword({
                email: attendeeEmail,
                password
            })
            // If sign in was successful, we're done
            if (data && data.user) {
                const { error: updatePubUserError } = await supabase
                    .from("users")
                    .update({ uui_auth: data.user.id, role: "" })
                    .eq("email", attendeeEmail)

                if (updatePubUserError) {
                    res.status(400).json("Error with updating public user")
                }
                res.status(200).json("User signed in!")
            }

            // If use sign in was not successful, we need to create the user and then sign them in
            if (error) {
                const { data: signupData, error: signupError } = await supabase.auth.signUp({
                    email: attendeeEmail,
                    password,
                    options: {
                        data: {
                            uuid: ticketId,
                            commitment: attendeeSemaphoreId,
                            email: attendeeEmail,
                            name: attendeeEmail,
                            role: "", // These are not actually used anywhere
                            residence: "", // ^^
                            order_id: ticketId
                        }
                    }
                })

                if (signupError) {
                    res.status(400).json("Error with sign up")
                }

                if (signupData && signupData.user) {
                    // Now that the user has been signed up signed in, we need to make sure that the user's
                    // profile in the public DB is exists and is updated with the latest passport uuid.

                    // Check to see if user already exists in public DB
                    const { data: publicUserData, error: publicUserError } = await supabase
                        .from("users")
                        .select("id")
                        .eq("email", attendeeEmail)

                    if (publicUserError) {
                        res.status(400).json(`Error fetching public user: ${JSON.stringify(publicUserError)}`)
                        return
                    }

                    // If user profile exists, do an update of the uui_auth field
                    if (publicUserData.length > 0) {
                        await supabase.from("users").update({ uui_auth: signupData.user.id, role: "" }).eq("email", attendeeEmail)
                    }
                    // Otherwise, add the user profile
                    else {
                        const { error: addUserError } = await supabase.from("users").insert({
                            userName: attendeeName,
                            email: attendeeEmail,
                            uui_auth: signupData.user.id,
                            role: ""
                        })

                        if (addUserError) {
                            res.status(400).json("Error to add public user")
                        }
                    }

                    res.status(200).json("User signed up!")
                }
            }
        } catch (error) {
            res.status(500).json("Server error")
        }
    }

    if (req.body) {
        signInWithTicketPCD(req.body);
    } else {
        res.status(400).json("Request body is empty.")
    }
}

export default authMiddleware(handler)
