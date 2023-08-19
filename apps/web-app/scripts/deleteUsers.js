const { createClient } = require("@supabase/supabase-js")

//TODO: CHANGE TO API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl as string, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
})

;(async () => {
    const { data, error } = await supabase.auth.admin.deleteUser("f739cb24-205f-41fc-b5fc-a02a06cc1814", true)
    console.log(data, error)
})()
