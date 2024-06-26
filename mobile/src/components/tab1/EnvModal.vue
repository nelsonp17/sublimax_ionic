<template>
	<!-- modal add -->
	<ion-header>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-button @click="cancel()">Cancelar</ion-button>
			</ion-buttons>
			<ion-buttons slot="end">
				<ion-button :strong="true" @click="confirm()">Guardar</ion-button>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<div class="myList">
			<div class="alert" v-if="errorsForm != '' ">
				<div>Corrige los siguiente errores:<br/></div>
				<div v-html="errorsForm"></div>
			</div>
			<p style="color: #212121">
				<b v-if="isInsert">Agregar una variable de entorno</b>
				<b v-else>Actualizar una variable de entorno</b>
			</p>
			<ion-item class="mt-2">
				<ion-input
					label="Nombre"
					label-placement="stacked"
					type="text"
					v-model="form.name"
				></ion-input>
			</ion-item>

			<ion-item class="mt-2">
				<ion-input
					label="Valor"
					label-placement="stacked"
					type="text"
					v-model="form.value"
				></ion-input>
			</ion-item>

			<ion-item class="mt-2">
				<ion-input
					label="Descripcion"
					label-placement="stacked"
					type="text"
					v-model="form.description"
				></ion-input>
			</ion-item>


			<ion-button class="mt-2" color="danger" expand="block" v-if="isInsert==false" @click="deleteRow">Eliminar
			</ion-button>
		</div>
	</ion-content>
</template>

<script setup lang="ts">
import {
	actionSheetController,
	modalController,
	IonInput,
	IonButtons,
	IonHeader,
	IonToolbar,
	IonContent,
	IonButton,
	IonItem
} from '@ionic/vue';
import {ref} from 'vue';
import {supabase} from '@/utils/supabase';
import {formValidEnv} from '@/utils/formValid';

const props = defineProps({
	id: Number,
	name: String,
	value: String,
	description: String,
});

const form = ref({
	name: '',
	value: '',
	description: ''
});
let errorsForm = ref('');
let isInsert = true;

if (props.name != undefined) {
	form.value.name = props.name;
}
if (props.value != undefined) {
	form.value.value = props.value;
}
if (props.description != undefined) {
	form.value.description = props.description;
}

if (props.name != undefined && props.value != undefined) {
	isInsert = false;
}

async function insert() {
	const {error} = await supabase.from('environment').insert(
		{name: form.value.name, value: form.value.value, description: form.value.description}
	)

	if (error) {
		console.log(error)
	}

}

async function update() {
	const {error} = await supabase.from('environment').update(
		{name: form.value.name, value: form.value.value, description: form.value.description}
	).eq('id', props.id)

	if (error) {
		console.log(error)
	}

}

async function deleteRow() {
	const respuesta = await canDismiss()
	if (respuesta) {
		const {error} = await supabase.from('environment').delete().eq('id', props.id)

		if (error) {
			console.log(error)
		}

		modalController.dismiss(form.value.name, 'confirm')
	}
}

const canDismiss = async () => {
	const actionSheet = await actionSheetController.create({
		header: '¿Esta seguro de eliminar este elemento?',
		buttons: [
			{
				text: 'Si',
				role: 'confirm',
			},
			{
				text: 'No',
				role: 'cancel',
			},
		],
	});
	actionSheet.present();
	const {role} = await actionSheet.onWillDismiss();
	return role === 'confirm';
};

const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = async () => {
	errorsForm.value = '';
	const validate = await formValidEnv(form.value);

	console.log(validate)
	if (validate != true) {
		console.log('no guardar')
		errorsForm.value = validate;
		return;
	}

	if (isInsert) {
		await insert()
	} else {
		await update()
	}


	modalController.dismiss(form.value.name, 'confirm')
	//console.log(form)

};

</script>