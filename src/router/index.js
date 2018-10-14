import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import {
  userApi
} from '@/api/api'
import amplitude from 'amplitude-js'
import Common from '@/assets/js/common'

import Index from '@/components/Index'
import Home from '@/components/pages/Home'
import Tools from '@/components/pages/tool/Tools'

// blog
import BlogIndex from '@/components/pages/blog/Index'
import BlogList from '@/components/pages/blog/BlogList'
import Blog from '@/components/pages/blog/Blog'
import MyBlogList from '@/components/pages/blog/MyBlogList'
import MyBlog from '@/components/pages/blog/MyBlog'

// Tools
import Ip from '@/components/pages/tool/Ip'
import Json from '@/components/pages/tool/Json'

// User
import UserIndex from '@/components/pages/user/Index'
import UserBlogEdit from '@/components/pages/user/BlogEdit'
import UserArticle from '@/components/pages/user/Article'
import UserCategory from '@/components/pages/user/Category'
import UserDraftbox from '@/components/pages/user/Draftbox'
import UserPrivacy from '@/components/pages/user/Privacy'
import UserInfo from '@/components/pages/user/UserInfo'

// chat
import Chat from '@/components/pages/chat/Chat'

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
    path: 'chat',
    name: 'chat',
    component: Chat,
    meta: {
      requireAuth: true
    }
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
    component: BlogIndex,
    children: [{
      path: '',
      name: 'BlogList',
      component: BlogList
    }, {
      path: ':id',
      name: 'Blog',
      component: Blog
    }]
  }, {
    path: 'my/blogs',
    component: BlogIndex,
    meta: {
      requireAuth: true
    },
    children: [{
      path: '',
      name: 'MyBlogList',
      component: MyBlogList
    }, {
      path: ':id',
      name: 'MyBlog',
      component: MyBlog
    }]
  }, {
    path: 'users',
    name: 'Users',
    component: UserIndex,
    redirect: '/users/article',
    meta: {
      requireAuth: true
    },
    children: [{
      path: 'userinfo',
      name: 'UserInfo',
      component: UserInfo,
      meta: {
        requireAuth: true
      }
    },
    {
      path: 'privacy',
      name: 'UserPrivacy',
      component: UserPrivacy,
      meta: {
        requireAuth: true
      }
    },
    {
      path: 'article',
      name: 'UserArticle',
      component: UserArticle,
      meta: {
        requireAuth: true
      }
    },
    {
      path: 'category',
      name: 'UserCategory',
      component: UserCategory,
      meta: {
        requireAuth: true
      }
    },
    {
      path: 'draftbox',
      name: 'UserDraftbox',
      component: UserDraftbox,
      meta: {
        requireAuth: true
      }
    },
    {
      path: 'article/edit',
      name: 'BlogEdit',
      component: UserBlogEdit,
      meta: {
        requireAuth: true
      }
    }
    ]
  }]
}]

const router = new Router({
  mode: 'history',
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  },
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (localStorage.token) {
      next()
    } else {
      router.push({
        path: from.path
      })
      store.dispatch('auth/setNeedLogin', true)
    }
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  if (localStorage.token && Common.isEmpty(store.state.auth.userId)) {
    userApi.getUserInfo().then(response => {
      let data = response.data
      localStorage.userId = data.id
      // store.action
      store.dispatch('auth/setUsername', data.username)
      store.dispatch('auth/setNickname', data.nickname)
      store.dispatch('auth/setAvatar', data.avatar)
      store.dispatch('auth/setUserId', data.id)
      store.dispatch('auth/setMotto', data.motto)
      store.dispatch('auth/setUserNumber', data.userNumber)
      amplitude.getInstance().setUserId(data.id)
      console.log(amplitude)
    })
  }
  if (!localStorage.token) {
    store.dispatch('auth/setUsername', '')
    store.dispatch('auth/setNickname', '')
    store.dispatch('auth/setAvatar', '')
    store.dispatch('auth/setUserId', '')
    store.dispatch('auth/setMotto', '')
    store.dispatch('auth/setUserNumber', '')
  }
})

export default router
