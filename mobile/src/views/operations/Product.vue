<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>
            <router-link to="/tabs/tab1">
                <ion-icon :icon="arrowBack" style="margin-right: 10px;"></ion-icon> 
            </router-link>
            Productos
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
                Productos
            </ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>

        <div>
			<p style="color: #212121"> <b>Catalogo de productos</b> </p>
			<ion-card class="card-1">
				<ion-card-content>
					<ion-label>
						<p style="color: #212121"> <b>Productos</b> </p>
					</ion-label>
					<div style="clear: both; height: 40px; margin-top:10px;">
						<div style="float:left;">
							<ion-label><p style="line-height: 20px; color: #212121">Agregar un producto</p></ion-label>
						</div>
						<div style="float:right">
                            <ion-button shape="round" @click="abrirModal()">Agregar</ion-button>
						</div>
					</div>
				</ion-card-content>
			</ion-card>
        </div>

        <div class="mt-6">
            <p style="color: #212121"> <b>Todos los registros</b> </p>
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
                                    <li style="margin-top: 10px">Nombre: <span style="color: #757575">{{ row.name }}</span></li>
                                    <li class="grid grid-cols-2">
                                        <span class="">ID: <span style="color: #757575">{{ row.uuid }}</span></span>
                                        <span class="text-right">Precio: <span style="color: #757575">${{ row.price }}</span></span>
                                    </li>
                                    <li>Etiquetas: <span style="color: #757575">{{ row.tags }}</span></li>
                                    <li>Descripción: <span style="color: #757575">{{ row.description }}</span></li>
                                    <li>Subcategoría: <span style="color: #757575">{{ (row.subcategory_id==null) ? 'No asignado' : row.subcategorys.name }}</span></li>
                                </ul>
                            </ion-label>
                            <div class="metadata-end-wrapper" slot="end">
                                <ion-note color="medium"><p style="font-size:10px">{{ formatDate(row.created_at) }}</p></ion-note>
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
    import { IonSearchbar, IonRefresher, IonRefresherContent, modalController, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonButton, IonCardContent, IonIcon, IonList, IonItem, IonNote, IonLabel } from '@ionic/vue';
    import { arrowBack, chevronForward } from 'ionicons/icons';
    import ProductModal from '../../components/tab1/ProductModal.vue';
    import { supabase } from '@/utils/supabase';
    import { formatDateToHuman } from '@/utils/utils';
    import { onMounted, ref } from 'vue';

	const products = ref([]);
    const rows = ref([]);

    async function getRows(){
        let { data: products, error } = await supabase
		.from('products')
		.select(`id, created_at, name, description, price, tags, uuid, subcategory_id, subcategorys (name)`)
		.order('name'); 

        if(products?.length > 0){
            products.value = products
        }
        rows.value = products.value
        console.log(products)
    }
    onMounted(async ()=>{
        await getRows()
    })

    const buscar = (event: { target: { value: any; }; }) => {
      const textoBusqueda = event.target.value;
      if(textoBusqueda==''){
        rows.value = products.value
      }else{
        const coincidencias = buscarCoincidencias(textoBusqueda)
        
        rows.value = coincidencias;

      }
      console.log('Texto de búsqueda:', textoBusqueda);
      
    }

    const abrirModal = async () => {
        const modal = await modalController.create({
        component: ProductModal, // El componente modal que generaste
        });
        await modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm') {
            getRows()
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

        const { data, role } = await modal.onWillDismiss();
        if (role === 'confirm') {
            getRows()
        }
    };

    const search = async (name:string)=> {
        for (const product of products.value) {
            if(name==product.name){
                return product;
            }
        }
    }

    // buscar por nombre (agregar buscar por uuid)
    const buscarCoincidencias = (nombreBuscado: string) => {
        const coincidencias = products.value.filter((product) =>
			product.name.toLowerCase().includes(nombreBuscado.toLowerCase())
        );
        return coincidencias;
    };

    
    const handleRefresh = async (event: CustomEvent) => {
        await getRows()
        event.target.complete();
    };

    const formatDate = (date:string) => formatDateToHuman(date)

    


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