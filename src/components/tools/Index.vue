<template>
  <div class="tools">
    <!-- search start -->
    <div class="search">
      <div class="card">
        <a class="title">搜索你想要的工具</a>
        <search />
      </div>
    </div>
    <!-- search end -->
    <!-- tools start -->
    <div class="data-info">
      <tcard v-for="(item, index) in tools" :key="index" :title="item.title" :subTitle="item.subTitle" :data="item.data" />
    </div>
    <!-- tools end -->
  </div>
</template>

<script>
import Search from '@/components/components/Search'
import Tcard from '@/components/components/Tcard'
export default {
  name: 'Tools',
  components: {
    Search,
    Tcard
  },
  data() {
    return {
      tools: [
        {
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
            },
            {
              img: '/static/img/dedicated-ip_1x.png',
              icon: '#icon-dizhi',
              title: 'IP 解析 (高级版)',
              url: '#',
              watch: 1800,
              zan: 300
            },
            {
              img: '/static/img/elmjson.png',
              icon: '#icon-jsongeshihua',
              title: 'JSON 格式化',
              url: '#',
              watch: 1800,
              zan: 300
            },
            {
              img: '/static/img/base64.jpg',
              icon: '#icon-bianma',
              title: '图片 base64 编码',
              url: '#',
              watch: 1800,
              zan: 300
            },
            {
              img: '/static/img/itsnottoolate.gif',
              icon: '#icon-icon_time',
              title: '时间戳转换',
              url: '#',
              watch: 1800,
              zan: 300
            },
            {
              img: '/static/img/businessman.jpg',
              icon: '#icon-zhengzeshi',
              title: '正则表达式测验',
              url: '#',
              watch: 1800,
              zan: 300
            }
          ]
        }
      ]
    }
  }
}
</script>
