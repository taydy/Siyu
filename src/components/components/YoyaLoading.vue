<template>
  <transition name="el-loading-fade" @after-leave="handleAfterLeave">
    <div v-show="visible" class="el-loading-mask" :style="{ backgroundColor: background || '' }" :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <circle8 :size="size || 40"></circle8>
      <span v-if="text" class="el-loading-text">{{ text }}</span>
    </div>
  </transition>
</template>

<script>
import { Circle8 } from 'vue-loading-spinner'
export default {
  components: {
    Circle8
  },
  data() {
    return {
      text: null,
      background: null,
      fullscreen: true,
      visible: false,
      customClass: '',
      size: ''
    }
  },
  methods: {
    handleAfterLeave() {
      this.$emit('after-leave')
    },
    setText(text) {
      this.text = text
    }
  }
}
</script>

<style scoped>
.el-loading-mask .spinner {
  top: 50%;
  margin-top: -21px;
  width: 100%;
  text-align: center;
  position: absolute;
}
</style>
