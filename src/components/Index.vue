<template>
  <div class="index">
    <Header :navItems="nav" />
    <el-row>
      <el-col :span="20" :offset="2">
        <div class="main">
          <transition name="slide-fade" mode="out-in">
            <router-view />
          </transition>
        </div>
      </el-col>
    </el-row>
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
