import { createRouter, createWebHistory } from 'vue-router'
import WeatherDashboard from '../components/WeatherDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: WeatherDashboard
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
