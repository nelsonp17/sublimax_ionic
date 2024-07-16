<template>
	<ion-page>
		<ToolbarProduct previous-link="/tabs/tab2/" :product-price="product.price" />
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
								<ion-icon class="center-icon favorite-icon" :icon="shareSocialOutline" />
							</button>
							<button class="bg-gray-50 border circle px-2 py-1" @click="handleFavorite">
								<ion-icon class="center-icon favorite-icon" :icon="heartOutline" v-if="!favorite" />
								<ion-icon class="center-icon favorite-icon" :icon="heart" v-else />
							</button>
						</div>
						<div class="swiper w-full" :id="'swiper-product-'+product.id">
							<!-- Additional required wrapper -->
							<div class="swiper-wrapper">
								<!-- Slides -->
								<div class="swiper-slide" v-for="image in product.images" :key="image.id"
									style="height: 60vh" @click="openModalHandler">
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

									<label for="ColorSg"
										class="block size-4 cursor-pointer rounded-full bg-[#595759] transition hover:!opacity-100">
										<span class="sr-only"> Space Gray </span>
									</label>
								</div>

								<div>
									<input type="checkbox" id="ColorS" class="sr-only" />

									<label for="ColorS"
										class="block size-4 cursor-pointer rounded-full bg-[#d2d3d4] transition hover:!opacity-100">
										<span class="sr-only"> Silver </span>
									</label>
								</div>

								<div>
									<input type="checkbox" id="ColorP" class="sr-only" />

									<label for="ColorP"
										class="block size-4 cursor-pointer rounded-full bg-[#d89f97] transition hover:!opacity-100">
										<span class="sr-only"> Pink </span>
									</label>
								</div>

								<div>
									<input type="checkbox" id="ColorG" class="sr-only" />

									<label for="ColorG"
										class="block size-4 cursor-pointer rounded-full bg-[#afbfab] transition hover:!opacity-100">
										<span class="sr-only"> Pink </span>
									</label>
								</div>

								<div>
									<input type="checkbox" id="ColorSb" class="sr-only" />

									<label for="ColorSb"
										class="block size-4 cursor-pointer rounded-full bg-[#91a5bb] transition hover:!opacity-100">
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

				<div class="text-theme my-5" v-if="myTags.length > 0">
					<h3>Etiquetas</h3>
					<ion-chip class="mt-3" v-for="(tag,i) in myTags" :key="i">
						<ion-icon :icon="pricetagOutline" color="primary"></ion-icon>
						<ion-label>{{ tag }}</ion-label>
					</ion-chip>
				</div>

				<div class="text-theme mb-2" v-if="methodPayment.length > 0">
					<h3>Metódos de Pago</h3>
					<ul class="list-disc ml-5 my-1">
						<li v-for="(pay,i) in methodPayment" :key="i">{{pay}}</li>
					</ul>
				</div>

				<div class="mt-2 mb-8 block" v-if="isAddingCart==false">
					<div class="position-relative">
						<div class="custom-number-input h-10 w-100p">
							<label for="custom-input-number" class="w-full text-theme text-sm font-semibold">
								Cantidad
							</label>
							<div
								class="counter-input h-10 w-100p rounded-lg border border-gray-100 relative bg-transparent mt-1">
								<button @click="decrement"
									class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20p cursor-pointer rounded-l-lg">
									<span class="m-auto text-2xl font-thin">
										<ion-icon :icon="removeOutline" class="center-icon"></ion-icon>
									</span>
								</button>
								<input type="number"
									class="text-center bg-gray-100 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default text-gray-700 w-100p"
									@focusout="changeCountFocusout" @keyup="changeCountKey" v-model="count" />
								<button @click="increment"
									class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20p cursor-pointer rounded-r-lg">
									<span class="m-auto text-2xl font-thin">
										<ion-icon :icon="addOutline" class="center-icon"></ion-icon>
									</span>
								</button>
							</div>
						</div>
					</div>
					<div>Subtotal: ${{ subtotal }}</div>
				</div>
				<div class="mt-8 mb-12" v-else>
					<p class="text-small text-center">Agregado al carrito de compras</p>
					<ion-button color="secondary" expand="block" @click="$router.push('/cart/')">Ver detalles</ion-button>
				</div>

				
				<ion-button expand="block" color="secondary" class="mt-3 mb-12" @click="contactWhat" v-if="isAddingCart==false">Comprar</ion-button>



			</div>

			<ion-fab slot="fixed" vertical="bottom" horizontal="end">
				<ion-fab-button>
					<ion-icon :icon="chevronUp"></ion-icon>
				</ion-fab-button>
				<ion-fab-list side="top">
					<ion-fab-button @click="addCartShopping">
						<ion-icon :icon="cart" class="text-theme"></ion-icon>
					</ion-fab-button>
					<ion-fab-button @click="editProduct" v-if="VITE_MODE_DEVELOPER || user.admin">
						<ion-icon :icon="pencil" class="text-theme"></ion-icon>
					</ion-fab-button>
				</ion-fab-list>
			</ion-fab>
		</ion-content>
		<modal-product ref="myModal" :product_id="product.id"></modal-product>
		<ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="toast.duration"
			@didDismiss="toast.isOpen=false" @click="toast.isOpen=false"></ion-toast>
	</ion-page>

</template>
<script setup lang="ts">

import {addOutline, arrowBack, pencil, heart, heartOutline, removeOutline, shareSocialOutline, pricetagOutline, close, cart, chevronUp, } from "ionicons/icons";
import {
	IonContent, IonFab, IonFabButton,
	IonHeader,
	IonIcon,
	IonPage, IonRefresher, IonRefresherContent,
	IonTitle,
	IonToolbar,
	IonButton,
	IonLabel,
	IonChip,
	IonToast,
	IonFabList,
} from "@ionic/vue";
import ToolbarProduct from "@/components/tab2/ToolbarProduct.vue";
import {onMounted, reactive, ref} from "vue";
import {saveToStorage, readFromStorage, removeSpaceString, eventOrientation} from "@/utils/utils";
import {useRoute, useRouter} from "vue-router";
import ModalProduct from "@/components/tab2/ModalProduct.vue";
import {supabase} from "@/utils/supabase";
import { session } from '@/utils/auth';


const VITE_MODE_DEVELOPER = import.meta.env.VITE_MODE_DEVELOPER;
const VITE_APP_NAME = import.meta.env.VITE_APP_NAME;
const route = useRoute();
const router = useRouter();
const product = ref({});
const product_id = route.params.product_id
const fraction = ref(null);
const myModal = ref<InstanceType<typeof  ModalProduct> | null>(null)
const user = ref({
	admin: true
})
const isAddingCart = ref(false)
const cartShoppint = ref(null)
const toast = reactive({
	isOpen: false,
	duration: 2000,
	message: '',
})
const methodPayment = ref([])
const favorite = ref(false)
const myTags = ref([])

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
const contactWhat = async () => {
	//const mensage = `Saludos! He usado su aplicación móvil y he visto su producto ${product.value.uuid} y me interesa adquirir ${count.value}`
	try{
		let phone = await readFromStorage('whatsapp')
		let message = await readFromStorage('whatsapp_message')
		phone = phone.value
		message = message.value
		phone = phone.replace("+", "")
		message = message.replace("${app_name}", VITE_APP_NAME)
		message = message.replace("${product}", product.value.uuid)
		const templateLink = `https://wa.me/${phone}?text=${message}`
		window.open(templateLink, '_blank');
	}catch(e){
		console.log(e)
		toast.message = "Error: ha ocurrido un error"
		toast.isOpen = true
	}
	
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
	saveToStorage('isQuery', true)
	//router.push(`/products/${product.value.id}/edit/`)
	router.push(`/products/?editing=${product.value.id}`)
}
const getProduct = ()=>{
	product.value = <object>readFromStorage('product')
	const met = <object>readFromStorage('method_payment')
	
	try{
		myTags.value = product.value.tags.split(", ");
		methodPayment.value = met.value.split(", ");
	}catch(e){console.log(e)}
	
}
const initSwiper = () => {
	try{
		const swiperId = '#swiper-product-' + product_id
		swiper = new Swiper(swiperId, {
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
		//console.log(swiper)
		getNumber()

	}catch(e){
		//console.log(e)
	}
}
const getAddingCartShopping = async (message_show:boolean=false) => {
	try{
		const email = session.session.user.email
		let cart = await readFromStorage('cart') || null

		// recupera el carrito
		if(cart==null || cart=='' || cart==undefined){
			console.log('busca el carrito')
			let {data, error} = await supabase.from('user_cart_shopping').select('*').eq('user_email', email)
			if(!error && data!=null){
				await saveToStorage('cart', data)
			}
			cart = data;
		}
		console.log(cart)

		// crea el carrito por primera vez
		if(cart != null || typeof cart == 'object'){
			if(cart.length == 0){
				console.log('crea el carrito')
				let {data, error} = await supabase.from('user_cart_shopping').insert({user_email:email})
				if(!error && data!=null){
					await saveToStorage('cart', data)
				}
				cart = data;
			}
		}
		const cartId = cart[0].id
		const productId = product.value.id
		//console.log(cartId, productId)
		// busca si el item esta en el carrito actual
		let {data: dataUserCart, error: errorUserCart} = await supabase.from('user_cart_shopping').select('id, user_email, cart_shopping (product_id, cart_id, quantity)').eq('user_email', email)
		if(!errorUserCart && dataUserCart!=null){
			// no hago nada
			console.log(dataUserCart)
			if(typeof dataUserCart == 'object'){
				if(dataUserCart.length > 0){
					dataUserCart[0].cart_shopping.forEach((elem, index) => {
						if(elem.cart_id == cartId && elem.product_id == productId){
							if(message_show){
								toast.message = "Este producto ya se encuentra en tu carrito";
								toast.isOpen = true
							}
							
							isAddingCart.value = true
							cartShoppint.value = elem
							return;
						}
					})
				}
			}
			//return
		}

	}catch(e){
		console.log(e)
	}
}
const addCartShopping = async () => {
	if(count.value <= 0) {
		toast.message = "Ingrese la cantidad de producto que desea";
		toast.isOpen = true;
		return
	}
	//console.log(session)
	try{
		getAddingCartShopping(true)

		// agrego el item al carrito
		let {error:ErrorCart} = await supabase.from('cart_shopping').insert({'cart_id': cartId, 'product_id': productId, 'quantity': count.value})
		if(!ErrorCart){
			//console.log(ErrorCart)
			toast.message = "Agregado al carrito";
			toast.isOpen = true;
			count.value = 0
			changeCountFocusout()
			isAddingCart.value = true
		}

	}catch(e){
		toast.message = "Ah ocurrido un error"
		toast.isOpen = true
	}
	
}
onMounted(()=>{
	getProduct()
	getAddingCartShopping()
	setTimeout(()=>initSwiper(), 500)
})
//getProduct()
async function handleRefresh(event: CustomEvent) {
	setTimeout(async () => {
		getAddingCartShopping()
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