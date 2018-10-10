<template>
  <div class="chat-input-text">
    <textarea placeholder="按 Enter 发送" v-model="content" @keyup="onKeyup"></textarea>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Notify from '@wcjiang/notify'
export default {
  data() {
    return {
      content: ''
    }
  },
  methods: {
    ...mapActions('chat', ['sendMessage', 'updateMessageStatus']),
    onKeyup(e) {
      // e.ctrlKey &&
      if (e.keyCode === 13 && this.content.length) {
        let tempId = Math.random() * 10000
        let message = {
          tempId: tempId,
          content: this.content,
          date: new Date(),
          self: true,
          status: 0
        }
        this.sendMessage(message)
        this.notify(this.content)
        setTimeout(() => {
          this.updateMessageStatus(tempId, 1)
        }, 2000)
        this.content = ''
      }
    },
    notify(message) {
      const notify = new Notify({
        effect: 'flash',
        icon: '/static/img/favicon.ico',
        interval: 1000
      })
      notify
        .notify({
          title: 'taydy 发来消息',
          body: message,
          openurl: 'https://yoyadoc.com'
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
