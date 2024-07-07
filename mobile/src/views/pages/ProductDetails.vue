<template>
	<ion-page>
		<ToolbarProduct previous-link="/tabs/tab2/" :product-price="product.price"/>
		<ion-content :fullscreen="true" class="ion-padding titillium-web-regular">
			<ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
				<ion-refresher-content></ion-refresher-content>
			</ion-refresher>
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">
						<router-link to="/tabs/tab1">
							<ion-icon :icon="arrowBack" style="margin-right: 10px;"></ion-icon>
						</router-link>
						Categorías
					</ion-title>
				</ion-toolbar>
			</ion-header>


			<div class="container mx-auto max-w-sm">
				<div class="grid grid-cols-2 mb-2 text-small text-theme font-light">
					<h6 class="" v-if="product.stock">Disponible en Stock</h6>
					<h6 class="" v-else>Por pedido</h6>
					<h1 class="text-right">{{ fraction }}</h1>
				</div>

				<div class="mb-4">
					<div class="product-images">
						<div class="share-button-absolute">
							<button class="bg-gray-50 border circle px-2 py-1 mr-3" @click="bottomShare">
								<ion-icon class="center-icon favorite-icon" :icon="shareSocialOutline"/>
							</button>
							<button class="bg-gray-50 border circle px-2 py-1" @click="handleFavorite">
								<ion-icon class="center-icon favorite-icon" :icon="heartOutline" v-if="!favorite"/>
								<ion-icon class="center-icon favorite-icon" :icon="heart" v-else/>
							</button>
						</div>
						<div class="swiper w-full swiper-main" :id="'swiper-product-'+product.id">
							<!-- Additional required wrapper -->
							<div class="swiper-wrapper">
								<!-- Slides -->
								<div class="swiper-slide" v-for="image in product.images" :key="image.id" style="height: 60vh" @click="openModalHandler">
									<img :src="image.src" :alt="image.alt" class="w-full" style="height: 55vh">
								</div>
							</div>
							<!-- If we need pagination -->
							<div class="swiper-pagination"></div>
						</div>

					</div>

				</div>

				<h2 class="text-2xl font-bold mb-2">{{ product.name }}</h2>

				<p class="text-lg font-semibold mb-4">${{ product.price }}</p>


				<div class="mt-1.5 mb-3" v-if="product.colors">
					<p class="text-xs text-gray-500">Colores disponibles</p>

					<div class="mt-1.5 flex gap-1">
						<form>
							<fieldset>
								<legend class="sr-only">Color</legend>
							</fieldset>

							<div class="flex flex-wrap justify-center gap-1 [&:hover_label]:opacity-75">
								<div>
									<input type="checkbox" id="ColorSg" class="sr-only" />

									<label
										for="ColorSg"
										class="block size-4 cursor-pointer rounded-full bg-[#595759] transition hover:!opacity-100"
									>
										<span class="sr-only"> Space Gray </span>
									</label>
								</div>

								<div>
									<input type="checkbox" id="ColorS" class="sr-only" />

									<label
										for="ColorS"
										class="block size-4 cursor-pointer rounded-full bg-[#d2d3d4] transition hover:!opacity-100"
									>
										<span class="sr-only"> Silver </span>
									</label>
								</div>

								<div>
									<input type="checkbox" id="ColorP" class="sr-only" />

									<label
										for="ColorP"
										class="block size-4 cursor-pointer rounded-full bg-[#d89f97] transition hover:!opacity-100"
									>
										<span class="sr-only"> Pink </span>
									</label>
								</div>

								<div>
									<input type="checkbox" id="ColorG" class="sr-only" />

									<label
										for="ColorG"
										class="block size-4 cursor-pointer rounded-full bg-[#afbfab] transition hover:!opacity-100"
									>
										<span class="sr-only"> Pink </span>
									</label>
								</div>

								<div>
									<input type="checkbox" id="ColorSb" class="sr-only" />

									<label
										for="ColorSb"
										class="block size-4 cursor-pointer rounded-full bg-[#91a5bb] transition hover:!opacity-100"
									>
										<span class="sr-only"> Pink </span>
									</label>
								</div>
							</div>
						</form>
					</div>
				</div>


				<p class="text-theme mb-4">
					{{ product.description }}
				</p>

				<div class="text-theme mb-2">
					<h3>Metódos de Pago</h3>
					<ul class="list-disc ml-5 my-1">
						<li>Paypal</li>
						<li>Binance</li>
						<li>Pago Móvil</li>
						<li>Transferencia Bancaria</li>
					</ul>
				</div>

				<div class="mt-2 mb-8 block">
					<div class="position-relative">
						<div class="custom-number-input h-10 w-100p">
							<label for="custom-input-number" class="w-full text-theme text-sm font-semibold">
								Cantidad
							</label>
							<div class="counter-input h-10 w-100p rounded-lg border border-gray-100 relative bg-transparent mt-1">
								<button @click="decrement" class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20p cursor-pointer rounded-l-lg">
									<span class="m-auto text-2xl font-thin">
										<ion-icon :icon="removeOutline" class="center-icon"></ion-icon>
									</span>
								</button>
								<input type="number" class="text-center bg-gray-100 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default text-gray-700 w-100p" @focusout="changeCountFocusout" @keyup="changeCountKey" v-model="count"/>
								<button @click="increment" class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20p cursor-pointer rounded-r-lg">
									<span class="m-auto text-2xl font-thin">
										<ion-icon :icon="addOutline" class="center-icon"></ion-icon>
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div>Subtotal: ${{ subtotal }}</div>
				<ion-button class="py-2 rounded-md w-full mt-5" @click="contactWhat">Comprar</ion-button>


			</div>
			<ion-fab slot="fixed" vertical="bottom" horizontal="end" v-if="VITE_MODE_DEVELOPER || user.admin">
				<ion-fab-button @click="editProduct">
					<ion-icon :icon="pencil"></ion-icon>
				</ion-fab-button>
			</ion-fab>
		</ion-content>
		<modal-product ref="myModal" :product_id="product.id"></modal-product>
	</ion-page>
	
</template>
<script setup lang="ts">

import {addOutline, arrowBack, pencil, heart, heartOutline, removeOutline, shareSocialOutline} from "ionicons/icons";
import {
	IonContent, IonFab, IonFabButton,
	IonHeader,
	IonIcon,
	IonPage, IonRefresher, IonRefresherContent,
	IonTitle,
	IonToolbar,
	IonButton,
} from "@ionic/vue";
import ToolbarProduct from "@/components/tab2/ToolbarProduct.vue";
import {onMounted, ref} from "vue";
import {saveToStorage, readFromStorage, removeSpaceString, eventOrientation} from "@/utils/utils";
import {useRoute, useRouter} from "vue-router";
import ModalProduct from "@/components/tab2/ModalProduct.vue";
import {supabase} from "@/utils/supabase";
const VITE_MODE_DEVELOPER = import.meta.env.VITE_MODE_DEVELOPER;
const route = useRoute();
const router = useRouter();
const product = ref(null);
const product_id = route.params.product_id
const fraction = ref(null);
const myModal = ref<InstanceType<typeof  ModalProduct> | null>(null)
const user = ref({
	admin: true
})
const favorite = ref(false)

// const ion_content = ref('')
const count = ref(0)
const subtotal = ref(0)
let swiper = '';

const handleFavorite = () => {
	favorite.value = !favorite.value
}
eventOrientation();
const openModalHandler = () => {
	// ion_content.value.$el.classList.add('not-scroll')
	myModal.value?.open()
}
const contactWhat = () => {
	const mensage = `Saludos! He usado su aplicación móvil y he visto su producto ${product.value.uuid} y me interesa adquirir ${count.value}`
	const telefono = "584242102539"
	const templateLink = `https://wa.me/${telefono}?text=${mensage}`
	window.open(templateLink, '_blank');
}
const decrement = () => {
	try{
		if(count.value > 0){
			count.value--
		}
	}catch(e){
		count.value = 0
	}
	subtotal.value = count.value * product.value.price
}
const increment = () => {
	try{
		count.value++
	}catch(e){
		count.value = 0
	}
	subtotal.value = count.value * product.value.price
}
const changeCountKey = () => {
	if(count.value > 0) {
		subtotal.value = count.value * product.value.price
	}
}
const changeCountFocusout = () => {
	if(count.value < 0 || count.value.length == 0) {
		subtotal.value = 0
		count.value = 0
	}
}

const bottomShare = () => {
	// Share.share({
	// 	title: 'See cool stuff',
	// 	// text: 'Really awesome thing you need to see right meow',
	// 	url: 'http://ionicframework.com/',
	// 	dialogTitle: 'Share with buddies',
	// });
	saveToStorage('previousLink', location.pathname)
	router.push(`/share_image/`)
}
const editProduct = () => {
	saveToStorage('previousLink', location.pathname)
	router.push(`/products/${product.value.id}/edit/`)
}
const getProduct = ()=>{
	product.value = readFromStorage('product')
}
const initSwiper = () => {
	try{
		const swiperId = '#swiper-product-' + product_id
		swiper = new Swiper('.swiper-main' + swiperId, {
			// If we need pagination
			pagination: {
				el: '.swiper-pagination',
				dynamicBullets: true,
			}
		})
		const getNumber = () => {
			setTimeout(()=>{
				const elems = document.querySelectorAll(swiperId + " img")
				let finish = 0, active = 0;
				elems.forEach((elem, index)=>{
					const i = index +1
					if(elem.parentElement.classList[1] == 'swiper-slide-active'){
						active = index
					}
					finish = i
				})
				fraction.value = `${active+1}/${finish}`
				// console.log(tmp)
			}, 500)
		}

		swiper.on('setTransition', function() {
			getNumber()
		});
		getNumber()

	}catch(e){
		// console.log(e)
	}
}
onMounted(()=>{
	getProduct()
	initSwiper()


})
getProduct()
async function handleRefresh(event: CustomEvent) {
	setTimeout(async () => {
		const { data, error } = await supabase
			.from('products')
			.select('id, name, description, price, uuid, tags, images (alt, src, title, product_id), subcategorys (name, category_id)')
			.eq('id', product.value.id)

		if (error) console.error('Error fetching data:', error);
		else {
			swiper.destroy()
			initSwiper()
			// myModal.value?.resetSwiper()
			saveToStorage('product', data[0])
			product.value = readFromStorage('product')
		}
		event.target.complete();
	}, 2000);
}
</script>