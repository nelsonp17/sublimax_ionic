<template>
	<!-- modal add -->
	<ion-header>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-button @click="cancel()" class="button-modal-theme">Cancelar</ion-button>
			</ion-buttons>
			<ion-buttons slot="end">
				<ion-button :strong="true" @click="confirm()" class="button-modal-theme">Guardar</ion-button>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<div class="myList">
			<div class="alert" v-if="errorsForm != '' ">
				<div>Corrige los siguiente errores:<br/></div>
				<div v-html="errorsForm"></div>
			</div>
			<p>
				<b v-if="isInsert">Agregar un producto</b> 
				<b v-else>Actualizar un producto</b> 
			</p>
			<ion-item class="my-2">
				<ion-input
					label="Nombre"
					label-placement="stacked"
					type="text"
					v-model="form.name"
				></ion-input>
			</ion-item>
			<ion-item class="my-2">
				<ion-input
					label="Descripción"
					label-placement="stacked"
					type="text"
					v-model="form.description"
				></ion-input>
			</ion-item>
			<ion-item class="my-2">
				<ion-input
					label="Precio ($)"
					label-placement="stacked"
					type="number"
					v-model="form.price"
				></ion-input>
			</ion-item>
			<ion-item class="my-2">
				<ion-input
					label="Identificador"
					label-placement="stacked"
					type="text"
					v-model="form.uuid"
				></ion-input>
			</ion-item>

			<ion-select 
				v-model="form.stock"
				class="always-flip my-2"
				:toggle-icon="caretDownSharp"
				interface="popover"
				label="Stock"
				placeholder="Seleccione una opción"
			>
				<ion-select-option :value="true">Si</ion-select-option>
				<ion-select-option :value="false">No</ion-select-option>
			</ion-select>

			<ion-select 
				v-model="form.selectedSubcategory"
				class="always-flip my-2"
				:toggle-icon="caretDownSharp"
				interface="popover"
				label="Subcategoría"
				placeholder="Seleccione una subcategoría"
			>
				<ion-select-option v-for="subcategory in selectSubcategorys" :key="subcategory.id" :value="subcategory.id">
					{{ subcategory.name }}
				</ion-select-option>
			</ion-select>

			<ion-item>
				<ion-input
					label="Etiquetas"
					label-placement="stacked"
					type="text"
					v-model="form.tags"
					@focusout="eventTag"
					@keypress="eventTag(false)"
				></ion-input>
			</ion-item>

			<div class="text-theme mb-5" v-if="myTags.length > 0">
				<ion-chip class="mt-3" v-for="(tag,i) in myTags" :key="i">
					<ion-icon :icon="pricetagOutline" color="primary"></ion-icon>
					<ion-label>{{ tag }}</ion-label>
				</ion-chip>
			</div>

			<div v-if="isInsert==false" class="">
				<div v-if="firstImage">
					<img :src="firstImage.src" :alt="firstImage.alt">
				</div>
			</div>

			<div class="mt-2 text-center" v-if="isInsert==false">
				
				<ion-text @click="manageImage">Gestionar imagenes</ion-text>
			</div>
			<ion-button class="mt-min mb-2" color="danger" expand="block" v-if="isInsert==false" @click="deleteRow">Eliminar</ion-button>
		</div>
		<ion-toast
			:is-open="toast.isOpen"
			:message="toast.message"
			:duration="toast.duration"
			@didDismiss="toast.isOpen=false"
			@click="toast.isOpen=false"
		></ion-toast>
	</ion-content>
</template>

<script setup lang="ts">
	import { IonText, IonSelect, IonSelectOption, actionSheetController, modalController, IonInput, IonButtons, IonHeader, IonToolbar, IonContent, IonButton, IonItem, IonChip, IonIcon, IonLabel, IonToast } from '@ionic/vue';
	import { caretDownSharp, pricetagOutline } from 'ionicons/icons';
	import { Ref, onMounted, reactive, ref } from 'vue';
	import { supabase } from '@/utils/supabase';
	import { formValidProduct, formValidImage } from '@/utils/formValid';
	import { generateUniqueProductID, } from '@/utils/utils';
	import { useRoute, useRouter } from 'vue-router'

	const router = useRouter()
	const route = useRoute()
	const myTags = ref([]);

	const props = defineProps({
		id: Number,
		name: String,
		description: String,
		tags: String,
		uuid: String,
		subcategory_id: Number,
		price: Number,
		stock: Boolean,
	});
	const toast = reactive({
		isOpen: false,
		duration: 500,
		message: '',
	})

	const form = ref({
		name: '',
		description: '',
		tags: '',
		uuid: '',
		price: 0,
		selectedSubcategory: 0,
		stock: false,
	});
	let errorsForm = ref('');
	let product_id = ref(0);
	let isInsert = true;
	let firstImage = ref(false)

	const getFirstImage = async () => {
		let { data: images, error } = await supabase
		.from('images')
		.select('*')
		.eq('product_id', props.id)
		.limit(1)

		if(error){
			console.log(`Error:`, error)
			return;
		}
		firstImage.value = images[0]
	}

	if(props.name!=undefined){
		form.value.name = props.name;
	}
	if(props.description!=undefined){
		form.value.description = props.description;
	}
	if(props.tags!=undefined){
		form.value.tags = props.tags;
		try{
			myTags.value = props.tags.split(", ");
		}catch(e){
			console.log(e)
			toast.message = "El formato de la etiqueta no es válido. Debe estar separado por coma."
			toast.isOpen = true
			toast.duration = 2000
		}
	}
	if(props.uuid!=undefined){
		form.value.uuid = props.uuid;
	}
	if(props.price!=undefined){
		form.value.price = props.price;
	}
	if(props.subcategory_id!=undefined){
		form.value.selectedSubcategory = props.subcategory_id;
	}
	if(props.stock!=undefined){
		form.value.stock = props.stock;
	}
	if(props.name!=undefined && props.id!=undefined){
		isInsert=false;
		getFirstImage()
	}

	const manageImage = async () => {
		modalController.dismiss(null, 'cancel')
		router.push({ path: `/products/${props.id}/images`, replace: true })
	}
	const eventTag = (isMessage:boolean=true) => {
		//console.log(form.value.tags)
		try{
			myTags.value = form.value.tags.split(", ");
		}catch(e){
			console.log(e)
			if(isMessage){
				toast.message = "El formato de la etiqueta no es válido. Debe estar separado por coma."
				toast.isOpen = true
				toast.duration = 2000
			}
		}
	}

	async function insert(){
		let { data: products, error } = await supabase
			.from('products')
			.insert(
				{ 
					name: form.value.name, 
					description: form.value.description, 
					tags: form.value.tags, 
					uuid: form.value.uuid, 
					price: form.value.price, 
					subcategory_id: form.value.selectedSubcategory,
					stock: form.value.stock,
				}
			)
			.select('*')
		//console.log('Producto insertado...')
		//console.log(products)

		if(error){
			console.log(error)
		}else{
			product_id.value = products[0].id
		}

	}
	async function update(){
		
		let { data: products, error } = await supabase.from('products')
			.update(
				{ 
					name: form.value.name, 
					description: form.value.description, 
					tags: form.value.tags, 
					uuid: form.value.uuid, 
					price: form.value.price, 
					subcategory_id: form.value.selectedSubcategory,
					stock: form.value.stock,
				}
			)
			.eq('id', props.id)
			.select('*')

		console.log('Producto actualizado...')
		console.log(products)

		if(error){
			console.log(error)
		}else{
			product_id.value = products[0].id
		}


	}
	async function deleteRow(){
		const respuesta = await canDismiss()
		if(respuesta){
			await supabase.from('images').delete().eq('product_id', props.id)
			const { error } = await supabase.from('products').delete().eq('id', props.id)

			if(error){
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
		const { role } = await actionSheet.onWillDismiss();
		return role === 'confirm';
	};

	const cancel = () => modalController.dismiss(null, 'cancel');
	const confirm = async () => {
		errorsForm.value = '';
		const validate = await formValidProduct(form.value);

		console.log(validate)
		if(validate != true){
			console.log('no guardar')
			errorsForm.value = validate;
			return;
		}

		if(isInsert){
			await insert()
		}else{
			await update()
		}
		
		modalController.dismiss(form.value.name, 'confirm')
		router.push({ path: `/products/${product_id.value}/images`, replace: true})
	};

	const selectSubcategorys = ref()
	const imagesAsoc = ref()
	const searchSubcategorys = async () => {
		let { data: subcategorys, error } = await supabase.from('subcategorys').select('*').order('name')

		if(subcategorys==undefined){ return }
        if(subcategorys?.length > 0){
            selectSubcategorys.value = subcategorys;
        }
        
	}
	const searchImages = async (product_id:number) => {
		let { data: images, error } = await supabase
		.from('images')
		.select('*')
		.eq('product_id', product_id)

		if(images==undefined){ return }
        if(images?.length > 0){
            imagesAsoc.value = images;
        }
        console.log(images)
	}

	// CREAR un funcion que verifice que el uuid no este ocupado en la bd
	const generateUUID = async ()=> {
		let uuid = await generateUniqueProductID('P');
		form.value.uuid = uuid
	}

	onMounted(async ()=>{
		await searchSubcategorys()

		if(isInsert)
			await generateUUID();
		else{
			await searchImages(props.id || 0)
		}
	})

</script>
<style>
  ion-select.always-flip::part(icon) {
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  ion-select.always-flip.select-expanded::part(icon) {
    transform: rotate(180deg);
  }

  ion-select.never-flip::part(icon) {
    transform: none;
  }
</style>