// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import store from './store'
import vueResource from 'vue-resource'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import animate from 'animate.css'
import EffectInput from 'effect-input'
import 'effect-input/dist/index.css'
import YoyaLoading from '@/assets/js/yoyaLoading'
import moment from 'vue-moment'

import CommonUtil from '@/assets/js/common'
import underscore from 'underscore'
import amplitude from 'amplitude-js'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

import axios from './http'
import App from './App'

Vue.use(vueResource)
Vue.use(animate)

Vue.use(ElementUI)

Vue.prototype.axios = axios
Vue.config.productionTip = false

Vue.use(EffectInput)
Vue.prototype.yoyaLoading = YoyaLoading

Vue.use(moment)
Vue.use(amplitude)
amplitude.getInstance().init('b9a94813e48465833715f7e380dd0c62')
Vue.prototype.amplitude = amplitude
Vue.prototype.commonUtil = CommonUtil
Vue.prototype.underscore = underscore

Vue.use(Viewer)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
