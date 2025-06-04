import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import WeatherDashboard from '../WeatherDashboard.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'WeatherDashboard',
    component: WeatherDashboard
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
