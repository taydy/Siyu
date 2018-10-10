<template>
  <div class="chat-card">
    <div class="chat-card-header">
      <img class="chat-avatar" width="50" height="50" :alt="nickname" :src="'https://yoyadoc.com/' + avatar">
      <!-- <p class="chat-name">{{nickname}}</p> -->
      <ul>
        <li v-for="item in nav" :key="item.name" @click="selectMenu(item.id)">
          <img class="chat-nav" width="30" height="30" :src="item.id === currentMenu ? item.active : item.default">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Nav from '@/_nav'
export default {
  data() {
    return {
      nav: Nav.chatNav
    }
  },
  computed: {
    ...mapState({
      avatar: state => state.auth.avatar,
      nickname: state => state.auth.nickname,
      currentMenu: state => state.chat.currentMenu
    })
  },
  methods: {
    ...mapActions('chat', ['selectMenu'])
  }
}
</script>
