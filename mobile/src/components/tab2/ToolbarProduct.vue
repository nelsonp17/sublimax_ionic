<template>
	<ion-header class="shadow-none">
		<ion-toolbar class="bg-primary-theme mytoolbar" ref="toolbar">
			<ion-title>
				<div class="flex items-center justify-between my-2" style="font-size: 12px!important">
					<router-link to="/tabs/tab2/">
						<ion-icon :icon="chevronBack" class="mr-3" style="font-size: 24px!important"></ion-icon>
					</router-link>

					<div class="w-full text-center">
						<p class="text-xl">Llevalo por <b>${{ productPrice }}</b></p>
					</div>
				</div>
			</ion-title>
		</ion-toolbar>
	</ion-header>
</template>

<script setup lang="ts">
import {chevronBack} from "ionicons/icons";
import {IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/vue";
import {onMounted, ref} from "vue";

defineProps({
	productPrice: Number,
	previousLink: String
})
const toolbar = ref(null)
const preCode = () => {
	try{
		const elem = toolbar.value.$el
		elem.shadowRoot.querySelector(".toolbar-background").style.background = "initial!important";
	}catch (e){
		//console.log("no cargado los style: ", e)
	}
}
// Suponiendo que tienes una referencia al elemento de la barra de herramientas
onMounted(()=>{
	preCode()
	setTimeout(()=> preCode(), 500)
})

</script>
