<template>
    <div>
        <el-submenu v-for="item in menu" :key="item.index" :index="item.index">
            <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.name}}</span>
            </template>
            <el-menu-item-group v-if="item.children" v-for="childItem in item.children" :key="childItem.index" :index="childItem.index">
                <y-menu v-if="childItem.children" :menu="objectToArray(childItem)"></y-menu>
                <template v-else-if="childItem.type === 'group'" slot="title">{{childItem.name}}</template>
                <el-menu-item v-else-if="childItem.type === 'leaf'" :index="childItem.index">{{childItem.name}}</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    </div>
</template>

<script>
import yMenu from './YMenu'
export default {
  name: 'yMenu',
  components: {
    yMenu
  },
  props: {
    menu: {
      type: Array,
      required: true
    }
  },
  methods: {
    objectToArray(obj) {
      var data = []
      data.push(obj)
      return data
    }
  }
}
</script>

<style scoped>
.el-submenu__title i {
  margin-right: 5px;
}
</style>
