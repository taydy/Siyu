// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import vueResource from 'vue-resource'
import animate from 'animate.css'
import { Row, Col, Input, Table, TableColumn, Form, FormItem, Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from './http'
import App from './App'

Vue.use(vueResource)
Vue.use(animate)

Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.axios = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
