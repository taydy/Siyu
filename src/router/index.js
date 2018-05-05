import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Home from '@/components/pages/Home'
import Tools from '@/components/pages/Tools'
import Blogs from '@/components/pages/Blogs'

// Tools
import ToolsIndex from '@/components/tools/Index'
import Ip from '@/components/tools/Ip'

Vue.use(Router)

export default new Router({
  routes: [
    {
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
        redirect: '/tools/index',
        children: [{
          path: 'index',
          name: 'ToolsIndex',
          component: ToolsIndex
        }, {
          path: 'ip',
          name: 'Ip',
          component: Ip
        }]
      }, {
        path: 'blogs',
        name: 'Blogs',
        component: Blogs
      }]
    }
  ]
})
