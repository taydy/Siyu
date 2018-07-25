<template>
  <div class="user-home">
    <el-row>
      <el-col :span="3">
        <div class="user-menu">
          <el-menu class="el-menu-vertical-demo" :default-active="defaultActive" :router="true">
            <y-menu :menu="menu"></y-menu>
          </el-menu>
        </div>
      </el-col>
      <el-col :span="21" :offset="3">
        <transition name="slide-fade" mode="out-in">
          <router-view />
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import yMenu from '@/components/components/YMenu'
export default {
  components: {
    yMenu
  },
  data() {
    return {
      menu: [
        {
          index: '/article',
          icon: 'fa fa-book',
          name: '博客文章',
          children: [
            {
              index: '/users/article',
              icon: 'el-icon-location',
              name: '文章管理',
              type: 'leaf'
            },
            {
              index: '/users/category',
              icon: 'el-icon-location',
              name: '类别管理',
              type: 'leaf'
            },
            {
              index: '/users/draftbox',
              icon: 'el-icon-location',
              name: '草稿箱',
              type: 'leaf'
            }
          ]
        },
        {
          index: '/users',
          icon: 'fa fa-user-circle-o',
          name: '个人信息',
          children: [
            {
              index: '/users/userinfo',
              icon: 'el-icon-location',
              name: '基本信息',
              type: 'leaf'
            },
            {
              index: '/users/privacy',
              icon: 'el-icon-location',
              name: '账户密码',
              type: 'leaf'
            }
          ]
        }
      ]
    }
  },
  computed: {
    defaultActive() {
      return this.$route.path
    }
  }
}
</script>
