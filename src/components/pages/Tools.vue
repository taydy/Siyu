<template>
  <div id="tools">
    <!-- <div class="search">
      <div class="card">
        <a class="title">搜索你想要的工具</a>
        <search />
      </div>
    </div> -->
    <!-- tools start -->
    <div class="data-info">
      <Container :title="tools.title" :subTitle="tools.subTitle">
        <tcard :data="tools.data" />
      </Container>
    </div>
    <!-- tools end -->
    <!-- 工具调用开始 -->
    <div id="use" v-show="isUseShow()">
      <Container title="工具使用">
        <router-view />
      </Container>
    </div>
    <!-- 工具调用结束 -->
  </div>
</template>

<script>
import Search from '@/components/components/Search'
import Container from '@/components/components/Container'
import Tcard from '@/components/components/Tcard'
export default {
  name: 'Tools',
  components: {
    Search,
    Tcard,
    Container
  },
  data() {
    return {
      tools: {
        title: '热门工具',
        subTitle: '近一个月使用次数较多的工具',
        data: [
          {
            img: '/static/img/ip-address.png',
            icon: '#icon-dizhi',
            title: 'IP 解析',
            url: '/tools/ip',
            watch: 1800,
            zan: 300
          }
          // {
          //   img: '/static/img/dedicated-ip_1x.png',
          //   icon: '#icon-dizhi',
          //   title: 'IP 解析 (高级版)',
          //   url: '#',
          //   watch: 1800,
          //   zan: 300
          // },
          // {
          //   img: '/static/img/elmjson.png',
          //   icon: '#icon-jsongeshihua',
          //   title: 'JSON 格式化',
          //   url: '/tools/json',
          //   watch: 1800,
          //   zan: 300
          // },
          // {
          //   img: '/static/img/base64.jpg',
          //   icon: '#icon-bianma',
          //   title: '图片 base64 编码',
          //   url: '#',
          //   watch: 1800,
          //   zan: 300
          // },
          // {
          //   img: '/static/img/itsnottoolate.gif',
          //   icon: '#icon-icon_time',
          //   title: '时间戳转换',
          //   url: '#',
          //   watch: 1800,
          //   zan: 300
          // },
          // {
          //   img: '/static/img/businessman.jpg',
          //   icon: '#icon-zhengzeshi',
          //   title: '正则表达式测验',
          //   url: '#',
          //   watch: 1800,
          //   zan: 300
          // }
        ]
      }
    }
  },
  computed: {
    path() {
      return this.$route.path
    }
  },
  watch: {
    path: function(oldPath, newPath) {
      if (this.isUseShow()) {
        setTimeout(() => {
          let height =
            document.getElementById('use').offsetTop -
            document.documentElement.scrollTop
          for (let i = 0; i < Math.abs(height); i += 1) {
            setTimeout(() => {
              document.documentElement.scrollTop += height / Math.abs(height)
            }, i)
          }
        }, 100)
      }
    }
  },
  methods: {
    isUseShow() {
      return this.path !== '/tools'
    }
  }
}
</script>
