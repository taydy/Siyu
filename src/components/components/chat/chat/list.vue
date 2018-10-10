<template>
  <div class="chat-list">
    <div class="chat-card-footer">
      <input class="chat-search" type="text" placeholder="search user..." @keyup="onKeyup">
    </div>
    <ul>
      <li v-for="item in sessions" :key="item.id" :class="{ 'active': item.id === currentSessionId }" @click="selectSession(item.id)">
        <img class="chat-avatar" width="30" height="30" :alt="item.name" :src="item.img">
        <p class="chat-name">{{item.name}}</p>
      </li>
    </ul>
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
  methods: {
    ...mapActions('chat', ['selectSession', 'search']),
    onKeyup(e) {
      this.search(e.target.value)
    }
  }
}
</script>
