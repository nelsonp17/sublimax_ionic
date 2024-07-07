<template>
	<div class="">
		<div class="m-4 relative">
			<div id="my-node" v-show="photoHtml" class="image-share shadow border flex-row bg-gradient-to-r from-cyan-500 to-blue-500 relative">
				<div class="block text-center justify-center mb-1">
					<h1 class="title" id="photo-title">{{ product.name }}</h1>
				</div>
				<div class="flex flex-row mt-4">
					<div class="img">
						<img :src="product.images[0].src" :alt="product.images[0].title">
					</div>
					<div class="container-share mt-1">
						<div class="subtitle" id="photo-subtitle">
							<p>Comprando mediante <b>{{ nameCompany }}</b>, tus ideas cobran vida.</p>
							<p class="mt-3">Llevalo por solo: ${{ product.price }}</p>
						</div>
						<div class="flex flex-row mt-3">
							<div class="container-qr">
								<div class="qr">
									<img :src="codeQR" :alt="'qr-'+product.name">
								</div>
							</div>
						</div>
					</div>
					<div class="absolute bottom-3 right-3">
						<div class="logo-share">
							<img src="../../../public/background/logo_2_.png" >
						</div>
					</div>
				</div>

			</div>

			<div class="background-image-share-desing"></div>
		</div>

<!--		<ion-button @click="share">Compartir</ion-button>-->
		<div id="el" class="w-full">
			<img :src="myNode" alt="">
		</div>
	</div>
</template>

<script setup lang="ts">
/* ES6 */
import * as htmlToImage from 'html-to-image';
import {readFromStorage} from "@/utils/utils";
import {onMounted, ref, watch} from "vue";
import {IonButton} from "@ionic/vue";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import QRious from "qrious";

const nameCompany = import.meta.env.VITE_NAME_COMPANY;
const photoHtml = ref(true)

const product = readFromStorage('product')
const codeQR = ref('')
const myNode = ref('')

const generateQR = (str: string) => {
	const qr = new QRious({
		value: str
	});
	codeQR.value = qr.toDataURL('image/jpeg')
	console.log(codeQR.value)
}
const share = ()=>{
	try{
		htmlToImage.toPng(document.getElementById('my-node'))
			.then(function (dataUrl) {
				console.log(dataUrl)
				photoHtml.value = false
				myNode.value = dataUrl
			});
	}catch (e){ /* empty */ }
}

const resizeTextToFitContainer = () => {
	// const myNode = document.getElementById('my-node')
	window.fitText( document.getElementById('photo-title'), 1.8)
	window.fitText( document.getElementById(('photo-subtitle')), 2 )
}
window.addEventListener("orientationchange", function(){
	console.log(screen.orientation.type); // e.g. portrait
	resizeTextToFitContainer()
});
onMounted(async ()=>{
	// await screen.orientation.lock('landscape-primary');
	const str = `${product.uuid}`
	setTimeout(()=>{
		generateQR(str)
		resizeTextToFitContainer()
		share()
	}, 500)
	console.log(product)

})


const permission = () => {
	Filesystem.checkPermissions({
		directory: Directory.Documents
	})
	.then(permissions => {
		if (permissions.granted) {
			// Permisos concedidos, procede a crear la carpeta
			createImageFolder();
		} else {
			// Solicitar permisos de almacenamiento
			requestStoragePermissions();
		}
	})
	.catch(error => {
		console.error('Error al verificar permisos de almacenamiento:', error);
	});
}
const requestStoragePermissions = () => {
  Filesystem.requestPermissions({
    directory: Directory.Documents
  })
  .then(permissions => {
    if (permissions.granted) {
      // Permisos concedidos, procede a crear la carpeta
      createImageFolder();
    } else {
      console.error('Permisos de almacenamiento denegados');
    }
  })
  .catch(error => {
    console.error('Error al solicitar permisos de almacenamiento:', error);
  });
}
const createImageFolder = () => {
  Filesystem.mkdir({
    path: 'Images', // Ruta de la carpeta a crear
    directory: Directory.Documents // Directorio base donde crear la carpeta
  })
  .then(() => {
    console.log('Carpeta "Images" creada exitosamente');
  })
  .catch(error => {
    console.error('Error al crear la carpeta "Images":', error);
  });
}
</script>