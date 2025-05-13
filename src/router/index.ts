import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import AnalyticsandReports from '../views/AnalyticsandReports.vue'
import KnowledgeBaseView from '../views/KnowledgeBaseView.vue'
import DeveloperTools from '../views/DeveloperTools.vue'
import SettingsView from '../views/SettingsView.vue'
import NotificationsAlerts from '../views/NotificationsAlerts.vue'
import LogoutView from '../views/LogoutView.vue'

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
      component: KnowledgeBaseView,
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
      component: AnalyticsandReports,
    },
    {
      path: '/tanstack-api',
      name: 'Developer Tools',
      component: DeveloperTools,
      meta: { sidebar: true },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsView,
      meta: { sidebar: true },
    },
    {
      path: '/notifications-alerts',
      name: 'Notifications & Alerts',
      component: NotificationsAlerts,
      meta: { sidebar: true },
    },
    {
      path: '/logout',
      name: 'Logout',
      component: LogoutView,
      meta: { sidebar: true },
    },

  ],
})

export default router
