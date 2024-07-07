<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>
					<router-link :to="previousLink">
						<ion-icon :icon="arrowBack" style="margin-right: 10px;"></ion-icon>
					</router-link>
					Producto {{ product.uuid }}
				</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true" class="ion-padding titillium-web-regular">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">
						<router-link :to="previousLink">
							<ion-icon :icon="arrowBack" style="margin-right: 10px;"></ion-icon>
						</router-link>
						Producto  {{ product.name }}
					</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
				<ion-refresher-content></ion-refresher-content>
			</ion-refresher>


		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {
	IonContent,
	IonHeader,
	IonIcon,
	IonPage,
	IonRefresher,
	IonRefresherContent,
	IonTitle,
	IonToolbar,
	modalController
} from '@ionic/vue';
import {arrowBack, chevronForward} from 'ionicons/icons';
import ProductModal from '../../components/tab1/ProductModal.vue';
import {supabase} from '@/utils/supabase';
import {onMounted, ref} from 'vue';
import {readFromStorage} from "@/utils/utils";

const props = defineProps({
})
const product = ref([]);
const previousLink = ref('');

async function getRows() {
	product.value = readFromStorage('product')
	previousLink.value = readFromStorage('previousLink')
}

onMounted(async () => {
	await getRows()
})


const abrirModal = async () => {
	const modal = await modalController.create({
		component: ProductModal, // El componente modal que generaste
	});
	await modal.present();

	const {role} = await modal.onWillDismiss();

	if (role === 'confirm') {
		await getRows()
	}
};

const edit = async (row) => {
	const modal = await modalController.create({
		component: ProductModal, // El componente modal que generaste
		componentProps: {
			id: row.id,
			name: row.name,
			description: row.description,
			subcategory_id: row.subcategory_id,
			tags: row.tags,
			uuid: row.uuid,
			price: row.price
		}, // Pasa los datos al modal
	});
	await modal.present();

	const {role} = await modal.onWillDismiss();
	if (role === 'confirm') {
		await getRows()
	}
};


// buscar por nombre (agregar buscar por uuid)
const handleRefresh = async (event: CustomEvent) => {
	setTimeout(async () => {
		// Any calls to load data go here
		event.target.complete();
		await getRows()
	}, 2000);
};


</script>

<style scoped>


.metadata-end-wrapper {
	position: absolute;

	top: 10px;
	inset-inline-end: 10px;

	font-size: 0.8rem;

	display: flex;
	align-items: center;
}

ion-label strong {
	display: block;

	max-width: calc(100% - 60px);

	overflow: hidden;

	text-overflow: ellipsis;
}

ion-label ion-note {
	font-size: 0.9rem;
}
</style>