import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Home from '@/components/pages/Home'
import Tools from '@/components/pages/Tools'
import Blogs from '@/components/pages/Blogs'

// Tools
import Ip from '@/components/tools/Ip'
import Json from '@/components/tools/Json'

Vue.use(Router)

const routes = [{
  path: '/',
  name: 'Index',
  component: Index,
  redirect: '/home',
  children: [{
    path: 'home',
    name: 'Home',
    component: Home
  }, {
    path: 'tools',
    name: 'Tools',
    component: Tools,
    children: [{
      path: 'ip',
      name: 'Ip',
      component: Ip
    }, {
      path: 'json',
      name: 'Json',
      component: Json
    }]
  }, {
    path: 'blogs',
    name: 'Blogs',
    component: Blogs
  }]
}]

const router = new Router({
  mode: 'hash',
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  },
  routes
})

export default router
