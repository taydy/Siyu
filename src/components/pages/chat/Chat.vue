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
        <messageText v-if="currentSessionId !== 0"></messageText>
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
    <div style="margin: 10px;display: none;">
      <audio controls="controls" style="width: 100%;" id="yx_player">
        <source src="/static/mp3/message.mp3">
      </audio>
      <audio controls="controls" style="width: 100%;" id="remind_yx_player">
        <source src="/static/mp3/remind.mp3">
      </audio>
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
import OSS from 'ali-oss'
import { chatApi } from '@/api/api'
export default {
  components: { Card, ChatList, MessageText, Message, FriendList, Info },
  data() {
    return {
      ossClient: new OSS({
        region: 'oss-cn-shanghai',
        accessKeyId: 'LTAIpBQLoMwGG10O',
        accessKeySecret: 'DZmlAAk7a8ifVdtRdS9DBuZoOQkAGc',
        bucket: 'siluyunyu'
      })
    }
  },
  computed: {
    ...mapState({
      currentMenu: state => state.chat.currentMenu,
      userNumber: state => state.auth.userNumber,
      myNewMessage: state => state.chat.myNewMessage,
      sessions: state => state.chat.sessions,
      currentSessionId: state => state.chat.currentSessionId,
      playSound: state => state.chat.playSound
    })
  },
  mounted: function() {
    this.initWebSocket()
    this.refreshRoom()
  },
  watch: {
    userNumber: function(val, oldVal) {
      if (val) {
        // this.initData(val)
        this.initWebSocket()
        this.refreshRoom()
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
      },
      deep: true
    },
    currentSessionId: function(val, oldVal) {
      this.updateRoom(val)
      this.updateRoomRead(val, this.userNumber)
    },
    playSound: function(val, oldVal) {
      if (val) {
        this.playMessageSound()
        this.updatePlaySound(false)
      }
    }
  },
  methods: {
    ...mapActions('chat', [
      'initData',
      'setRefreshType',
      'receiveMessage',
      'updateRoomInfo',
      'updatePlaySound',
      'addSession'
    ]),
    refreshRoom() {
      if (!this.userNumber) {
        return
      }
      chatApi.getRooms().then(response => {
        let rooms = response.data
        rooms.forEach(room => {
          this.addSession({
            roomId: room.roomId,
            name: room.roomName,
            total: room.total,
            image: room.image,
            unRead: room.unRead === 0 ? '' : room.unRead,
            messages: []
          })
        })
      })
    },
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
                this.playRemindSound()
                this.setRefreshType(2)
              } else if (event.type === 'FRIEND_REQUEST_REJECT') {
                this.notify(
                  '您的好友请求已被拒绝',
                  `${event.username} 拒绝了您的好友请求`
                )
                this.playRemindSound()
                this.setRefreshType(2)
              } else if (event.type === 'FRIEND_REQUEST_ACCEPT') {
                this.notify(
                  '您的好友请求已被同意',
                  `${event.username} 同意了您的好友请求`
                )
                this.playRemindSound()
                this.setRefreshType(1)
              } else if (event.type === 'FRIEND_DELETE') {
                this.notify(
                  '您已被好友删除',
                  `${event.username} 从好友列表中删除了你`
                )
                this.playRemindSound()
                this.setRefreshType(3)
              } else if (event.type === 'ROOM_INFO_CHANGE') {
                this.updateRoom(event.roomId)
              }
            }
          )
          this.stompClient.subscribe('/topic', message => {
            console.log(message)
          })
        }
      )
    },
    updateRoom(roomId) {
      chatApi.getRoom(roomId).then(response => {
        this.updateRoomInfo(response.data)
      })
    },
    async updateRoomRead(roomId, userNumber) {
      await this.stompClient.send(
        '/web/read',
        {},
        JSON.stringify({
          roomId: roomId,
          userNumber: userNumber
        })
      )
    },
    async sendMessage(message) {
      var tempMessage = this.commonUtil.clone(message)
      if (tempMessage.msgType === 'image') {
        let content = ''
        let msgJson = JSON.parse(tempMessage.content)
        msgJson.children[0].attrs.forEach(attr => {
          if (attr.name === 'src') {
            content = attr.value
          }
        })
        let url = await this.putBlob(tempMessage.realUrl, content)
        msgJson.children[0].attrs.forEach(attr => {
          if (attr.name === 'src') {
            attr.value = url
          }
        })
        tempMessage.content = JSON.stringify(msgJson)
        this.stompClient.send('/web/chat', {}, JSON.stringify(tempMessage))
      } else {
        this.stompClient.send('/web/chat', {}, JSON.stringify(tempMessage))
      }
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
    },
    async putBlob(key, content) {
      try {
        await this.ossClient.put(
          key,
          this.commonUtil.convertBase64ToBlob(content)
        )
        let head = await this.ossClient.head(key)
        console.log(head.res.requestUrls[0])
        return `https://yoyadoc.com/${key}`
      } catch (e) {
        console.log(e)
      }
    },
    async multipartUpload(file, key, insert) {
      try {
        await this.ossClient.multipartUpload(key, file, {
          progress: async function(p) {
            console.log('Progress: ' + p)
          },
          mime: 'image/jpeg'
        })
        let head = await this.ossClient.head(key)
        head.res.requestUrls.forEach(url => {
          insert(url)
        })
      } catch (e) {
        // 捕获超时异常
        if (e.code === 'ConnectionTimeoutError') {
          console.log('Woops,超时啦!')
          // do ConnectionTimeoutError operation
        }
        console.log(e)
      }
    },
    playMessageSound() {
      let plr = document.getElementById('yx_player')
      if (plr.paused) {
        plr.play()
      } else {
        plr.pause()
      }
    },
    playRemindSound() {
      let plr = document.getElementById('remind_yx_player')
      if (plr.paused) {
        plr.play()
      } else {
        plr.pause()
      }
    }
  }
}
</script>
