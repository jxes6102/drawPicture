import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import canvasView from '../views/canvasView/index.vue'
import testView from '../views/testView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: canvasView
    },
    {
      path: '/test',
      name: 'testView',
      component: testView
    },
    // { 
    //   path: '/:pathMatch(.*)*',
    //   component: errorView 
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
