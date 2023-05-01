import { NextApiRequest, NextApiResponse } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { SerializedPCD } from "@pcd/pcd-types"
import { fetchParticipant } from "@pcd/passport-interface"
import { SemaphoreSignaturePCDPackage } from "@pcd/semaphore-signature-pcd"

import authMiddleware from "../../hooks/auth"

interface Identity {
    participant1: {
        uuid: string
        commitment: string
        email: string
        name: string
        role: string
        residence: string
        order_id: string
    }

    pcdStr: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res })
    const signInWithSemaphoreProof = async (identity: Identity) => {
        // Validate Proof of user before interacting with DB
        const {
            participant1: { uuid, commitment, email, name, role, residence, order_id },
            pcdStr
        } = identity

        // pcdStr comes in a request parameter
        const serPcd = JSON.parse(pcdStr) as SerializedPCD

        if (serPcd.type !== SemaphoreSignaturePCDPackage.name) {
            throw new Error("Invalid PCD type")
        }
        const pcd = await SemaphoreSignaturePCDPackage.deserialize(serPcd.pcd)
        if (!(await SemaphoreSignaturePCDPackage.verify(pcd))) {
            throw new Error("Invalid proof")
        }

        // Valid proof, check the signed message

        const participant = await fetchParticipant("https://api.pcd-passport.com/", uuid)

        if (participant == null || participant.commitment !== pcd.claim.identityCommitment) {
            throw new Error("Wrong UUID")
        }

        const password: string = (process.env.SINGLE_KEY_LOGIN as string).trim()

        try {
            // Try to log the user in
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            // If sign in was successful, we're done
            if (data && data.user) {
                const { error: updatePubUserError } = await supabase
                    .from("users")
                    .update({ uui_auth: data.user.id, role })
                    .eq("email", email)

                if (updatePubUserError) {
                    res.status(400).json("Error with updating public user")
                }
                res.status(200).json("User signed in!")
            }

            // If use sign in was not successful, we need to create the user and then sign them in
            if (error) {
                const { data: signupData, error: signupError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            uuid,
                            commitment,
                            email,
                            name,
                            role,
                            residence,
                            order_id
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
                        .eq("email", email)

                    if (publicUserError) {
                        res.status(400).json(`Error fetching public user: ${JSON.stringify(publicUserError)}`)
                        return
                    }

                    // If user profile exists, do an update of the uui_auth field
                    if (publicUserData.length > 0) {
                        await supabase.from("users").update({ uui_auth: signupData.user.id, role }).eq("email", email)
                    }
                    // Otherwise, add the user profile
                    else {
                        const { error: addUserError } = await supabase.from("users").insert({
                            userName: name,
                            email,
                            uui_auth: signupData.user.id,
                            role
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
        signInWithSemaphoreProof(req.body)
    } else {
        res.status(400).json("Request body is empty.")
    }
}

export default authMiddleware(handler)
