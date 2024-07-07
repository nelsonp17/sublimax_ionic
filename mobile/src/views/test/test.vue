<template>
	<div>
		<button type="button" class="showModal" @click="openModal">Show modal</button>
		<div class="modal product-modal" ref="modal">
			<div class="modal-wrapper">
				<div class="modal-content my-7">
					<div class="modal-header grid grid-cols-2 text-white px-5 mb-10">
						<div class="text-left">
							<button @click="closeModal" class=""><-</button>
						</div>
						<div class="text-right">
							<h1 class="">{{ fraction }}</h1>
						</div>
					</div>
					<div class="modal-body">
<!--						<div ref="swiperContainer">-->
<!--&lt;!&ndash;							<div ref="swiperSlide" class="slide" v-for="image in product.images" :key="image.id">&ndash;&gt;-->
<!--&lt;!&ndash;								<img :src="image.src" :alt="image.alt">&ndash;&gt;-->
<!--&lt;!&ndash;							</div>&ndash;&gt;-->
<!--							<div ref="swiperSlide" class="slide" v-for="image in imgs" :key="image">-->
<!--								<img :src="image"/>-->
<!--							</div>-->
<!--						</div>-->
						<div class="">
							<div class="swiper-black swiper bg-black text-white w-full">
								<!-- Additional required wrapper -->
								<div class="swiper-wrapper">
									<!-- Slides -->
									<div class="swiper-slide" v-for="image in product.images" :key="image.id" style="height: 75vh">
										<img :src="image.src" :alt="image.alt" class="w-full" style="height: 65vh">
									</div>
								</div>
								<!-- If we need pagination -->
								<div class="swiper-pagination"></div>
							</div>
						</div>



								<!--						<img src="https://pixabay.com/get/g608b0f9de35d3f244a9b3d2bce086a6d42b26c6a87df76f7d8395e626fd12ffe45bb50c939dd911409fc5ac852677e1e236491064377e381443915b62037ae62_640.jpg" alt="">-->
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {readFromStorage, removeSpaceString} from "@/utils/utils";

const modal = ref(null);
const product = ref(null);
const fraction = ref(null)
const imgs = [
	'https://pixabay.com/get/g608b0f9de35d3f244a9b3d2bce086a6d42b26c6a87df76f7d8395e626fd12ffe45bb50c939dd911409fc5ac852677e1e236491064377e381443915b62037ae62_640.jpg',
	'https://pixabay.com/get/g31fb0946863a19c2cb062e8d2840ecabe87456f3b82ff2368c3ee9896b05721559019780fbbbacd11c966c005923f008_640.png',
	'https://pixabay.com/get/g85dfb672280e4007a42e242b788bd25226155ec019b7ba76ac3706380a06295f08aed371b69071d27386388917441a6466d5324c9143bec60f1465a69f78d832_640.jpg',
	'https://pixabay.com/get/g853254e34265068cc786ea662a6e27d53e6d54538e6d1c929e42703271aae676265d7352b64345da1914b31f34dae4c1d84a9c612507955b0112fe732ea73613_640.jpg',
]
const openModal = ()=>{
	modal.value.setAttribute('open', 'true')
}
const closeModal = ()=>{
	modal.value.removeAttribute('open')
}

const getProduct = ()=>{
	product.value = readFromStorage('product')
}
onMounted(()=>{
	getProduct()

	setTimeout(()=>{
		try{
			const swiper = new Swiper('.swiper', {
				// If we need pagination
				pagination: {
					el: '.swiper-pagination',
					dynamicBullets: true,
				},
			})

			swiper.on('setTransition', function() {
				try{
					let val = document.querySelector(".swiper-slide.swiper-slide-active").getAttribute("aria-label")
					fraction.value = removeSpaceString(val)
				}catch (e){
					console.log(e)
				}
			});
		}catch(e){
			console.log(e)
		}
	}, 2000)

})
getProduct()
</script>