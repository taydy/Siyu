<template>
  <div class="t-card">
    <div class="title">
      <h3>{{title}}</h3>
      <span>{{subTitle}}</span>
    </div>
    <div class="content">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in data" :key="index">
          <div class="a-card hidden" >
            <router-link :to="item.url" class="cover" target="_blank">
              <img class="coverImg" :src="item.img">
            </router-link>
            <div class="card-title">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="item.icon"></use>
              </svg>
              <span>{{item.title}}</span>
            </div>
            <div class="card-watch">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-liulan"></use>
              </svg>
              <span>{{item.watch}}</span>
            </div>
            <!-- <div class="card-like">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zan"></use>
              </svg>
              <span>{{item.zan}}</span>
            </div> -->
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tcard',
  props: {
    title: {
      type: String,
      required: true
    },
    subTitle: {
      type: String,
      required: false
    },
    data: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  mounted: function() {
    Array.from(document.getElementsByClassName('a-card')).forEach(
      (item, index) => {
        setTimeout(function() {
          item.classList.remove('hidden')
          item.classList.add('animated', 'slideInUp')
        }, index * 200)
      }
    )
    let size = document.getElementsByClassName('a-card').length
    Array.from(document.getElementsByClassName('a-card')).forEach(
      (item, index) => {
        setTimeout(function() {
          item.classList.remove('animated', 'slideInUp')
        }, (size + 2) * 200)
      }
    )
  }
}
</script>
