<template>
	<ion-page>
		<ion-content :fullscreen="true" class="ion-padding titillium-web-regular">
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

			<div id="el" class="w-full">
				<img :src="myNode" alt="">
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
/* ES6 */
import * as htmlToImage from 'html-to-image';
import {readFromStorage} from "@/utils/utils";
import {onMounted, ref} from "vue";
import QRious from "qrious";
import {Share} from "@capacitor/share";
import {useRouter} from "vue-router";
import {IonContent, IonPage} from "@ionic/vue";
import { FileSharer } from '@byteowls/capacitor-filesharer';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

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
				setTimeout(async ()=>{
					await handleShareImage()
				}, 500)
			});
	}catch (e){ /* empty */ }
}
const handleFileSharer = () => {
	FileSharer.share({
		filename: "share_product.jpeg",
		contentType: "image/jpeg",
		// If you want to save base64:
		base64Data: myNode.value,
		// If you want to save a file from a path:
		// path: "../../file.pdf",
	}).then(() => {
		// do sth
	}).catch(error => {
		console.error("File sharing failed", error.message);
	});
}
const handleShare = async () => {
	await Share.share({
		// title: 'See cool stuff',
		// text: 'Really awesome thing you need to see right meow',
		url: myNode.value,
		// dialogTitle: 'Share with buddies',
	}).finally(()=>{
		router.push(previousLink)
	})
}
async function handleShareImage(base64Data: string) {
	const fileName = 'share_product.jpeg';

	// Guardar la imagen en un archivo local
	await Filesystem.writeFile({
		path: fileName,
		data: base64Data,
		directory: Directory.Cache,
	});

	// Obtener la URI del archivo guardado
	const uriResult = await Filesystem.getUri({
		directory: Directory.Cache,
		path: fileName,
	});

	// Compartir el archivo
	await Share.share({
		title: 'Mi imagen compartida',
		text: '¡Mira esta imagen!',
		url: uriResult.uri,
	}).finally(()=>{
		router.push(previousLink)
	})
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
	// console.log(product)

})
</script>