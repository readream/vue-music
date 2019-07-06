import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import('../views/home.vue')
    },
    {
      path: '/playListView',
      component: () => import('../views/playListView.vue'),
      children: [
        {
          path: ':id',
          name: 'playListInfo',
          component: () => import('../views/playListInfo.vue')
        }
      ]
    },
    {
      path: '/recommend',
      component: () => import('../views/recommend.vue')
    },
    {
      path: '/rank',
      component: () => import('../views/rank.vue'),
      children: [
        {
          path: ':id',
          name: 'rankInfo',
          component: () => import('../views/rankInfo.vue')
        }
      ]
    },
    {
      path: '/artists',
      component: () => import('../views/artists.vue'),
      children: [
        {
          path: ':id',
          name: 'artistsInfo',
          component: () => import('../views/artistsInfo.vue')
        }
      ]
    },
    {
      path: '/search',
      component: () => import('../views/search.vue')
    },
    {
      path: '/userCenter',
      component: () => import('../views/userCenter.vue'),
      children: [
        {
          path: '/userHistoryList',
          component: () => import('../views/userHistoryList.vue')
        },
        {
          path: '/userLoveList',
          component: () => import('../views/userLoveList.vue')
        },
        {
          path: '/userPlayList',
          component: () => import('../views/userPlayList.vue')
        }
      ]
    }
  ]
})
