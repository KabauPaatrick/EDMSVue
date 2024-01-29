// router.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('./views/LoginView.vue'),
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
    props: true

  },
  {
    path: '/recently_viewed',
    name: 'Recently Viewed',
    component: () => import('./views/RecentlyviewedView.vue'),
  },
  {
    path: '/bookmarks',
    name: 'Bookmarks',
    component: () => import('./views/BookmarksView.vue'),
  },
  // {
  //   path:'/saved_search',
  //   name: 'ThumbnailsViewer', // Enclose in quotes
  //   component: () => import('./components/ThumbnailsViewer.vue')
  // },
  // {
  //   path: '/repository/:id',
  //   name: 'repository',
  //   component: () => import('./views/RepositoryView.vue'),
  //   props: route => ({ id: parseInt(route.params.id) }),
  //   meta: {
  //     data: { message: 'This is additional data for the route' }
  //   }
  // },
  // {
  //   path: '/documentviewer',
  //   name: 'DocumentViewer',
  //   component: () => import('./components/DocumentViewer.vue'),
  // }
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;







