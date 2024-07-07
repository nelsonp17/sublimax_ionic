import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/** 
const supabaseAdmin = createClient(supabaseUrl, service_role_key, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})**/

// Access auth admin api
//const adminAuthClient = supabaseAdmin.auth.admin