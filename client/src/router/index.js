import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import UserDashboard from '@/views/UserDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingPage
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: UserDashboard
  }

]

const router = createRouter({
    history: createWebHistory(),
    routes
  })
  
export default router