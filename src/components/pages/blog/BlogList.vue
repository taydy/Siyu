<template>
  <div id="blogs-home" v-scroll="handleScroll">
    <div class="blogs-main">
      <el-row :gutter="20">
        <el-col :span="5" :offset="0">
          <div class="category slower-animated slideInUp" @keyup.enter="searchArticle">
            <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="search" @keyup.enter="searchArticle">
            </el-input>
            <div class="labels" style="padding-left:40px;margin-top:40px;">
              <ul v-for="(item, index) in category" :key="index">
                <li href="#" @click="getArticlesByLabel(item.label)" v-show="item.value >= 5">{{item.key}}
                  <span class="count">({{item.value}})</span>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="14" :offset="6" id="article-list">
          <article v-for="(item, index) in articles" :key="index">
            <el-row :gutter="20" style="margin-bottom: -6px;">
              <!-- <el-col :span="10">
                <div class="illustration" @click="goBlog(item.pid)">
                  <img :src="item.thumbnail">
                </div>
              </el-col> -->
              <el-col>
                <div class="description">
                  <div class="header">
                    <span class="avator">
                      <img :src="item.avatar">
                    </span>
                    <div class="basic-info">
                      <span class="auther">{{item.nickname}}</span>
                      <span class="time">{{item.time | moment("from")}}</span>
                    </div>
                  </div>
                  <router-link tag="a" class="title" :to="blogPath(item)">
                    <span>{{item.title}}</span>
                  </router-link>
                  <router-link tag="a" class="summary" :to="blogPath(item)">
                    <span>{{item.summary}}</span>
                  </router-link>
                  <div class="article-footer">
                    <div class="separator"></div>
                    <div class="action">
                      <!-- <span>{{item.views}} views</span> -->
                      <!-- <a class="comment" href="/#"> -->
                      <router-link :to="blogPath(item)">Read More</router-link>
                      <!-- </a> -->
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </article>
          <div id="load-more">
            <span v-show="noMore">no more data</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { articleApi } from '@/api/api'
import { addClass, removeClass } from '@/assets/js/dom'
import { DEFAULT_WEB_ROOT } from '@/assets/js/const'
export default {
  name: 'BlogList',
  data() {
    return {
      category: [],
      articles: [],
      label: '',
      page: 1,
      noMore: false,
      isLoadingData: false,
      full_loading: '',
      search: ''
    }
  },
  directives: {
    scroll: {
      bind: function(el, binding) {
        window.addEventListener('scroll', () => {
          let func = binding.value
          func()
        })
      }
    }
  },
  mounted: function() {
    const loading = this.yoyaLoading({
      lock: true,
      background: 'white',
      target: document.getElementById('blogs-home')
    })
    this.getCommonArticles(loading)
    this.getCommonLabels(loading)
    this.amplitude.getInstance().logEvent('Viewed Blog List Page')
  },
  methods: {
    searchArticle() {
      this.amplitude.getInstance().logEvent('Searched Blog')
      const loading = this.yoyaLoading({
        lock: true,
        background: 'white',
        target: document.getElementById('article-list')
      })
      this.page = 1
      this.noMore = false
      this.articles = []
      removeClass(document.getElementById('article-list'), 'slower-animated')
      removeClass(document.getElementById('article-list'), 'fadeInSmallUp')
      this.loadSearchArticle(loading)
    },
    loadSearchArticle(loading) {
      if (this.isLoadingData) {
        return
      }
      this.isLoadingData = true
      articleApi.searchCommonArticle(this.search, this.page).then(response => {
        if (loading) {
          loading.close()
        }
        let data = response.data
        data.datas.forEach(article => {
          if (this.page === 1) {
            addClass(document.getElementById('article-list'), 'slower-animated')
            addClass(document.getElementById('article-list'), 'fadeInSmallUp')
          }
          this.articles.push({
            pid: article.pid,
            thumbnail: '/static/img/routines-dribbble.jpg',
            avatar: this.commonUtil.isEmpty(article.avatar)
              ? '/static/img/avatar.jpg'
              : DEFAULT_WEB_ROOT + article.avatar,
            nickname: article.ownName,
            time: article.createdTime,
            title: article.title,
            summary: article.summary,
            views: Math.ceil(Math.random() * 10000)
          })
        })
        if (data.totalPage === data.currentPage) {
          this.noMore = true
        } else {
          this.page++
        }
        this.isLoadingData = false
      })
    },
    getArticlesByLabel(label) {
      this.label = label
      this.page = 1
      this.noMore = false
      this.search = ''
      this.articles = []
      removeClass(document.getElementById('article-list'), 'slower-animated')
      removeClass(document.getElementById('article-list'), 'fadeInSmallUp')
      this.getCommonArticles()
    },
    getCommonArticles(loading) {
      this.amplitude.getInstance().logEvent('Searched Blog')
      if (this.isLoadingData) {
        return
      }
      this.isLoadingData = true
      articleApi.getCommonArticles(this.label, this.page).then(response => {
        let data = response.data
        data.datas.forEach(article => {
          if (this.page === 1) {
            addClass(document.getElementById('article-list'), 'slower-animated')
            addClass(document.getElementById('article-list'), 'fadeInSmallUp')
          }
          this.articles.push({
            pid: article.pid,
            thumbnail: '/static/img/routines-dribbble.jpg',
            avatar: this.commonUtil.isEmpty(article.avatar)
              ? '/static/img/avatar.jpg'
              : DEFAULT_WEB_ROOT + article.avatar,
            nickname: article.ownName,
            time: article.createdTime,
            title: article.title,
            summary: article.summary,
            views: Math.ceil(Math.random() * 10000)
          })
        })
        if (loading) {
          loading.close()
        }
        if (data.totalPage === data.currentPage) {
          this.noMore = true
        } else {
          this.page++
        }

        this.isLoadingData = false
      })
    },
    getCommonLabels(loading) {
      articleApi.facetCommonCategory().then(response => {
        let data = response.data
        data.forEach(facetEntity => {
          this.category.push({
            key: facetEntity.key,
            label: facetEntity.label,
            value: facetEntity.value
          })
        })
        if (loading) {
          loading.close()
        }
      })
    },
    handleScroll() {
      if (this.$route.path !== '/blogs') {
        return false
      }
      let scrollTop = 0
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
      } else if (document.body) {
        scrollTop = document.body.scrollTop
      }
      if (scrollTop + window.innerHeight >= document.body.clientHeight) {
        if (this.noMore || this.isLoadingData) {
          return
        }
        const loading = this.yoyaLoading({
          lock: true,
          background: 'white',
          target: document.getElementById('load-more')
        })
        if (this.search) {
          this.loadSearchArticle(loading)
        } else {
          this.getCommonArticles(loading)
        }
      }
    },
    blogPath(item) {
      return '/blogs/' + item.pid
    }
  }
}
</script>
