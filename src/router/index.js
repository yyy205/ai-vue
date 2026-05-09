import { createRouter, createWebHistory } from 'vue-router'
//路由实例和路由模式
import BackendLayout from '@/components/BackendLayout.vue'

import AuthLayout from '@/components/AuthLayout.vue'
//路由配置
const backendRoutes = [
  {
      path: '/back',
      redirect: '/back/dashboard',
      component: BackendLayout,
      children:[
        {
          path: 'dashboard',
          component: () => import('@/views/dashboard.vue'),
          meta: {
            title: '数据分析',
            icon : 'PieChart'
          }
        },
        {
          path: 'knowledge',
          component: () => import('@/views/knowledge.vue'),
          meta: {
            title: '知识文章',
            icon : 'ChatLineSquare'
          }
        },
        {
          path: 'consultations',
          component: () => import('@/views/consultations.vue'),
          meta: {
            title: '咨询记录',
            icon : 'Message'
          }
        },
        {
          path: 'emotional',
          component: () => import('@/views/emotional.vue'),
          meta: {
            title: '情绪日志',
            icon : 'User'
          }
        }

      ]
  },
  {
     path: '/auth',
     component: AuthLayout,
     children:[
        {
          path: 'login',
          component : () => import('@/views/login.vue'),
          meta :{
            title: '登录'
          }
        },
        {
          path: 'register',
          component: () => import('@/views/register.vue'),
          meta: {
            title: '注册'
          }
        },
     ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes: backendRoutes
})
//路由守卫
router.beforeEach((to,from,next) => {
   const token = localStorage.getItem('token')
   if(token){
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))

      if(userInfo.userType == 2){
        if(to.path.startsWith('/back')){
          next()
        }
        else{
          next('/back/dashboard')
        }
      }
      else if(userInfo.userType == 1){
        
      }
   }
   else{
      if(to.path.startsWith('/back')){
        next('/auth/login')
      }else{
        next()
      }
   }
})
export default router