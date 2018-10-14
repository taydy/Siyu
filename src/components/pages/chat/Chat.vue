<template>
  <div id="chat">
    <div class="chat-sidebar-left">
      <card></card>
    </div>
    <div class="chat-container" v-if="currentMenu === 1">
      <div class="chat-sidebar">
        <chat-list></chat-list>
      </div>
      <div class="chat-main">
        <message></message>
        <messageText></messageText>
      </div>
    </div>
    <div class="chat-container" v-else-if="currentMenu === 2">
      <div class="chat-sidebar">
        <friend-list></friend-list>
      </div>
      <div class="chat-main">
        <info></info>
      </div>
    </div>
  </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'

import Card from '@/components/components/chat/card'
import ChatList from '@/components/components/chat/chat/list'
import MessageText from '@/components/components/chat/chat/text'
import Message from '@/components/components/chat/chat/message'
import FriendList from '@/components/components/chat/friend/list'
import Info from '@/components/components/chat/friend/info'

import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import Notify from '@wcjiang/notify'
export default {
  components: { Card, ChatList, MessageText, Message, FriendList, Info },
  computed: {
    ...mapState({
      currentMenu: state => state.chat.currentMenu,
      userNumber: state => state.auth.userNumber,
      myNewMessage: state => state.chat.myNewMessage,
      sessions: state => state.chat.sessions
    })
  },
  mounted: function() {
    this.initWebSocket()
  },
  watch: {
    userNumber: function(val, oldVal) {
      if (val) {
        this.initData(val)
        this.initWebSocket()
      }
    },
    myNewMessage: function(val, oldVal) {
      if (val) {
        this.sendMessage(val)
      }
    },
    sessions: {
      handler(val, oldVal) {
        localStorage['chat-session-' + this.userNumber] = JSON.stringify(val)
        console.log(
          JSON.parse(localStorage.getItem('chat-session-' + this.userNumber))
        )
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('chat', ['initData', 'setRefreshType', 'receiveMessage']),
    initWebSocket() {
      this.connection()
    },
    connection() {
      if (!this.userNumber) {
        return
      }
      this.socket = new SockJS(process.env.API_ROOT_PATH + '/chat')
      this.stompClient = Stomp.over(this.socket)
      const headers = {
        Authorization: `Bearer ${localStorage.token}`
      }
      this.stompClient.connect(
        headers,
        frame => {
          this.stompClient.subscribe(
            '/user/' + this.userNumber + '/message',
            frame => {
              const message = JSON.parse(frame.body)
              console.log(message)
              if (message.sendFrom === this.userNumber) {
                message.self = true
              }
              this.receiveMessage(message)
            }
          )
          this.stompClient.subscribe(
            '/user/' + this.userNumber + '/event',
            frame => {
              const event = JSON.parse(frame.body)
              console.log(event)
              if (event.type === 'FRIEND_REQUEST') {
                this.notify(
                  '新的好友请求',
                  `${event.username} 请求添加您为好友`
                )
                this.setRefreshType(2)
              } else if (event.type === 'FRIEND_REQUEST_REJECT') {
                this.notify(
                  '您的好友请求已被拒绝',
                  `${event.username} 拒绝了您的好友请求`
                )
                this.setRefreshType(2)
              } else if (event.type === 'FRIEND_REQUEST_ACCEPT') {
                this.notify(
                  '您的好友请求已被同意',
                  `${event.username} 同意了您的好友请求`
                )
                this.setRefreshType(1)
              } else if (event.type === 'FRIEND_DELETE') {
                this.notify(
                  '您已被好友删除',
                  `${event.username} 从好友列表中删除了你`
                )
                this.setRefreshType(3)
              }
            }
          )
          this.stompClient.subscribe('/topic', message => {
            console.log(message)
          })
        }
      )
    },
    sendMessage(message) {
      this.stompClient.send('/web/chat', {}, JSON.stringify(message))
    },
    notify(title, message) {
      const notify = new Notify({
        effect: 'flash',
        icon: '/static/img/favicon.ico'
      })
      notify.notify({
        title: title,
        body: message
      })
      this.updateFavicon()
    },
    updateFavicon() {
      var link =
        document.querySelectorAll('link[rel~=shortcut]')[0] ||
        document.createElement('link')
      link.type = 'image/x-icon'
      link.rel = 'shortcut icon'
      link.href = '/static/img/favicon.ico'
      document.getElementsByTagName('head')[0].appendChild(link)
    }
  }
}
</script>
