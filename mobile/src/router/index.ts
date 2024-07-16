import { createRouter } from '@ionic/vue-router';
import { RouteRecordRaw, createWebHistory } from 'vue-router';
// import { createRouter } from '@ionic/vue-router';
// import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import Environment from '../views/operations/Environment.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/background/'
	},
	{
		path: '/tabs/',
		component: TabsPage,
		children: [
			{
				path: '',
				redirect: '/tabs/tab2'
			},
			{
				path: 'tab1',
				component: () => import('@/views/Tab1Page.vue'),
				outlet: 'secondary'
			},
			{
				path: 'tab2',
				component: () => import('@/views/Tab2Page.vue'),
				// outlet: 'secondary'
			},
			{
				path: 'tab3',
				component: () => import('@/views/Tab3Page.vue')
			}
		]
	},
	
	{
		path: '/background/',
		component: () => import('@/views/Background.vue'),
	},
	{
		path: '/auth/',
		component: () => import('@/views/pages/Auth.vue'),
		outlet: 'secondary'
	},
	{
		path: '/auth/register/',
		component: () => import('@/views/pages/Auth.vue'),
	},
	{
		path: '/environment/',
		component: Environment,
	},
	{
		path: '/user_admin/',
		component: () => import('@/views/operations/UserAdmin.vue'),
	},
	{
		path: '/categorys/',
		component: () => import('@/views/operations/Category.vue'),
	},
	{
		path: '/subcategorys/',
		component: () => import('@/views/operations/Subcategory.vue'),
	},
	{
		path: '/products/',
		component: () => import('@/views/operations/Product.vue'),
		//outlet: 'secondary'
	},
	{
		path: '/products/:product_id/',
		component: () => import('@/views/pages/ProductDetails.vue'),
		// outlet: 'secondary'
	},
	{
		path: '/products/:product_id/images/',
		component: () => import('@/views/operations/Images.vue'),
		outlet: 'secondary'
	},
	{
		path: '/products/:product_id/edit/',
		component: () => import('@/views/operations/ProductEdit.vue'),
		// outlet: 'secondary'
	},
	{
		path: '/cart/',
		component: () => import('@/views/pages/CartShopping.vue'),
	},
	
	{
		path: '/share_image/',
		component: () => import('@/views/pages/ImageShareTemplateOne.vue'),
		outlet: 'secondary'
	},
	{
		path: '/test/',
		component: () => import('@/views/test/index.vue')
	}
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

export default router
