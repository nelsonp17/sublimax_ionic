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
				<b v-if="isInsert">Agregar una subcategorías</b> 
				<b v-else>Actualizar una subcategorías</b> 
			</p>
			<ion-item class="mt-2">
				<ion-input
					label="Nombre"
					label-placement="stacked"
					type="text"
					v-model="form.name"
				></ion-input>
			</ion-item>

			<ion-select 
				v-model="form.selectedCategory"
				class="always-flip mt-2"
				:toggle-icon="caretDownSharp"
				interface="popover"
				label="Categoría"
				placeholder="Seleccione una subcategoría"
			>
				<ion-select-option v-for="category in selectCategorys" :key="category.id" :value="category.id">
					{{ category.name }}
				</ion-select-option>
			</ion-select>

			<ion-button class="mt-2" color="danger" expand="block" v-if="isInsert==false" @click="deleteRow">Eliminar</ion-button>
		</div>
	</ion-content>
</template>

<script setup lang="ts">
	import { IonSelect, IonSelectOption, actionSheetController, modalController, IonInput, IonButtons, IonHeader, IonToolbar, IonContent, IonButton, IonItem} from '@ionic/vue';
	import { caretDownSharp } from 'ionicons/icons';
	import { onMounted, ref } from 'vue';
	import { supabase } from '@/utils/supabase';
	import { formValidSubcategory } from '@/utils/formValid';

	const props = defineProps({
		id: Number,
		name: String,
		category_id: Number,
		category_name: String,
	});

	const form = ref({
		name: '',
		selectedCategory: 0,
	});
	let errorsForm = ref('');
	let isInsert = true;

	if(props.name!=undefined){
		form.value.name = props.name;
	}
	if(props.category_id!=undefined){
		form.value.selectedCategory = props.category_id;
	}

	if(props.name!=undefined && props.id!=undefined){
		isInsert=false;
	}

	async function insert(){
		const { error } = await supabase.from('subcategorys').insert(
			{ name: form.value.name, category_id: form.value.selectedCategory }
		)

		if(error){
			console.log(error)
		}

	}
	async function update(){
		
		const { error } = await supabase.from('subcategorys').update(
			{ name: form.value.name, category_id: form.value.selectedCategory }
		).eq('id', props.id)

		if(error){
			console.log(error)
		}

	}
	async function deleteRow(){
		const respuesta = await canDismiss()
		if(respuesta){
			const { error } = await supabase.from('subcategorys').delete().eq('id', props.id)

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
		const validate = await formValidSubcategory(form.value);

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
		//console.log(form)
	};

	const selectCategorys = ref([])
	const searchCategorys = async () => {
		let { data: categorys, error } = await supabase.from('categorys').select('*').order('name')

        if(categorys?.length > 0){
            selectCategorys.value = categorys;
        }
        
	}

	onMounted(async ()=>{
		await searchCategorys()
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