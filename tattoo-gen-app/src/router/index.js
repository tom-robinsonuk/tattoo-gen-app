import { createRouter, createWebHistory } from "vue-router";

import LoginPage from '../pages/LoginPage.vue'
import StudioPage from '../pages/StudioPage.vue'
import PacksPage from '../pages/PacksPage.vue'

const routes = [
    { path: '/', redirect: '/studio' },
    { path: '/login', component: LoginPage },
    { path: '/studio', component: StudioPage },
    { path: '/packs', component: PacksPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router