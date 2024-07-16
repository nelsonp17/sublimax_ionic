import { supabase } from "./supabase";
import { readFromStorage, saveToStorage } from "./utils";


export let errorToast = "";
export let session:any;

export const checkAuth = async () => {
    
    const { data: user, error } = await supabase.auth.getSession()
    if(error) {
        //console.log(error)
        //console.log('No esta autentificado')
        return false;
    }
    
    session = user;
    saveToStorage('user', session)

    const email = (session.session!=null) ? session.session.user.email : ''
    await findIsUserAdmin(email)

    if(!user.session){
        ///saveToStorage('role', 'client')
        console.log('No esta autentificado')
        return false;
    }
    //console.log('Esta autentificado')
    //console.log(user)
    
    return true
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
        //console.log(error)
        console.log(error.name)
        console.log(error.code) // undefine
        console.log(error.status)
        console.log(error.message)
        errorToast = error.message
        return false;
    }

    return true;
}

export const login = async (userForm: { email:string, password: string }) => {
    await findIsUserAdmin(userForm.email)
    let { data, error } = await supabase.auth.signInWithPassword(userForm)

    if(error) {
        console.log('error al logear el usuario')
        errorCodes(error)
        return false;
    }

    errorToast = "";
    return true;

}
const errorCodes = (error:any) => {
    if(error.message == 'Unable to validate email address: invalid format'){
        console.log("code error")
        errorToast = "Error: Formato de correo inválido"
    }
    if(error.message == 'Password should be at least 6 characters.' || error.code == 'weak_password'){
        console.log("code error")
        errorToast = "Error: Password should be at least 6 characters."
    }
    if(error.message == 'Email not confirmed') {
        console.log("code error")
        errorToast = "Error: Este usuario no ha confirmado su cuenta"
    }
    if(error.message == 'Invalid login credentials') {
        console.log("code error")
        errorToast = "Error: Credenciales inválidas"
    }

    console.log(error.name)
    console.log(error.code) // undefine
    console.log(error.status)
    console.log(error.message)
}

export const findIsUserAdmin = async (email:string) => {
    let role = 'client'
    try{
        const {data:user} = await supabase.from('user_admin').select('*').eq('email', email)
        
        //console.log(user)
        if (user){
            role = user[0].role
        }
        
    }catch(e){/* */}

    saveToStorage('role', role)
    return role
}
export const register = async (userForm: { email:string, password: string, name: string }) => {
    const role = await findIsUserAdmin(userForm.email);

    let { data, error } = await supabase.auth.signUp(
        {
            email: userForm.email, 
            password: userForm.password,
            options: {
                data: {
                    role,
                    name: userForm.name,
                }
            }
        }
    )

    if(error) {
        errorCodes(error)
        console.log('error al registrar el usuario')
        return false;
    }

    console.log('Usuario registrado')
    console.log("data", data);
    
    errorToast = "";
    return true;
}