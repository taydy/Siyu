<template>
  <div class="chat-message" v-if="currentSessionId !== 0">
    <div class="chat-message-header">
      <el-row>
        <el-col :span="10">
          <div class="header-name" @click="toggerOpen">
            <span>{{currentRoom.roomName || session.name}}</span>
            <span class="total" v-if="currentRoom.total > 2">({{currentRoom.total}})</span>
          </div>
        </el-col>
        <el-col :span="4" :offset="10">
          <div class="header-setting" @click="toggerOpen">
            <img width="25" height="25" src="/static/img/chat/peoples.svg">
          </div>
        </el-col>
      </el-row>
    </div>
    <room-info :isOpen="isOpen"></room-info>
    <div class="chat-message-body" id="chat-message-body" v-scroll-bottom="session.messages" v-scroll="handleScroll" v-if="currentSessionId !== 0">
      <ul v-if="session">
        <li v-for="item in session.messages" :key="item.msgId">
          <p class="chat-message-time">
            <span>{{ item.createdTime | moment("calendar") }}</span>
          </p>
          <div class="chat-message-main" :class="{ 'chat-message-self': item.sendFrom === userNumber }">
            <img class="chat-message-avatar" width="30" height="30" :src="'https://yoyadoc.com/' + (item.sendFrom === userNumber ? avatar : getUserAvatar(item.sendFrom))" />
            <img src="/static/img/chat/sending.svg" class="chat-message-loading" v-show="item.status === 0" />
            <div class="chat-message-text" :class="item.msgType === 'image' ? 'chat-message-image' : ''">
              <p v-for="(item, index) in JSON.parse(item.content).children" :key="index" :style="isEnmoji(item) ? 'display:inline;margin:0 2px;' : ''">
                <img v-if="isPreview(item)" :src="item.attrs[0].value" v-viewer>
                <img v-else-if="item.tag === 'img'" style="padding-top: 10px;padding-bottom: 10px;display:inline;" :src="item.attrs[0].value">
                <br v-else-if="item.tag === 'br'">
                <a v-else>{{item}}</a>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import RoomInfo from './room_info'
import { chatApi } from '@/api/api'
export default {
  data() {
    return {
      lastRenderTime: '',
      isOpen: false,
      lastTime: '',
      isRefreshing: false
    }
  },
  components: {
    RoomInfo
  },
  computed: {
    ...mapState({
      avatar: state => state.auth.avatar,
      username: state => state.auth.username,
      userNumber: state => state.auth.userNumber,
      session: state => {
        return state.chat.sessions.find(
          session => session.roomId === state.chat.currentSessionId
        )
      },
      currentSessionId: state => state.chat.currentSessionId,
      userAvatar: state => state.chat.userAvatar,
      currentRoom: state => state.chat.currentRoom,
      myNewMessage: state => state.chat.myNewMessage
    })
  },
  mounted: function() {
    if (!this.session) {
      return
    }
    this.initMessage()
  },
  watch: {
    currentSessionId(val) {
      this.initMessage()
    }
  },
  methods: {
    ...mapActions('chat', ['selectSession', 'addUserAvatar', 'loadMessage']),
    isPreview(item) {
      return item.tag === 'img' && item.attrs[0].value.indexOf('yoyadoc') !== -1
    },
    isEnmoji(item) {
      return item.tag === 'img' && item.attrs[0].value.indexOf('yoyadoc') === -1
    },
    isShow(time, item) {
      if (
        !this.lastRenderTime ||
        this.lastRenderTime - time >= 0 ||
        time - this.lastRenderTime > 600000
      ) {
        this.lastRenderTime = time
        return true
      } else {
        return false
      }
    },
    toggerOpen() {
      this.isOpen = !this.isOpen
    },
    getUserAvatar(userNumber) {
      let avatar = this.userAvatar[userNumber]
      if (!avatar) {
        chatApi.getRoomUsers(this.currentSessionId).then(response => {
          this.users = response.data
          this.users.forEach(user => {
            this.addUserAvatar({
              userNumber: user.userNumber,
              avatar: user.avatar
            })
          })
          return this.userAvatar[userNumber]
        })
      } else {
        return avatar
      }
    },
    initMessage() {
      if (this.session.messages.length === 0) {
        this.getMessage()
      } else {
        let length = this.session.messages.length
        this.lastTime = this.session.messages[length - 1].createdTime
      }
    },
    getMessage() {
      if (this.isRefreshing) {
        return
      }
      if (!this.lastTime) {
        this.lastTime = Date.parse(new Date())
      }
      chatApi
        .listMessage(this.currentSessionId, this.lastTime)
        .then(response => {
          let messages = response.data
          if (messages.length === 0) {
            return
          }
          this.lastTime = messages[messages.length - 1].createdTime
          messages.forEach(message => {
            this.loadMessage(message)
          })
          this.isRefreshing = false
        })
    },
    handleScroll(el) {
      if (el.scrollTop === 0) {
        this.getMessage()
      }
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
    },
    scroll: {
      bind: function(el, binding) {
        el.addEventListener('scroll', () => {
          let func = binding.value
          func(el)
        })
      }
    }
  }
}
</script>
