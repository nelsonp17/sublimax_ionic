<template>
	<ion-app>
		<!--	  <ion-router-outlet :key="$route.fullPath"/>-->
		<ion-router-outlet main name="primary"/>
		<router-view name=“secundary” :key="$route.fullPath"></router-view>
<!--		<router-view :key="$route.fullPath"></router-view>-->
			<!-- content tab1/tab2/tab3 -->
			<!--/ content tab1/tab2/tab3 -->
<!--			<tabs-page/>-->
<!--		</router-view>-->
	</ion-app>

<!--	<ion-tabs>-->
<!--		<ion-tab-bar slot="bottom">-->
<!--			<ion-tab-button tab="tab1">-->
<!--				<ion-icon name="home"></ion-icon>-->
<!--				<ion-label>Tab 1</ion-label>-->
<!--			</ion-tab-button>-->
<!--			<ion-tab-button tab="tab2">-->
<!--				<ion-icon name="star"></ion-icon>-->
<!--				<ion-label>Tab 2</ion-label>-->
<!--			</ion-tab-button>-->
<!--			<ion-tab-button tab="tab3">-->
<!--				<ion-icon name="settings"></ion-icon>-->
<!--				<ion-label>Tab 3</ion-label>-->
<!--			</ion-tab-button>-->
<!--		</ion-tab-bar>-->

<!--		<router-view :key="$route.fullPath"/>-->
<!--	</ion-tabs>-->
</template>

<script setup lang="ts">
import {IonApp, IonRouterOutlet} from '@ionic/vue';
</script>
