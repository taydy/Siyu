<template>
  <div class="index">
    <Header :navItems="nav"/>
     <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from '@/components/components/Header'
import Nav from '@/_nav'
export default {
  name: 'Index',
  components: {
    Header
  },
  data() {
    return {
      nav: Nav.nav
    }
  }
}
</script>
