import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { IonicVue } from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";
//import QRious from "qrious";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */

// import '@ionic/vue/css/palettes/dark.always.css';
import "@ionic/vue/css/palettes/dark.class.css";
// import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */

import "tailwindcss/base.css";
import "tailwindcss/components.css";
import "tailwindcss/utilities.css";

import "./theme/variables.css";
import "./theme/styles.css";
import { askForCameraPermission } from "./utils/permission";
import { checkAuth } from '@/utils/auth';
import modeDark from "@/utils/modeDark";

// middlewares
router.beforeEach(async (to, from) => {

	// si esta logeado
	const isAuth = await checkAuth()
	if(to.path == '/background/' || to.path == '/background'){
		if(isAuth){
			console.log("pasa...")
			return { path: '/tabs/tab2/' }
		}
		else{
			console.log('autentifica...')
			return { path: '/auth/' }
		}
	}else if(to.path == '/auth/' || to.path == '/auth' || to.path == '/auth/register/' || to.path == '/auth/register/'){
		if(isAuth){
			console.log("pasa...")
			return { path: '/tabs/tab2/' }
		}
	}else{
		// si no esta logeado
		if(!isAuth){
			console.log("autentifica...")
			return { path: '/auth/' }
		}
	}
	console.log(to)
	console.log(to.path)

	
	// explicitly return false to cancel the navigation
	//return false
});

router.beforeResolve(async (to) => {
	// evento modo oscuro/claro
	new modeDark().useDark();

	// permisos de la camara
	//await askForCameraPermission()
});



const app = createApp(App).use(IonicVue).use(router);

router.isReady().then(() => {
	app.mount("#app");
});
