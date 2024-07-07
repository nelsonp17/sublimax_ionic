<template>
	<ion-page>
		<ion-tabs>
			<ion-router-outlet></ion-router-outlet>
<!--			<ion-router-outlet main name=“primary”></ion-router-outlet>-->
<!--			<router-view name=“secundary” :key="$route.fullPath"></router-view>-->
			<ion-tab-bar slot="bottom">
				<ion-tab-button tab="tab1" href="/tabs/tab1">
					<ion-icon aria-hidden="true" :icon="person"/>
				</ion-tab-button>

				<ion-tab-button tab="tab2" href="/tabs/tab2">
					<ion-icon aria-hidden="true" :icon="homeSharp"/>
				</ion-tab-button>

				<ion-tab-button tab="tab3" href="/tabs/tab3">
					<ion-icon aria-hidden="true" :icon="qrCode"/>
				</ion-tab-button>
<!--				<a href="/tabs/tab1">-->
<!--					<ion-icon aria-hidden="true" :icon="person"/>-->
<!--				</a>-->

<!--				<a href="/tabs/tab2">-->
<!--					<ion-icon aria-hidden="true" :icon="homeSharp"/>-->
<!--				</a>-->

<!--				<a href="/tabs/tab3">-->
<!--					<ion-icon aria-hidden="true" :icon="qrCode"/>-->
<!--				</a>-->
			</ion-tab-bar>
		</ion-tabs>
	</ion-page>
</template>

<script setup lang="ts">
import {IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet} from '@ionic/vue';
import {homeSharp, qrCode, person} from 'ionicons/icons';
</script>
