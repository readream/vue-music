import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import './assets/css/global.scss'
import './assets/fonts/iconfont.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueLazyload from 'vue-lazyload'
import 'swiper/dist/css/swiper.css'

import fastclick from 'fastclick'

Vue.use(VueAwesomeSwiper)

Vue.use(VueLazyload, {
  loading: './assets/image/load.gif'
})

fastclick.attach(document.body)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
