<template>
  <ion-page>
    
    <ion-content :fullscreen="true" class="ion-padding titillium-web-regular">
      <p>Hola <br><b>{{ username }}</b></p>

      <Acount username="username" email="email" :admin="admin"/>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import Acount from '@/components/tab1/Account.vue';

const username = "Nelson";
const email = "nelsonportillo982@gmail.com";
const admin = true;

</script>
