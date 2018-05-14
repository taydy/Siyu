<template>
  <div class="container">
        <div class="title">
          <h4>{{title}}</h4>
          <span>{{subTitle}}</span>
        </div>
        <slot></slot>
      </div>
</template>

<script>
export default {
  name: 'Container',
  props: {
    title: {
      type: String,
      required: false
    },
    subTitle: {
      type: String,
      required: false
    }
  }
}
</script>
