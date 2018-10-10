<script>
import { mapState, mapActions } from 'vuex'

import Card from '@/components/components/chat/card'
import ChatList from '@/components/components/chat/chat/list'
import MessageText from '@/components/components/chat/chat/text'
import Message from '@/components/components/chat/chat/message'
import FriendList from '@/components/components/chat/friend/list'
import Info from '@/components/components/chat/friend/info'

export default {
  components: { Card, ChatList, MessageText, Message, FriendList, Info },
  computed: {
    ...mapState({
      currentMenu: state => state.chat.currentMenu
    })
  },
  methods: {
    ...mapActions('chat', ['initData'])
  },
  created() {
    this.initData()
  }
}
</script>

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
