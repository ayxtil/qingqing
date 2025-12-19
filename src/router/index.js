import { createRouter, createWebHashHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/notification'
  },
  {
    path: '/notification',
    name: 'notification',
    component: () => import('../views/notification/index.vue')
  },
  {
    path: '/qing-female/index',
    name: 'qing-female-index',
    component: () => import('../views/qing-female/index/index.vue')
  },
  {
    path: '/qing-male/index',
    name: 'qing-male-index',
    component: () => import('../views/qing-male/index/index.vue')
  },
  {
    path: '/import-dishes',
    name: 'import-dishes',
    component: () => import('../views/import-dishes/index.vue')
  },

  // 404重定向
  {
    path: '/:pathMatch(.*)*',
    redirect: '/notification'
  }
]

const router = createRouter({
  history: createWebHashHistory('/qingqing/'),
  routes
})

export default router
