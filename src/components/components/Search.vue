<template>
    <div class="search">
        <div class="search-input">
            <input type="text" placeholder="工具名" :class="{ active: searchResult.length > 0 }" v-model="keyword" @keyup="get($event)" @keydown.enter="search()" @keydown.down="selectDown()" @keydown.up.prevent="selectUp()">
            <span class="search-reset" @click="clearInput()">&times;</span>
            <button class="search-btn" @click="search()">搜一下</button>
            <div class="search-select">
                <transition-group name="search-result-fade" tag="ul" mode="out-in" v-cloak>
                    <li v-for="(value, index) in searchResult" :class="{ selectback: index == now }" class="search-select-option search-select-list" @mouseover="selectHover(index)" @click="selectClick(index)" :key="value">
                        {{value}}
                    </li>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      searchResult: [],
      now: -1,
      searchIndex: 0,
      keyword: ''
    }
  },
  methods: {
    get: function(ev) {
      if (ev.keyCode === 38 || ev.keyCode === 40) {
        return
      }
      this.$http
        .jsonp(
          'https://sug.so.360.cn/suggest?word=' +
            this.keyword +
            '&encodein=utf-8&encodeout=utf-8'
        )
        .then(function(res) {
          this.searchResult = res.data.s
        })
    },
    selectDown: function() {
      this.now++
      if (this.now === this.searchResult.length) {
        this.now = 0
      }
    },
    selectUp: function() {
      this.now--
      if (this.now === -1) {
        this.now = this.searchResult.length - 1
      }
    },
    search: function() {
      window.open(this.logoData[this.searchIndex].searchSrc + this.keyword)
    },
    selectHover: function(index) {
      this.now = index
    },
    selectClick: function(index) {
      this.keyword = this.searchResult[index]
      this.search()
    },
    clearInput: function() {
      this.now = -1
      this.keyword = ''
      this.searchResult = []
    },
    getIndex: function(index) {
      this.searchIndex = index
    }
  }
}
</script>
