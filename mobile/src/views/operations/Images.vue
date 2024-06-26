<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>
					<router-link to="/products" :replace="true">
						<ion-icon
							:icon="arrowBack"
							style="margin-right: 10px"
						></ion-icon>
					</router-link>
					Imágenes
				</ion-title>
				<ion-progress-bar type="indeterminate" v-if="loadImage"></ion-progress-bar>
			</ion-toolbar>
		</ion-header>

		<ion-content
			:fullscreen="true"
			class="ion-padding titillium-web-regular"
		>
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">
						<router-link to="/products">
							<ion-icon
								:icon="arrowBack"
								style="margin-right: 10px"
							></ion-icon>
						</router-link>
						Imagenes
					</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
				<ion-refresher-content></ion-refresher-content>
			</ion-refresher>
			
			<input
				accept="image/*"
				interface="popover"
				type="file"
				@change="onFileChange($event)"
				id="file-upload"
				style="display: none"
			/>

			<!-- component -->
			<div class="max-w-sm mx-auto mt-4 mb-2" v-if="images.length > 0">
				<div class="bg-white shadow-lg rounded-lg overflow-hidden">
					<p class="px-4 py-2 font-medium text-gray-700">
						Producto: {{  images[0].products.name  }}
					</p>
					<ul class="divide-y divide-gray-200">
						<li v-for="image in images" :key="image.id">
							<div class="px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="toggleItem(image)">
								<div class="flex justify-between items-center">
									<span class="font-medium text-gray-700">{{
										image.alt
									}}</span>
									<svg
										v-if="!image.isOpen"
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6 text-gray-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7z"
										/>
									</svg>
									<svg
										v-else
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6 text-gray-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 15l7 -7 7 7"
										/>
									</svg>
								</div>
							</div>
							<div v-if="image.isOpen" class="px-4 pb-3 bg-gray-50">
								<div class="divider"></div>
								<div class="py-4">
									<img
										:src="image.src"
										:alt="image.alt"
										class="w-full h-auto"
									/>
								</div>
								<div class="flex justify-between items-center">
									<span class="text-sm text-gray-500"
										>Opciones</span
									>
									<span
										class="inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm"
									>
										<button class="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative" @click="openFileDialogUpdate(image.id)">
											Actualizar
										</button>
										<button class="inline-block px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100 focus:relative" @click="deleteRow(image.id)">
											Eliminar
										</button>
									</span>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="max-w-sm mx-auto mt-4 mb-2" v-else>
				<p>No hay imágenes asociadas a este producto</p>
			</div>

			<ion-fab slot="fixed" vertical="bottom" horizontal="end">
				<ion-fab-button @click="openFileDialog">
					<ion-icon :icon="camera"></ion-icon>
				</ion-fab-button>
			</ion-fab>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {
	IonProgressBar,
	IonFab,
	IonFabButton,
	IonRefresher,
	IonRefresherContent,
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButton,
	IonIcon,
	actionSheetController
} from "@ionic/vue";
import { arrowBack, chevronForward, add, camera } from "ionicons/icons";
import { supabase } from "@/utils/supabase";
import {onMounted, onUpdated, ref} from "vue";
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const images = ref([]);
const loadImage = ref(false);
// const product_id = ref(0);
const image_data = ref(0)
const image_data_update_id = ref(null)
const isUpdate = ref(false)

const openFileDialog = () => {
	(document as any).getElementById("file-upload").click();
};
const openFileDialogUpdate = (image_id: any) => {
	console.log("imagen " + image_id)
	if(image_id == undefined) { return }
	isUpdate.value = true;
	image_data_update_id.value = image_id;
	(document as any).getElementById("file-upload").click();
}

const onFileChange = (event: { target: { files: any[]; }; }) => {
	loadImage.value = true
	const file = event.target.files[0];
	const reader = new FileReader();
	image_data.value = {
		title: file.name,
		alt: file.name,
		src: null,
		product_id: route.params.product_id,
	};

	reader.onload = async (e) => {
		image_data.value.src = e.target.result;

		let op = false
		// actualizo la imagen
		if(isUpdate.value){
			image_data.value.id = image_data_update_id.value
			op = await updateImage(image_data.value)
		}else{
			op = await addImage(image_data.value);
		}

		loadImage.value=false
		isUpdate.value = false;
		setTimeout(()=>getRows(), 500);
		
	};

	reader.readAsDataURL(file);

	// setTimeout(()=>getRows(), 500);
};

async function getRows() {
	console.log("Llamada a la funcion getRow()")
	const { data: imgs, error } = await supabase
		.from("images")
		.select(`id, created_at, src, title, alt, product_id, products (name)`)
		.eq("product_id", route.params.product_id)
		.order("id");
	
	setTimeout(()=>images.value = imgs, 500);
}


onMounted(()=>{
	setTimeout(()=>{
		console.log("producto_id parametro: ", route.params.product_id)
		getRows()
	}, 500)
})

const handleRefresh = async (event: CustomEvent) => {
	setTimeout(() => {
		// Any calls to load data go here
		images.value = []
		getRows();
		event.target.complete();
	}, 2000);
};

const toggleItem = (image: { isOpen: boolean; }) => {
	image.isOpen = !image.isOpen;
};

const addImage = async (image) => {
	const { data: img, error } = await supabase
	.from('images')
	.insert(image)
	.select()

	if(error){
		console.log(error)
	}else{
		return true;
	}

	return false;
};

const updateImage = async (image) => {
	const { data, error } = await supabase
	.from('images')
	.update(image)
	.eq('id', image.id)
	.select()


	if(error){
		console.log(error)
	}else{
		return true;
	}

	return false;
};

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

async function deleteRow(id: any){
	if(id == undefined) { return }
	const respuesta = await canDismiss()
	
	if(respuesta){
		const { error } = await supabase.from('images').delete().eq('id', id)

		if(error){
			console.log(error)
			return
		}

		images.value = []
		await getRows();
	}
}
</script>

<style scoped>
.metadata-end-wrapper {
	position: absolute;

	top: 10px;
	inset-inline-end: 10px;

	font-size: 0.8rem;

	display: flex;
	align-items: center;
}

ion-label strong {
	display: block;

	max-width: calc(100% - 60px);

	overflow: hidden;

	text-overflow: ellipsis;
}

ion-label ion-note {
	font-size: 0.9rem;
}
</style>
