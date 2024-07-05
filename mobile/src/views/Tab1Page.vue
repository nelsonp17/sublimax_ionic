<template>
	<ion-page>
		<ion-content :fullscreen="true" class="ion-padding titillium-web-regular">
			<ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
				<ion-refresher-content></ion-refresher-content>
			</ion-refresher>
			<div id="container">
				<p>Hola <br><b>{{ username }}</b></p>
				<ion-card class="card-1 mt-2">
					<ion-card-content style="display: flex;">
						<div style="margin: auto;" class="text-theme">
							<ion-avatar aria-hidden="true" slot="start" style="height: 40px; width: 10px;">
								<ion-icon aria-hidden="true" :icon="personCircleOutline" style="font-size: 2em; margin-left: .5em;" />
							</ion-avatar>
							<ion-label>Mis Datos</ion-label>
						</div>
						<div style="margin: auto;" class="text-theme">
							<ion-avatar aria-hidden="true" slot="end" style="height: 40px; width: 10px;">
								<ion-icon aria-hidden="true" :icon="call" style="font-size: 2em; margin-left: .5em;" />
							</ion-avatar>
							<ion-label>Contacto</ion-label>
						</div>
					</ion-card-content>
				</ion-card>


				<div class="mt-2" v-if="admin == true">
					<p class="text-theme"> <b>User Admin</b> </p>
					<ion-card class="card-1">
						<ion-card-content>
							<ion-label>
								<p class="text-theme"> <b>Productos</b> </p>
							</ion-label>
							<div class="text-theme" style="clear: both; height: 40px;">
								<div style="float:left;">
									<ion-label>
										<p style="line-height: 40px;">Agregar un producto</p>
									</ion-label>
								</div>
								<div style="float:right">
									<ion-button shape="round">Agregar</ion-button>
								</div>
							</div>

						</ion-card-content>
					</ion-card>


					<ion-list :inset="true" style="margin-left: 0; margin-right: 0; padding:0" class="myList mt-2">
						<ion-item :button="true" v-if="VITE_MODE_DEVELOPER == 'true'" @click="actionLink('/environment')">
							<ion-icon color="primary" slot="start" :icon="listCircle" size="large" style="margin-right: 10px"></ion-icon>
							<ion-label>Environment</ion-label>
							<ion-note slot="end">{{ tablesCount.environment }}</ion-note>
						</ion-item>

						<ion-item :button="true" @click="actionLink('/categorys')">
							<ion-icon color="primary" slot="start" :icon="listCircle" size="large" style="margin-right: 10px"></ion-icon>
							<ion-label>Categorías</ion-label>
							<ion-note slot="end">{{ tablesCount.category }}</ion-note>
						</ion-item>

						<ion-item :button="true" @click="actionLink('/subcategorys')">
							<ion-icon color="primary" slot="start" :icon="listCircle" size="large" style="margin-right: 10px"></ion-icon>
							<ion-label>Subcategorías</ion-label>
							<ion-note slot="end">{{ tablesCount.subcategory }}</ion-note>
						</ion-item>

						<ion-item :button="true" @click="actionLink('/products')">
							<ion-icon color="primary" slot="start" :icon="listCircle" size="large" style="margin-right: 10px"></ion-icon>
							<ion-label>Productos</ion-label>
							<ion-note slot="end">{{ tablesCount.products }}</ion-note>
						</ion-item>
					</ion-list>
				</div>


				<div class="mt-2">
					<p><b>Información</b></p>
					<ion-list class="myList" lines="inset" style="margin-top: 0; padding-top:0">
						<ion-item>
							<ion-label>Términos y condiciones <ion-icon aria-hidden="true" :icon="chevronForward"
																		style="float: right" /></ion-label>
						</ion-item>
						<ion-item>
							<ion-label>Seguridad <ion-icon aria-hidden="true" :icon="chevronForward"
														   style="float: right" /></ion-label>
						</ion-item>
						<ion-item>
							<ion-label>Privacidad <ion-icon aria-hidden="true" :icon="chevronForward"
															style="float: right" /></ion-label>
						</ion-item>
					</ion-list>
					<ion-list class="myList" lines="none" style="margin-top: 0; padding-top:0">
						<ion-item>
							<ion-label>
								<p class="color: #BDBDBD!important">Versión {{ VITE_VERSION_APP }} </p>
							</ion-label>
						</ion-item>
					</ion-list>
					<ion-list class="myList" lines="none">
						<ion-item>
							<ion-toggle :checked="paletteToggle" @ionChange="toggleChange($event)" justify="space-between"
							>Modo Oscuro</ion-toggle
							>
						</ion-item>
						<ion-item>
							<ion-label>Cerrar Sessión <ion-icon aria-hidden="true" :icon="exitOutline"
																style="float: right" /></ion-label>
						</ion-item>
					</ion-list>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {
	IonPage,
	IonContent,
	IonNote,
	IonIcon,
	IonList,
	IonItem,
	IonAvatar,
	IonCard,
	IonRefresherContent,
	IonRefresher,
	IonLabel,
	IonToggle,
	IonCardContent,
	IonButton,
} from '@ionic/vue';
import {call, chevronForward, exitOutline, listCircle, personCircleOutline} from "ionicons/icons";

const username = "Nelson";
const email = "nelsonportillo982@gmail.com";
const admin = true;

import {ref, onMounted} from 'vue';
import { supabase } from '@/utils/supabase'
import { useRoute, useRouter} from 'vue-router'
import modeDark from "@/utils/modeDark";

const router = useRouter()
const route = useRoute()

defineProps({
	username: String,
	email: String,
	admin: Boolean,
});

const VITE_VERSION_APP = import.meta.env.VITE_VERSION_APP;
const VITE_MODE_DEVELOPER = import.meta.env.VITE_MODE_DEVELOPER;
const mD = new modeDark()
const { paletteToggle, toggleChange } = mD.useDark()

const actionLink = (url:string) => {
	router.push({path:url})
}
const handleRefresh = async (event: CustomEvent) => {
	setTimeout(async ()=>{
		await getCountRow()
		// Any calls to load data go here
		event.target.complete();
	}, 2000)
};
// contidad de registros de las tablas
const tablesCount = ref({
	products: 0,
	category: 0,
	subcategory: 0,
	environment: 0
});

async function getCountRow() {
	// env
	let { data: environment, error: errorEnv } = await supabase.from('environment').select('*', { count: 'exact' });
	if (errorEnv) {
		console.error('Error al obtener el número de registros:', errorEnv.message);
		return;
	}
	// prod
	let { data: products, error: errorProducts } = await supabase.from('products').select('*', { count: 'exact' });
	if (errorProducts) {
		console.error('Error al obtener el número de registros:', errorProducts.message);
		return;
	}

	// category
	let { data: category, error: errorCategory } = await supabase.from('categorys').select('*', { count: 'exact' });
	if (errorCategory) {
		console.error('Error al obtener el número de registros:', errorCategory.message);
		return;
	}

	// subcategory
	let { data: subcategory, error: errorSubcategory } = await supabase.from('subcategorys').select('*', { count: 'exact' });
	if (errorSubcategory) {
		console.error('Error al obtener el número de registros:', errorSubcategory.message);
		return;
	}


	tablesCount.value.environment = environment.length;
	tablesCount.value.subcategory = subcategory.length;
	tablesCount.value.category = category.length;
	tablesCount.value.products = products.length;

}

onMounted(() => {
	console.log("onMounted")
	getCountRow()
});

</script>
