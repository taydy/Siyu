<template>
  <div id="blogs-home" v-scroll="handleScroll">
    <div class="blogs-main">
      <el-row v-show="articles.length === 0" style="margin-top:100px;">
        <el-col :span="10" :offset="7">
          <img class="empty" src="@/assets/svg/start_bloging.svg">
        </el-col>
      </el-row>
      <el-row :gutter="20" v-show="articles.length > 0">
        <el-col :span="5" :offset="0">
          <div class="category slower-animated slideInUp" @keyup.enter="searchArticle">
            <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="search" @keyup.enter="searchArticle">
            </el-input>
            <div class="labels" style="padding-left:40px;margin-top:40px;">
              <ul v-for="(item, index) in categorys" :key="index">
                <li href="#" @click="getArticlesByCategory(item.label)">{{item.key}}
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
import { mapState } from 'vuex'
import { DEFAULT_WEB_ROOT } from '@/assets/js/const'
export default {
  name: 'BlogList',
  data() {
    return {
      categorys: [],
      articles: [],
      label: '',
      category: '',
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
  computed: {
    ...mapState({
      avatar: state => state.auth.avatar,
      username: state => state.auth.username
    })
  },
  mounted: function() {
    const loading = this.yoyaLoading({
      lock: true,
      background: 'white',
      target: document.getElementById('blogs-home')
    })
    this.getCommonArticles(loading)
    this.getCommonLabels(loading)
  },
  methods: {
    searchArticle() {
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
      articleApi
        .getAuthArticles({
          query: this.search,
          page: this.page
        })
        .then(response => {
          let data = response.data
          data.datas.forEach(article => {
            if (this.page === 1) {
              addClass(
                document.getElementById('article-list'),
                'slower-animated'
              )
              addClass(document.getElementById('article-list'), 'fadeInSmallUp')
            }
            this.articles.push({
              pid: article.pid,
              thumbnail: '/static/img/routines-dribbble.jpg',
              avatar: this.commonUtil.isEmpty(article.avatar)
                ? DEFAULT_WEB_ROOT + this.avatar
                : '/static/img/avatar.jpg',
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
    getArticlesByCategory(category) {
      this.category = category
      this.page = 1
      this.noMore = false
      this.search = ''
      this.articles = []
      removeClass(document.getElementById('article-list'), 'slower-animated')
      removeClass(document.getElementById('article-list'), 'fadeInSmallUp')
      this.getCommonArticles()
    },
    getCommonArticles(loading) {
      if (this.isLoadingData) {
        return
      }
      this.isLoadingData = true
      articleApi
        .getAuthArticles({
          category: this.category,
          page: this.page
        })
        .then(response => {
          let data = response.data
          data.datas.forEach(article => {
            if (this.page === 1) {
              addClass(
                document.getElementById('article-list'),
                'slower-animated'
              )
              addClass(document.getElementById('article-list'), 'fadeInSmallUp')
            }
            this.articles.push({
              pid: article.pid,
              thumbnail: '/static/img/routines-dribbble.jpg',
              avatar: this.commonUtil.isEmpty(article.avatar)
                ? DEFAULT_WEB_ROOT + this.avatar
                : '/static/img/avatar.jpg',
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
      articleApi.facetAuthCategory().then(response => {
        let data = response.data
        data.forEach(facetEntity => {
          this.categorys.push({
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
      if (this.$route.path !== '/my/blogs') {
        return false
      }
      if (
        document.documentElement.scrollTop + window.innerHeight >=
        document.body.clientHeight
      ) {
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
      return '/my/blogs/' + item.pid
    }
  }
}
</script>
