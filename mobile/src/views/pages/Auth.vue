<template>
    <ion-page>
        <ion-content :fullscreen="true" class="titillium-web-regular">
            <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
            <div id="container" class="flex flex-row bg-white">
                <!-- component -->

                <div class="relative sm:flex w-full justify-center flex flex-col items-center min-h-screen"> 
                    <div class="flex justify-center self-center z-10 bg-transparent rounded-3xl shadow-xl w-80 mx-auto">
                        <div class="px-6 py-12 bg-white mx-auto rounded-3xl w-96">
                            <div class="mb-5">
                                <h3 class="font-semibold text-2xl text-gray-800">
                                    <span v-if="isPage=='login'">Inicia Sesión</span>
                                    <span v-if="isPage=='register'">Registrarse</span>
                                </h3>
                                <p class="text-gray-400">
                                    <span v-if="isPage=='login'">
                                        ¿No tienes una cuenta? 
                                        <router-link to="/auth/register/" class="text-sm text-purple-700 hover:text-purple-700">Registrate</router-link>
                                    </span>

                                    <span v-if="isPage=='register'">
                                        ¿Tienes una cuenta?
                                        <router-link to="/auth/" class="text-sm text-purple-700 hover:text-purple-700">Iniciar Sesión</router-link>
                                    </span>
                                </p>
                            </div>
                            <div class="space-y-4">
                                <div class="" v-if="isPage=='register'">
                                    <input type="text" placeholder="Nombre" v-model="userForm.name" class="text-black w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"/>
                                </div>
                                <div class="">
                                    <input type="email" placeholder="Correo Eléctronico" v-model="userForm.email" class="text-black w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"/>
                                </div>


                                <div class="relative">
                                    <input placeholder="Contraseña" v-model="userForm.password" :type="show ? 'password' : 'text'" class="text-black text-sm px-4 py-3 rounded-lg w-full bg-gray-200 focus:bg-gray-100 border border-gray-200 focus:outline-none focus:border-purple-400"/>
                                    <div class="flex items-center absolute inset-y-0 right-0 mr-1 text-sm leading-5" @click="show = !show">
                                        <ion-button fill="clear" class="p-0 m-0">
                                            <ion-icon slot="icon-only" :icon="eye" size="small" class="text-black"></ion-icon>
                                        </ion-button>
                                    </div>
                                </div>


                                <div class="flex items-center justify-between" v-if="isPage=='login'">
                                    <div class="text-sm ml-auto">
                                        <a class="text-purple-700 hover:text-purple-600">
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <button :disabled="loading" type="button" v-if="isPage=='login'" @click.prevent="handleClickLogin"
                                        class="w-full flex justify-center bg-purple-800  hover:bg-purple-700 text-gray-100 p-3  rounded-lg tracking-wide font-semibold  cursor-pointer transition ease-in duration-500"
                                        :class="{'bg-purple-300': loading}">
                                        Iniciar
                                    </button>
                                    <button :disabled="loading" type="button" v-if="isPage=='register'" @click.prevent="handleClickRegister"
                                        class="w-full flex justify-center bg-purple-800  hover:bg-purple-700 text-gray-100 p-3  rounded-lg tracking-wide font-semibold  cursor-pointer transition ease-in duration-500"
                                        :class="{'bg-purple-300': loading}">
                                        Registrarse
                                    </button>
                                </div>
                                <div class="flex items-center justify-center space-x-2 my-5 d-none">
                                    <span class="h-px w-16 bg-gray-100"></span>
                                    <span class="text-gray-300 font-normal" v-if="isPage=='login'">o iniciar con</span>
                                    <span class="text-gray-300 font-normal" v-if="isPage=='register'">o registrar con</span>
                                    <span class="h-px w-16 bg-gray-100"></span>
                                </div>
                                <div class="flex justify-center gap-5 w-full d-none">

                                    <button type="submit"
                                        class="w-full flex items-center justify-center mb-6 md:mb-0 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 text-sm text-gray-500 p-3  rounded-lg tracking-wide font-medium  cursor-pointer transition ease-in duration-500">
                                        <svg class="w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="#EA4335"
                                                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                                            <path fill="#34A853"
                                                d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                                            <path fill="#4A90E2"
                                                d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                                            <path fill="#FBBC05"
                                                d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
                                        </svg>
                                        <!-- <svg class="w-4" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 13.9v-3.72h9.36c.14.63.25 1.22.25 2.05 0 5.71-3.83 9.77-9.6 9.77-5.52 0-10-4.48-10-10S6.48 2 12 2c2.7 0 4.96.99 6.69 2.61l-2.84 2.76c-.72-.68-1.98-1.48-3.85-1.48-3.31 0-6.01 2.75-6.01 6.12s2.7 6.12 6.01 6.12c3.83 0 5.24-2.65 5.5-4.22h-5.51v-.01Z"></path></svg> -->
                                        <span>Google</span>
                                    </button>

                                    <button type="submit"
                                        class="w-full flex items-center justify-center mb-6 md:mb-0 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 text-sm text-gray-500 p-3  rounded-lg tracking-wide font-medium  cursor-pointer transition ease-in duration-500 px-">
                                        <svg class="w-4 mr-2" viewBox="0 0 100 100"
                                            style="enable-background:new 0 0 100 100" xml:space="preserve"
                                            xmlns="http://www.w3.org/2000/svg">
                                            
                                            <g id="Layer_1" />
                                            <g id="Layer_2">
                                                <path
                                                    d="M50 2.5c-58.892 1.725-64.898 84.363-7.46 95h14.92c57.451-10.647 51.419-93.281-7.46-95z"
                                                    style="fill:#1877f2" />
                                                <path
                                                    d="M57.46 64.104h11.125l2.117-13.814H57.46v-8.965c0-3.779 1.85-7.463 7.781-7.463h6.021V22.101c-12.894-2.323-28.385-1.616-28.722 17.66V50.29H30.417v13.814H42.54V97.5h14.92V64.104z"
                                                    style="fill:#f1f1f1" />
                                            </g>
                                        </svg>
                                        <!-- <svg class="w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" fill-rule="evenodd" d="M9.945 22v-8.834H7V9.485h2.945V6.54c0-3.043 1.926-4.54 4.64-4.54 1.3 0 2.418.097 2.744.14v3.18h-1.883c-1.476 0-1.82.703-1.82 1.732v2.433h3.68l-.736 3.68h-2.944L13.685 22"></path></svg> -->
                                        <span>Facebook</span>
                                    </button>

                                </div>
                            </div>
                            <div class="text-center text-gray-300 text-xs mt-5">
                                <span>
                                    Copyright © 2024
                                    <a :href="VITE_NAME_COMPANY_DEVELOPER_URL" rel="" target="_blank" :title="VITE_NAME_COMPANY_DEVELOPER"
                                        class="text-purple-500 hover:text-purple-600">{{ VITE_NAME_COMPANY_DEVELOPER }}</a></span>
                            </div>
                        </div>
                    </div>
                </div>
                

            </div>

            <ion-toast
                :is-open="isOpen"
                :message="toast.message"
                :duration="toast.duration"
                @didDismiss="setOpen(false)"
            ></ion-toast>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">

const VITE_NAME_COMPANY_DEVELOPER = import.meta.env.VITE_NAME_COMPANY_DEVELOPER;
const VITE_NAME_COMPANY_DEVELOPER_URL = import.meta.env.VITE_NAME_COMPANY_DEVELOPER_URL;

import {
    IonPage,
    IonContent,
    IonRefresherContent,
    IonRefresher,
    IonIcon,
    IonButton,
    IonToast,
} from '@ionic/vue';
import { register, login, errorToast, checkAuth } from '@/utils/auth';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { eye } from 'ionicons/icons';
const isOpen = ref(false);
const loading = ref(false);
let isPage = "login";
const toast = ref({
    message: '',
    duration: 5000,
})

const getIsPage = () =>{
    const page = location.pathname
    if(page == '/auth/'){
        isPage = "login"
    }else if(page == '/auth/register/'){
        isPage = 'register'
    }
    console.log("page is:", isPage)
}

const router = useRouter()
const show = ref(true)
const userForm = ref({
    email: '',// 'nelsonportillo@gmail.com',
    password: '',
    name: '',
})
const setOpen = (state: boolean) => {
    isOpen.value = state;
};
const actionLink = (url: string) => {
    router.push({ path: url })
}
const handleRefresh = async (event: CustomEvent) => {
    setTimeout(async () => {
        location.reload()
        event.target.complete();
    }, 2000)
};
const init = async () =>{
    const isAuth = await checkAuth()
    loading.value = false
    if(isAuth){
        userForm.value = { email: '', password: '', name: '' }
        actionLink('/tabs/tab2/')
    }
}
const handleClickLogin = async () => {
    console.log('click')
    loading.value = true
    await login(userForm.value)

    if(errorToast != ''){
        toast.value.message = errorToast
        console.log(errorToast)
        setOpen(true)
        loading.value = false
        return;
    }
    setTimeout(()=>init(), 2000);
}
const handleClickRegister = async () => {
    console.log('click')
    loading.value = true
    await register(userForm.value)

    if(errorToast != ''){
        toast.value.message = errorToast
        console.log(errorToast)
        setOpen(true)
        loading.value = false
        return;
    }
    setTimeout(()=>init(), 2000);
}

onMounted(async () => {
    getIsPage()
});

</script>
