<template>
	<ion-page>
		
		<ion-content :fullscreen="true" class="ion-padding titillium-web-regular no-change">
			<div class="flex flex-col mt-7 items-center justify-center">
				<img class="mb-5"
					src="/img/qr-code-scan-illustration-in-flat-style-mobile-phone-scanning-illustration-on-isolated-background-barcode-reader-in-hand-sign-business-concept-vector.png"
					alt="load-qr" />

				<b>Escanee un código QR</b>
				<ion-button class="w-full font-bold" @click="handleClickCamera">
					Subir desde una Imagen
				</ion-button>
				<ion-button class="mt-3 w-full font-bold" id="my-button" @click="onUploadClicked()">
					Escanear QR
				</ion-button>


				<!--<input type="file" accept="image/*;capture=camera"  @change="handleChangeCamera($event)"/>-->

				<form id="qrcode-capture">
					<div id="image-camera-qr">
						<qrcode-capture @error="onError" @detect="onDetect" :formats="['qr_code', 'code_128']"
							style="display: none"></qrcode-capture>
					</div>

					<div id="input-file">
						<qrcode-capture @error="onError" @detect="onDetect" :formats="['qr_code', 'code_128']"
							style="display: none"></qrcode-capture>
					</div>
				</form>

				<p class="decode-result mt-2">
					Último QR: <b>{{ result }}</b>
				</p>

				<p class="error" v-if="_debugger">{{ error }}</p>

				<div style="border: 2px solid black">
					<qrcode-stream :track="paintBoundingBox" @detect="onDetect" @error="onError"></qrcode-stream>
				</div>

				
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue';
import { closeOutline, flashlightOutline } from 'ionicons/icons';
import { computed, onMounted, ref } from 'vue';
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'

const result = ref('')
const error = ref('')
const _debugger = (import.meta.env.VITE_APP_ENV == 'development') ? true : false;

function handleClickCamera() {
	const d = document.querySelector("#image-camera-qr input[type='file']")
	d.setAttribute("accept", "image/*;capture=camera")
	document.querySelector("#image-camera-qr input[type='file']").click()
}

function onDetect(detectedCodes) {
	result.value = JSON.stringify(
		detectedCodes.map(code => code.rawValue)
	)
	console.log(result.value)

	document.querySelector("#qrcode-capture").reset()
}
function onError(err) {
	error.value = `[${err.name}]: `

	if (err.name === 'NotAllowedError') {
		error.value += 'you need to grant camera access permission'
	} else if (err.name === 'NotFoundError') {
		error.value += 'no camera on this device'
	} else if (err.name === 'NotSupportedError') {
		error.value += 'secure context required (HTTPS, localhost)'
	} else if (err.name === 'NotReadableError') {
		error.value += 'is the camera already in use?'
	} else if (err.name === 'OverconstrainedError') {
		error.value += 'installed cameras are not suitable'
	} else if (err.name === 'StreamApiNotSupportedError') {
		error.value += 'Stream API is not supported in this browser'
	} else if (err.name === 'InsecureContextError') {
		error.value += 'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
	} else {
		error.value += err.message
	}

	console.log(error.value)
}

const onUploadClicked = () => {
	document.querySelector("#input-file input[type='file']").click()
}

function paintBoundingBox(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
      const {
        boundingBox: { x, y, width, height }
      } = detectedCode

      ctx.lineWidth = 2
      ctx.strokeStyle = '#007bff'
      ctx.strokeRect(x, y, width, height)
    }
  }

onMounted(() => {
})

</script>
<style scoped>
.error {
	font-weight: bold;
	color: red;
}

.barcode-format-checkbox {
	margin-right: 10px;
	white-space: nowrap;
	display: inline-block;
}
</style>