<template>
  <div class="chat-input-text" v-if="currentSessionId !== 0">
    <textarea placeholder="按 Enter 发送" v-model="content" @keyup="onKeyup"></textarea>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      content: ''
    }
  },
  computed: {
    ...mapState({
      currentSessionId: state => state.chat.currentSessionId,
      userNumber: state => state.auth.userNumber
    })
  },
  methods: {
    ...mapActions('chat', ['sendMessage']),
    onKeyup(e) {
      // e.ctrlKey &&
      if (e.keyCode === 13 && this.content.length) {
        let message = {
          msgId: this.commonUtil.uuid32(),
          sendFrom: this.userNumber,
          content: this.content,
          roomId: this.currentSessionId,
          msgType: 'text',
          createdTime: Date.parse(new Date()),
          status: 0
        }
        this.sendMessage(message)
        // setTimeout(() => {
        //   this.updateMessageStatus(tempId, 1)
        // }, 2000)
        this.content = ''
      }
    }
  }
}
</script>
