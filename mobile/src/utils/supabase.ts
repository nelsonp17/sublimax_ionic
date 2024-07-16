import { createClient } from "@supabase/supabase-js";
import { readFromStorage, saveToStorage } from "./utils";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const service_role = import.meta.env.VITE_SUPABASE_SERVICE_ROLE;


const role = readFromStorage('role') || ''
//export const supabase = (role=='admin' || role == 'root') ? createClient(supabaseUrl, service_role) : createClient(supabaseUrl, supabaseKey)

//export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabase = (role=='admin' || role == 'root') ? createClient(supabaseUrl, service_role) : createClient(supabaseUrl, supabaseKey)
//const adminAuthClient = await supabase.auth.admin.listUsers()
//console.log(adminAuthClient)
/**
export const supabaseAdmin = createClient(supabaseUrl, service_role, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})
**/
// Access auth admin api
//const adminAuthClient = supabaseAdmin.auth.admin