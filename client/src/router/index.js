import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import UserDashboard from '@/views/UserDashboard.vue'
import EditProfile from '@/views/EditProfile.vue'
import SignInPage from '@/views/SignInPage.vue'

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
  },
  {
    path: '/edit-profile',
    name: 'EditProfile',
    component: EditProfile
  },
  {
    path: '/signin',
    name: 'Sign In',
    component: SignInPage
  }
]

const router = createRouter({
    history: createWebHistory(),
    routes
  })
  
export default router