<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>
                    <router-link to="/tabs/tab1">
                        <ion-icon :icon="arrowBack" style="margin-right: 10px;"></ion-icon>
                    </router-link>
                    Usuarios Admin
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" color="light" class="ion-padding titillium-web-regular">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">
                        <router-link to="/tabs/tab1">
                            <ion-icon :icon="arrowBack" style="margin-right: 10px;"></ion-icon>
                        </router-link>
                        Usuarios Admin
                    </ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>

            <div class="mt-3">
                <div v-show="isEditing==false">
                    <div class="mb-3 px-3">
                        <p class="text-2xl">Todos los registros</p>
                        <p>Deslice hacia la izquierda para editar los registros</p>
                    </div>
                    <ion-list :inset="true" id="no-padding">
                        <ion-item-sliding v-for="(row,i) in rows" :key="row.id" ref="items">
                            <ion-item :button="true" @click="handleClickOptions(row)">
                                <ion-avatar aria-hidden="true" slot="start">
                                    <img alt="" src="/img/avatar.svg" />
                                </ion-avatar>
                                <ion-label>{{ row.email }}</ion-label>
                            </ion-item>
                            <ion-item-options slot="end">
                                <ion-item-option color="light" @click="closeSlidingItem(i, row, 'update')">
                                    <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
                                </ion-item-option>
                                <ion-item-option color="light" @click="closeSlidingItem(i, row, 'delete')">
                                    <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                                </ion-item-option>
                            </ion-item-options>
                        </ion-item-sliding>
                    </ion-list>
                </div>


                <!-- component -->
                <div v-show="isEditing" class="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
                    <h1 class="text-3xl font-medium text-slate-700">
                        <span v-if="isInsert">Formulario de registro</span>
                        <span v-else>Formulario de actualización</span>
                    </h1>

                    <form action="" class="my-8">
                        <div class="flex flex-col space-y-5">
                            <label for="email">
                                <p class="font-medium text-slate-700 pb-2">Correo</p>
                                <input v-model="form.email" id="email" name="email" type="email"
                                    class="w-full bg-white text-slate-700 py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                                    placeholder="Enter email address">
                            </label>

                            <label for="role">
                                <p class="font-medium text-slate-700 pb-2">Tipo de usuario</p>
                                <select v-model="form.role" id="role" name="role"
                                    class="select w-full py-3 bg-white text-slate-700 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow">
                                    <option value="">Selecciona un opción</option>
                                    <option value="client">Cliente</option>
                                    <option value="admin">Administrador</option>
                                    <option value="root">Root</option>
                                </select>
                            </label>
                        </div>

                        <ion-button :disabled="disabled" class="mt-5" @click="handleClickSend">
                            Enviar
                            <ion-icon slot="end" :icon="send"></ion-icon>
                        </ion-button>
                        <ion-button color="dark" class="mt-5" @click="handleClickCancelEdit">
                            Cancelar
                        </ion-button>
                    </form>
                </div>

            </div>

            <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="toast.duration" @didDismiss="toast.isOpen = false" @click="toast.isOpen=false"></ion-toast>
        
            <ion-fab slot="fixed" horizontal="end" vertical="bottom">
                <ion-fab-button @click="openFormEdit(null, true)">
                    <ion-icon :icon="add"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonSearchbar,
    IonTitle,
    IonToolbar,
    IonToast,
    IonItemSliding,
    IonAvatar,
    IonItemOptions,
    IonItemOption,
    IonText,
    IonActionSheet,
    actionSheetController,
    IonFab, 
    IonFabButton,

} from '@ionic/vue';
import { arrowBack, chevronForward, send, pin, createOutline, trash, add } from 'ionicons/icons';
import { supabase } from '@/utils/supabase';
import { buscarCoincidencias, formatDateToHuman } from '@/utils/utils';
import { onMounted, reactive, ref } from 'vue';
import { readFromStorage } from '@/utils/utils'

const users_admin = ref([]);
const items = ref([
  // Populate your items array with data
]);

const rows = ref([]);
const isInsert = ref(true);
const disabled = ref(false);
const isEditing = ref(false);
const user = readFromStorage('user')
const form = reactive({
    id: null,
    email: '',
    role: '',
    created_for: user,
})
const toast = ref({
    message: '',
    duration: 5000,
    isOpen: false,
})
const handleClickOptions = async (elem:typeof form) => {
    //console.log(elem)
    const actionSheet = await actionSheetController.create({
        header: '¿Qué desea hacer?',
        buttons: [
            {
                text: 'Actualizar',
                role: 'update',
                data: {
                    action: 'share',
                },
            },
            {
                text: 'Eliminar',
                role: 'delete',
                data: {
                    action: 'delete',
                },
            },
            {
                text: 'Cancelar',
                role: 'cancel',
                data: {
                    action: 'cancel',
                },
            },
        ],
        
    });

    await actionSheet.present();

    // ActionSheetButton
    const {data, role} = await actionSheet.onDidDismiss()
    //console.log( data, role )
    if (role=='delete'){
        await handleClickDeleteConfirm(elem)
    }
    if (role=='update'){
        await openFormEdit(elem)
    }
};

const handleClickDeleteConfirm = async (elem:typeof form) => {
    const actionSheet = await actionSheetController.create({
        header: '¿Esta seguro de quere eliminar este registro?',
        buttons: [
            {
                text: 'Si',
                role: 'si',
                data: {
                    action: 'si',
                },
            },
            {
                text: 'No',
                role: 'no',
                data: {
                    action: 'no',
                },
            },
        ],
        
    });

    await actionSheet.present();
    const {role} = await actionSheet.onDidDismiss()
    if (role=='si'){
        await handleClickDelete(elem)
    }
}
const closeSlidingItem = async (itemId: number, elem:typeof form, op:string) => {
    //console.log(itemId)
    //console.log(items.value)
    //console.log(items.value[itemId])
    items.value[itemId].$el.close()
    if(op=='delete') await handleClickDelete(elem)
    else await openFormEdit(elem)
    
};

const buscar = (event: { target: { value: any; }; }) => {
    const textoBusqueda = event.target.value;
    if (textoBusqueda == '') {
        rows.value = users_admin.value
    } else {
        rows.value = buscarCoincidencias(textoBusqueda);

    }
    console.log('Texto de búsqueda:', textoBusqueda);

}


const handleRefresh = async (event: CustomEvent) => {
    await getRows()
    setTimeout(() => {
        // Any calls to load data go here
        event.target.complete();
    }, 2000);
};

const formatDate = (date: string) => formatDateToHuman(date)

async function getRows() {
    const { data: users } = await supabase.from('user_admin').select('*')

    if (users.length > 0) {
        users_admin.value = users
    }

    rows.value = users_admin.value
}
const openFormEdit = async (elem:typeof form|null, isInsertParam:boolean=false) => {
    isEditing.value = true
    isInsert.value = isInsertParam

    if(!isInsertParam && elem!=null){
        form.created_for = elem.created_for  
        form.email = elem.email  
        form.role = elem.role
        form.id = elem.id
    }else{
        resetForm()
    }

    
}
const handleClickCancelEdit = () => {
    resetForm()
    isEditing.value = false
}
const resetForm = () =>{
    isInsert.value = true
    form.created_for = user.session.user.email
    form.email =  ''
    form.role = ''
    form.id = null
}
const handleClickDelete = async (elem:typeof form) => {
    let {data, error} = await supabase.auth.admin.listUsers()
    console.log(data, error)
    let isDeleted = true
    data.users.forEach((value, index)=>{
        if(elem.email == value.email){
            isDeleted = false
        }
    })

    if(!isDeleted){
        toast.value.message = "No puedes eliminar este usuario"
        toast.value.isOpen = true
        return;
    }

    await supabase.from('user_admin').delete().eq('email', elem.email)
    toast.value.message = `Registro Eliminado`
    toast.value.isOpen = true;
    await getRows()
}
const handleClickSend = async () => {
    disabled.value = true
    let response, err;
    if(isInsert.value){
        let { data, error } = await supabase.from('user_admin').insert({email:form.email, role:form.role, created_for:form.created_for})
        response = data;
        err = error;
    }else{
        let { data, error } = await supabase.from('user_admin').update({email:form.email, role:form.role, created_for:form.created_for}).eq('id', form.id)
        response = data;
        err = error;
    }
    if (err) {
        toast.value.message = `Error: ${err.message}`
        toast.value.isOpen = true;
        console.log(err)
        return
    }
    await getRows()
    toast.value.message = `Operación exitosa`
    toast.value.isOpen = true;
    disabled.value = false
    isEditing.value = false
    resetForm()
}

onMounted(async () => {
    await getRows()
    form.created_for = user.session.user.email
})


</script>
<style scoped></style>: any: any