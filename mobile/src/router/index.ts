import { createRouter } from '@ionic/vue-router';
import { RouteRecordRaw, createWebHistory } from 'vue-router';
// import { createRouter } from '@ionic/vue-router';
// import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import Environment from '../views/operations/Environment.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/tabs/tab1'
	},
	{
		path: '/tabs/',
		component: TabsPage,
		children: [
			{
				path: '',
				redirect: '/tabs/tab1'
			},
			{
				path: 'tab1',
				component: () => import('@/views/Tab1Page.vue'),
				outlet: 'secondary'
			},
			{
				path: 'tab2',
				component: () => import('@/views/Tab2Page.vue'),
				outlet: 'secondary'
			},
			{
				path: 'tab3',
				component: () => import('@/views/Tab3Page.vue')
			}
		]
	},
	{
		path: '/environment/',
		component: Environment,
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
	},
	{
		path: '/products/:product_id/images/',
		component: () => import('@/views/operations/Images.vue'),
		outlet: 'secondary'
	}
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

export default router
