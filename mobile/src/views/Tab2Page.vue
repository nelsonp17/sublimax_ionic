<template>
	<ion-page>
		<ion-header class="shadow-none">
			<ion-toolbar class="bg-gray-50 mytoolbar">
				<ion-title>
					<div class=" flex items-center justify-between my-2" style="font-size: 12px!important">
						<div class="flex bg-white w-full rounded border-blue-200-100 border">
							<button type="submit" class="my-1 px-1 text-gray-400" >
								<!--							<ion-icon aria-hidden="true" :icon="search" v-model="input_search" style="font-size: 16px!important; margin-top: -2px"/>-->
								<svg class="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" style="padding: 1px; height: 17px; enable-background:new 0 0 56.966 56.966;" xml:space="preserve">
									<path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
								</svg>
							</button>
							<input class="w-full bg-transparent py-2 text-gray-400 outline-none focus:outline-none " type="search" name="search" placeholder="Buscar producto..." />
						</div>
					</div>
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true" class="titillium-web-regular">
			<div class="mt-5 mb-2 mx-4">Catálogo</div>
			<div class="">
				<!-- component -->


				<!-- component -->
				<section class="grid grid-cols-2">
					<article class="border border-gray-300" v-for="product in products" :key="product.id">
						<div class="w-full h-48">
							<img :src="product.images[0].src" :alt="product.alt" class="rounded-none h-full mb-2">
						</div>
						<div class="p-3 mb-2">
							<p class="text-xl">${{ product.price }}</p>
							<p class="text-small">{{ product.name }}</p>
						</div>
					</article>
				</section>
			</div>



		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon} from '@ionic/vue';
import {onMounted, ref} from "vue";
import {supabase} from "@/utils/supabase";
import {search} from "ionicons/icons";

const products = ref([]);
const input_search = ref('');

const preCode = () => {
	const toolbarElement = document.querySelector('ion-toolbar');
	const t = toolbarElement.shadowRoot;

	// console.log(t)
	if (t) {
		toolbarElement.shadowRoot.querySelector("div").style.background = "initial!important";
	}
}
// Suponiendo que tienes una referencia al elemento de la barra de herramientas
onMounted(()=>{
	setTimeout(()=> preCode(), 0)
})

const getProduct = async () => {
	let { data: p, error } = await supabase
		.from('products')
		.select('id, name, description, price, uuid, tags, images (alt, src, title, product_id), subcategorys (name, category_id)')

	console.log(p, error)
	if(error){
		console.log(error)
		return;
	}
	products.value = p
}

onMounted(()=>{
	getProduct();
})

</script>
