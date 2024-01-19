// router.js
import { createRouter, createWebHistory } from 'vue-router';
// import DashboardView from './views/DashboardView.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    // component: DashboardView,
    component: () => import('./views/DashboardView.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/DashboardView.vue'),
  },
  {
    path: '/repository',
    name: 'Repository',
    component: () => import('./views/RepositoryView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;







