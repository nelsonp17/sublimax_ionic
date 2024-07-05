<template>
	<ion-page>
		<Searchbar />
		<ion-content :fullscreen="true" class="titillium-web-regular">
			<ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
				<ion-refresher-content></ion-refresher-content>
			</ion-refresher>
<!--			<div class="mt-5 mb-2 mx-4">Catálogo</div>-->
			<div class="box-content shadow-2xl grid grid-cols-2 py-2 px-4 text-gray-400">
				<div class="grid-1/2"><small>+{{ counts.products }} resultados</small></div>
				<div class="grid-1/2 text-right">

					<p class="btn-filter text-gray-400 p-0" id="click-trigger">
						<small>Filtar</small>
						<ion-icon aria-hidden="true" class="icon-top-position ml-1" :icon="caretDown"></ion-icon>
					</p>
					<ion-popover :keep-contents-mounted="true" trigger="click-trigger" trigger-action="click">
						<div class="py-1 px-2 text-small">
							Hello World!
						</div>
					</ion-popover>
				</div>
			</div>
			<div class="my-5">
				<!-- component -->
				<section class="grid grid-cols-2">
					<router-link class="border border-gray-300" v-for="product in products" :key="product.id" :to="`/products/${product.id}`" @click="()=> { saveToStorage('product', product) }">
						<div class="w-full h-48">
							<img :src="product.images[0].src" :alt="product.alt" class="rounded-none h-full mb-2">
						</div>
						<div class="p-3 mb-2">
							<p class="text-xl">${{ product.price }}</p>
							<p class="text-small">{{ product.name }}</p>
						</div>
					</router-link>
				</section>
			</div>


<!--			<img :src="codeQR">-->

			<ol class="mt-8 flex justify-center gap-1 text-xs font-medium" v-if="pagination.totalPages > 1">
				<li>
					<a
						href="#"
						class="inline-flex size-8 items-center justify-center"
						@click.prevent="handlePageChange(pagination.currentPage - 1)"
						:disabled="pagination.currentPage == 1"
					>
						<span class="sr-only">Prev Page</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-3 w-3"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				</li>

				<li class="mb-5" v-for="page in pageNumbers" :key="page">
					<a href="#"
					   @click.prevent="handlePageChange(page)"
					   class="block size-8 rounded border-black text-center leading-8 "
					   :class="{'bg-primary-theme': pagination.currentPage == page}">{{ page }}</a>
				</li>

				<li>
					<a
						href="#"
						class="inline-flex size-8 items-center justify-center"
						@click.prevent="handlePageChange(pagination.currentPage + 1)"
						:disabled="pagination.currentPage == pagination.totalPages"
					>
						<span class="sr-only">Next Page</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-3 w-3"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				</li>
			</ol>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {IonContent, IonIcon, IonPage, IonPopover, IonRefresher, IonRefresherContent} from '@ionic/vue';
import {computed, onMounted, reactive, ref} from "vue";
import {supabase} from "@/utils/supabase";
import {caretDown} from "ionicons/icons";

import Searchbar from "@/components/tab2/Searchbar.vue";
import {saveToStorage} from "@/utils/utils";

let products = ref([]);
const codeQR = ref('');
const pagination = reactive({
	pageSize: 30,
	currentPage: 1,
	totalItems: 0,
	totalPages: 1,
	data: [],
})
const usePagination = (state, fetchData) => {

	const pageNumbers = computed(() => {
		const start = Math.max(1, state.currentPage - 2);
		const end = Math.min(state.totalPages, state.currentPage + 2);
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	});

	const handlePageChange = (page:number) => {
		if (page < 1 || page > state.totalPages) return;
		state.currentPage = page;
		fetchData();
	};

	return {
		pageNumbers,
		handlePageChange,
	};
};



const counts = ref({
	products: 0
})


const preCode = () => {
	try{
		// document.querySelector('ion-toolbar.mytoolbar').shadowRoot.querySelector("div").style.background = "initial!important";

		const iconInner = document.querySelector('ion-icon.icon-top-position').shadowRoot.querySelector(".icon-inner")
		iconInner.style.position = "absolute";
		iconInner.style.top = "4px";

		console.log("codigo qr")
		generateQR();
	}catch (e){
		console.log("no cargado los style: ", e)
	}
}
async function getCountRow() {
	// env
	let { data: products, error: errorEnv } = await supabase.from('products').select('*', { count: 'exact' });
	if (errorEnv) {
		console.error('Error al obtener el número de registros:', errorEnv.message);
		return;
	}
	counts.value.products = <number>products?.length;
}

const fetchData = async () => {
	const offset = (pagination.currentPage - 1) * pagination.pageSize
	const limit = (offset + pagination.pageSize) - 1

	console.log("range", offset, limit)
	const { data, error } = await supabase
		.from('products')
		.select('id, name, description, price, uuid, tags, images (alt, src, title, product_id), subcategorys (name, category_id)')
		.order('created_at', { ascending: false })
		.range(offset, limit)

	if (error) console.error('Error fetching data:', error);
	else{
		products.value = data
		pagination.totalItems = data.length;

		const getRoundedIntegerPart = (number:number) => Math.ceil(number);
		pagination.totalPages = getRoundedIntegerPart(counts.value.products / pagination.pageSize)
	}
}
const { pageNumbers, handlePageChange } = usePagination(pagination, fetchData);


onMounted(async ()=>{
	setTimeout(()=> preCode(), 500)
	await getCountRow();
	await fetchData();
})
async function handleRefresh(event: CustomEvent) {
	setTimeout(async () => {
		await getCountRow();
		await fetchData();
		// Any calls to load data go here
		event.target.complete();
	}, 2000);
}
</script>
