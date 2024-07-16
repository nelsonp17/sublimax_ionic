<template>
	<ion-header class="shadow-none">
		<ion-toolbar class="bg-primary-theme mytoolbar">
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
import {onBeforeUpdate, onMounted, ref} from "vue";

defineProps({
	productPrice: Number,
	previousLink: String
})
//const toolbar = ref(null)
const preCode = () => {
	try{
		const elem = document.querySelector('ion-toolbar.mytoolbar').shadowRoot
		elem.firstChild.style.background = "initial!important";
	}catch (e){
		//console.log("no cargado los style: ", e)
	}

}
onBeforeUpdate(()=>{
	//preCode()
	//console.log( route.path )
	setTimeout(()=> preCode(), 500)
})


</script>
