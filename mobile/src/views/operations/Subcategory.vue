<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>
					<router-link to="/tabs/tab1">
						<ion-icon :icon="arrowBack" style="margin-right: 10px;"></ion-icon>
					</router-link>
					Subcategorías
				</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true" class="ion-padding titillium-web-regular">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">
						<router-link to="/tabs/tab1">
							<ion-icon :icon="arrowBack" style="margin-right: 10px;"></ion-icon>
						</router-link>
						Subcategorías
					</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
				<ion-refresher-content></ion-refresher-content>
			</ion-refresher>

			<div>
				<p><b>Subcategorías de productos</b></p>
				<ion-card class="card-1">
					<ion-card-content>
						<ion-label>
							<p><b>Subcategorías</b></p>
						</ion-label>
						<div style="clear: both; height: 40px; margin-top:10px;">
							<div style="float:left;">
								<ion-label><p style="line-height: 20px;">Agregar <br>una Subcategoría</p>
								</ion-label>
							</div>
							<div style="float:right">
								<ion-button shape="round" @click="abrirModal()">Agregar</ion-button>
							</div>
						</div>
					</ion-card-content>
				</ion-card>
			</div>

			<div class="mt-5">
				<p><b>Todos los registros</b></p>
				<ion-searchbar class="ion-searchbar"
								placeholder="Buscar"
								@ionInput="buscar"
				></ion-searchbar>
				<ion-card class="card-1" v-for="row in rows" :key="row.id" style="margin-top: 15px" @click=edit(row)>
					<ion-card-content style="margin:0;padding:0;">
						<ion-list :inset="true" class="myList" style="margin:0;padding:0;">
							<ion-item :button="true" :detail="false">
								<div class="unread-indicator-wrapper" slot="start">
									<div class="unread-indicator"></div>
								</div>
								<ion-label>
									<ul class="not-list text-small">
										<li>Nombre: <span style="color: #757575">{{ row.name }}</span></li>
										<li>Categoría: <span style="color: #757575">{{
												(row.category_id == null) ? 'No asignado' : row.categorys.name
											}}</span></li>
									</ul>
								</ion-label>
								<div class="metadata-end-wrapper" slot="end">
									<ion-note color="medium"><p style="font-size:10px">{{
											formatDate(row.created_at)
										}}</p></ion-note>
									<ion-icon color="medium" :icon="chevronForward"></ion-icon>
								</div>
							</ion-item>
						</ion-list>
					</ion-card-content>
				</ion-card>

			</div>
			<br/><br/>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonNote,
	IonPage,
	IonRefresher,
	IonRefresherContent,
	IonSearchbar,
	IonTitle,
	IonToolbar,
	modalController
} from '@ionic/vue';
import {arrowBack, chevronForward} from 'ionicons/icons';
import SubcategoryModal from '../../components/tab1/SubcategoryModal.vue';
import {supabase} from '@/utils/supabase';
import {buscarCoincidencias, formatDateToHuman} from '@/utils/utils';
import {onMounted, ref} from 'vue';

const subcategorys = ref([]);
const rows = ref([]);

async function getRows() {
	const {data: subcategorys} = await supabase
		.from('subcategorys')
		.select(`id, created_at, name, category_id, categorys (name)`)
		.order('name');

	if (subcategorys?.length > 0) {
		subcategorys.value = subcategorys
	}
	rows.value = subcategorys.value
}

onMounted(async () => {
	await getRows()
})

const buscar = (event: { target: { value: any; }; }) => {
	const textoBusqueda = event.target.value;
	if (textoBusqueda == '') {
		rows.value = subcategorys.value
	} else {
		rows.value = buscarCoincidencias(textoBusqueda);

	}
	console.log('Texto de búsqueda:', textoBusqueda);

}

const abrirModal = async () => {
	const modal = await modalController.create({
		component: SubcategoryModal, // El componente modal que generaste
	});
	await modal.present();

	const {role} = await modal.onWillDismiss();

	if (role === 'confirm') {
		await getRows()
	}
};

const edit = async (row) => {
	const modal = await modalController.create({
		component: SubcategoryModal, // El componente modal que generaste
		componentProps: {
			id: row.id,
			name: row.name,
			category_id: row.category_id,
			category_name: (row.category_id == null) ? '' : row.categorys.name
		}, // Pasa los datos al modal
	});
	await modal.present();

	const {role} = await modal.onWillDismiss();
	if (role === 'confirm') {
		await getRows()
	}
};


const handleRefresh = async (event: CustomEvent) => {
	setTimeout(async () => {
		// Any calls to load data go here
		event.target.complete();
		await getRows()
	}, 2000);
};

const formatDate = (date: string) => formatDateToHuman(date)


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