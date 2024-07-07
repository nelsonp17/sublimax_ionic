<template>
	<ion-page>
		<ion-content :fullscreen="true" class="ion-padding titillium-web-regular m-0 p-0 no-padding">
			<div class="relative">
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

				<!-- <div class="background-image-share-desing"></div> -->
			</div>

			<div id="el" class="flex p-5">
				<div class="col">
					<img :src="myNode" alt="">
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
/* ES6 */
import * as htmlToImage from 'html-to-image';
import {readFromStorage, generarTimestamp} from "@/utils/utils";
import {onMounted, ref} from "vue";
import QRious from "qrious";
import {Share} from "@capacitor/share";
import {useRouter} from "vue-router";
import {IonContent, IonPage} from "@ionic/vue";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { dialogShow, _log } from '@/utils/testing';

const nameCompany = import.meta.env.VITE_NAME_COMPANY;
const photoHtml = ref(true)
const router = useRouter();
const product = readFromStorage('product') || false
const previousLink = readFromStorage('previousLink') || '/tabs/tab2/'
const codeQR = ref('')
const myNode = ref('')

const generateQR = (str: string) => {
	const qr = new QRious({
		value: str
	});
	codeQR.value = qr.toDataURL('image/jpeg')
	// console.log(codeQR.value)
}
const share = ()=>{
	try{
		htmlToImage.toPng(document.getElementById('my-node'))
			.then(function (dataUrl) {
				// console.log(dataUrl)
				photoHtml.value = false
				myNode.value = dataUrl
				//console.log(dataUrl)
				setTimeout(async ()=>{
					await handleShareImage(myNode.value)
				}, 100)
			});
	}catch (e){ /* empty */ }
}

async function handleShareImage(base64Data: string) {
	const fileName = `IMG_${generarTimestamp()}.png`;

	try{
		// Guardar la imagen en un archivo local
		await Filesystem.writeFile({
			path: fileName,
			data: base64Data,
			directory: Directory.Documents,
		});

		// Obtener la URI del archivo guardado
		const uriResult = await Filesystem.getUri({
			directory: Directory.Documents,
			path: fileName,
		});

		// Compartir el archivo
		await Share.share({
			text: '¡Me encanto este producto asi que decidi compartirlo!',
			url: uriResult.uri,
		}).finally(async ()=>{
			// Bloquear en modo apaisado
			try{
				await ScreenOrientation.lock({ orientation: 'portrait' });
			}catch(e){/*empty */}
			router.push(previousLink)

		})
	}catch(e){
		//dialogShow('Error al guardar la imagen', e)
		_log("Error al crear la image", "ImageShareTemplateOne", e)
		router.push(previousLink)
	}
}

const resizeTextToFitContainer = () => {
	const content = document.querySelector("ion-content.no-padding")
	const contentH = content?.clientHeight || 300
	const heightMain = contentH - (contentH * .15) // menos un 15%

	const myNode = document.getElementById('my-node')
	myNode.style.height = `${heightMain}px`
	//myNode.style.marginTop = `${heightMain - (heightMain * .90)}px`


	const img = document.querySelector('.image-share .img img')
	const heightImg = heightMain - (heightMain * .30) // menos un 30%
	img.style.maxHeight = `${heightImg}px`


	// const myNode = document.getElementById('my-node')
	window.fitText( document.getElementById('photo-title'), 1.8)
	window.fitText( document.getElementById(('photo-subtitle')), 2 )
}
window.addEventListener("orientationchange", function(){
	console.log(screen.orientation.type); // e.g. portrait
	resizeTextToFitContainer()
});
onMounted(async ()=>{
	// Bloquear en modo apaisado
	try{
		await ScreenOrientation.lock({ orientation: 'landscape' }); // portrait
	}catch(e){/*empty */}
	const str = `${product.uuid}`
	setTimeout(()=>{
		generateQR(str)
		resizeTextToFitContainer()
		share()
	}, 100)
	// console.log(product)

})
</script>
<style lang="css">
	ion-content.no-padding::part(scroll){
		padding: 0;
	}
</style>