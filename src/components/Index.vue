<template>
  <div class="index">
    <Header :navItems="nav"/>
     <div class="main">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/components/Header'
import Footer from '@/components/components/Footer'
import Nav from '@/_nav'
export default {
  name: 'Index',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      nav: Nav.nav
    }
  }
}
</script>
