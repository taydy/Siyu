<template>
  <div class="chat-list">
    <div class="chat-card-footer">
      <input class="chat-search" type="text" placeholder="search user..." @keyup="onKeyup">
    </div>
    <ul v-if="sessions.length !== 0">
      <li v-for="item in sessions" :key="item.roomId" :class="{ 'active': item.roomId === currentSessionId }" @click="selectSession(item.roomId)">
        <img class="chat-avatar" width="30" height="30" :src="'https://yoyadoc.com/' + item.image">
        <p class="chat-name">{{item.name}}</p>
      </li>
    </ul>
    <div class="no-data" v-else>
      <span>暂无聊天</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      sessions: state => {
        return state.chat.sessions.filter(session =>
          session.name.includes(state.chat.filterKey)
        )
      },
      currentSessionId: state => state.chat.currentSessionId
    })
  },
  mounted: function() {
    console.log(this.sessions)
  },
  methods: {
    ...mapActions('chat', ['selectSession', 'search']),
    onKeyup(e) {
      this.search(e.target.value)
    }
  }
}
</script>
