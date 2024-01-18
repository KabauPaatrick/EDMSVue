// router.js
import { createRouter, createWebHistory } from 'vue-router';
import RepositoryView from './views/RepositoryView.vue'; // Import RepositoryView component
import CabinetList from './components/CabinetList.vue';
import FolderView from './components/FolderView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./components/DashboardView.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./components/DashboardView.vue'),
  },
  {
    path: '/repository',
    name: 'repository',
    component: RepositoryView,
    children: [
      { path: '', component: CabinetList },
      { path: 'folders', component: FolderView },
      // Add more routes for other tabs as needed
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;







