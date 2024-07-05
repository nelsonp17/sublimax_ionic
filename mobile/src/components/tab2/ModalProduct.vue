<template>
	<div>
		<div class="modal product-modal" ref="modal">
			<div class="modal-wrapper">
				<div class="modal-content my-7">
					<div class="modal-header grid grid-cols-2 text-white px-5 mb-10">
						<div class="text-left">
							<button @click="close" class="">
								<ion-icon :icon="arrowBack"></ion-icon>
							</button>
						</div>
						<div class="text-right">
							<h1 class="">{{ fraction }}</h1>
						</div>
					</div>
					<div class="modal-body">
						<div class="">
							<div class="swiper-black swiper swiper2 bg-black text-white w-full" :id="'swiper-product-modal-'+product_id">
								<!-- Additional required wrapper -->
								<div class="swiper-wrapper">
									<!-- Slides -->
									<div ref="swiperSlide" class="swiper-slide" v-for="image in product.images" :key="image.id" style="height: 75vh">
										<img :src="image.src" :alt="image.alt" class="w-full" style="height: 65vh">
									</div>
								</div>
								<!-- If we need pagination -->
								<div class="swiper-pagination"></div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {readFromStorage, removeSpaceString} from "@/utils/utils";
import {IonIcon} from "@ionic/vue";
import {arrowBack} from "ionicons/icons";


const modal = ref<InstanceType<any> | null>(null);
const product = ref(null);
const fraction = ref(null)
const swiperSlide = ref([])
const props = defineProps(['product_id'])
const close = ()=>{
	console.log("close modal")
	modal.value?.removeAttribute('open')
}
const open = ()=>{
	console.log("abrir modal")
	modal.value?.setAttribute('open', 'true')
	getProduct()
	resetSwiper()

}
const getImage = () => {
	console.log("ejecutado desde el hijo")
	// swiperSlide.value.forEach((value, index) => {
	// 	console.log(value)
	// 	console.log(index)
	// 	console.log("  ")
	// })
	return true
}
const getProduct = ()=>{
	product.value = readFromStorage('product')
}
let swiper2 = ''
const initSwiper2 = () => {
	try{
		const swiperId = '#swiper-product-modal-' + props.product_id
		swiper2 = new Swiper('.swiper2' + swiperId, {
			// If we need pagination
			pagination: {
				el: '.swiper-pagination',
				dynamicBullets: true,
			},

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

		swiper2.on('setTransition', function() {
			getNumber()
		});
		getNumber()
	}catch(e){
		// console.log(e)
	}
}
const resetSwiper = () => {
	console.log("Destruye modal")
	swiper2.destroy()
	initSwiper2()
}
onMounted(()=>{
	getProduct()
	initSwiper2()
})
getProduct()
defineExpose({
	getImage,
	close,
	open
})
</script>