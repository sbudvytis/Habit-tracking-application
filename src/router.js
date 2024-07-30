// router.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [{ path: '/' }, { path: '/day/:date', name: 'day' }];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
