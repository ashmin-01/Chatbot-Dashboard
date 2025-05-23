import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ApiExampleView from '../views/ApiExampleView.vue'
import TanstackApiView from '../views/TanstackApiView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/knowledge-base',
      name: 'Knowledge Base',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/KnowledgeBaseView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
    },
    {
      path: '/api-example',
      name: 'api-example',
      component: ApiExampleView,
    },
    {
      path: '/tanstack-api',
      name: 'tanstack-api',
      component: TanstackApiView,
    },
  ],
})

export default router
