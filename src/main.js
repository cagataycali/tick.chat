import Vue from 'vue'
import Vuex from 'vuex'
import * as VueGoogleMaps from 'vue2-google-maps'
import Framework7 from 'framework7'
import Framework7Vue from 'framework7-vue'
import VueSocketio from 'vue-socket.io'

import Framework7Theme from 'framework7/dist/css/framework7.ios.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css'
import animations from './css/animation.css'
import AppStyles from './css/app.css'

import App from './app'
import Map from './components/Map.vue'
import Chat from './components/Chat.vue'
import Inbox from './components/Inbox.vue'

import routes from './routes.js'
import storeOptions from './store'

Vue.use(Vuex)

const store = new Vuex.Store(storeOptions)


Vue.use(Framework7Vue)
// if (process.env.NODE_ENV !== 'production') {
  Vue.use(VueSocketio, 'http://localhost:3000', store)
// } else {
//   Vue.use(VueSocketio, 'https://service.tick.chat', store)
// }

Vue.use(VueGoogleMaps, {
  installComponents: true,
  load: {
    key: 'AIzaSyBa7BETOroz4y_bA9HhBkjZgO1pLl8xs9E'
  }
})

// Components
Vue.component('g-map', Map)
Vue.component('google-cluster', VueGoogleMaps.Cluster)
Vue.component('google-marker', VueGoogleMaps.Marker)
Vue.component('chat', Chat)
Vue.component('inbox', Inbox)

new Vue({
  el: '#app',
  template: '<app/>',
  framework7: {
    root: '#app',
    routes
  },
  store,
  components: {
    app: App
  }
})
