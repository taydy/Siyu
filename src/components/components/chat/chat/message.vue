<template>
  <div class="chat-message">
    <div class="chat-message-header">
      <el-row>
        <el-col :span="10">
          <div class="header-name">
            <span>{{session.name}}</span>
          </div>
        </el-col>
        <el-col :span="4" :offset="10">
          <div class="header-setting">
            <img width="25" height="25" src="/static/img/chat/peoples.svg">
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="chat-message-body" v-scroll-bottom="session.messages">
      <ul v-if="session">
        <li v-for="item in session.messages" :key="item.id">
          <p class="chat-message-time">
            <span>{{ item.date | time }}</span>
          </p>
          <div class="chat-message-main" :class="{ 'chat-message-self': item.self }">
            <img class="chat-message-avatar" width="30" height="30" :src="item.self ? avatar : session.img" />
            <img src="/static/img/chat/sending.svg" class="chat-message-loading" v-show="item.status === 0"/>
            <div class="chat-message-text">{{ item.content }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      avatar: state => 'https://yoyadoc.com/' + state.auth.avatar,
      username: state => state.auth.username,
      session: state => {
        return state.chat.sessions.find(
          session => session.id === state.chat.currentSessionId
        )
      },
      currentSessionId: state => state.chat.currentSessionId
    })
  },
  methods: {
    ...mapActions('chat', ['selectSession'])
  },
  filters: {
    // 将日期过滤为 hour:minutes
    time(date) {
      if (typeof date === 'string') {
        date = new Date(date)
      }
      return date.getHours() + ':' + date.getMinutes()
    }
  },
  directives: {
    // 发送消息后滚动到底部
    'scroll-bottom': {
      inserted: function(el, binding) {
        el.scrollTop = el.scrollHeight - el.clientHeight
      },
      componentUpdated: function(el, binding) {
        el.scrollTop = el.scrollHeight - el.clientHeight
      }
    }
  }
}
</script>
