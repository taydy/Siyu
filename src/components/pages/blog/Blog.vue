<template>
  <div id="blog">
    <el-row>
      <el-col :span="5">
        <div class="directory" v-show="!commonUtil.isEmpty(directory)">
          <h2>目录</h2>
          <div class="nav" v-html="directory">
          </div>
        </div>
      </el-col>
      <el-col :span="16" :offset="7">
        <div class="blog-info" id="blog-info">
          <h1>{{article.title}}</h1>
          <i class="fa fa-user">
            <a class="category">{{article.ownName}}</a>
          </i>
          <i class="fa fa-tags">
            <a class="category">{{article.category}}</a>
          </i>
          <i class="fa fa-calendar">
            <a class="category">{{article.createdTime | moment("MMMM Do YYYY, h:mm:ss a")}}</a>
          </i>
          <div class="page">
            <div class="blog-content markdown-body" v-html="markdownHtml">
            </div>
          </div>
        </div>
        <div id="disqus_thread"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import { articleApi } from '@/api/api'
import { addClass } from '@/assets/js/dom'
export default {
  data() {
    return {
      id: '',
      article: '',
      markdownHtml: '',
      directory: ''
    }
  },
  mounted: function() {
    const loading = this.yoyaLoading({
      lock: true,
      background: 'white',
      target: document.getElementById('blog')
    })
    this.id = this.$route.params.id
    this.loadArticle(loading)
    this.loadComment()
    this.amplitude.getInstance().logEvent('Viewed Blog Page')
  },
  methods: {
    loadArticle(loading) {
      articleApi.getArticleById(this.id).then(response => {
        if (loading) {
          loading.close()
        }
        this.article = response.data
        let html = mavonEditor.mixins[0]
          .data()
          .markdownIt.use(require('markdown-it-highlightjs'))
          .use(require('markdown-it-katex-external'))
          .render('@[toc] \n' + this.article.content)
        var objE = document.createElement('div')
        objE.innerHTML = html
        let nodes = objE.childNodes
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i]
          if (node.tagName === 'UL') {
            this.directory = node.outerHTML
            node.style.display = 'none'
            break
          }
          if (node.tagName === 'H3') {
            node.style.display = 'none'
          }
        }
        this.markdownHtml = objE.outerHTML
        this.$nextTick(function() {
          let nodes = document.getElementsByTagName('pre')
          nodes.forEach = Array.prototype.forEach
          nodes.forEach(pre => {
            pre.children[0].classList.forEach(function(className, index) {
              if (className.indexOf('lang') === 0) {
                addClass(pre, className)
              }
            })
          })
        })
      })
    },
    loadComment() {
      var d = document
      var s = d.createElement('script')
      s.src = 'https://yoyadoc.disqus.com/embed.js'
      s.setAttribute('data-timestamp', +new Date())
      d = d.head || d.body
      d.appendChild(s)
    }
  }
}
</script>

<style lang="sass">
// markdown-style
@import '../../../../scss/markdown-style';
@import '../../../../scss/highlight';
</style>

<style lang="scss" scoped>
#disqus_thread {
  margin: 40px auto;
}
</style>
