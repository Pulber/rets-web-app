import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import AppComponent from './components/app.vue'

Vue.use(VueRouter)
Vue.use(VueResource)

const App = Vue.extend(AppComponent)

new App().$mount('#app')