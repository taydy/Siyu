<template>
  <div class="friend-info"  v-if="currentTreeNode.id">
    <div class="friend-info-header">
      <el-row>
        <el-col :span="10" :offset="4">
          <div class="info-nickname">
            <span>{{currentTreeNode.label}}</span>
          </div>
          <div class="info-motto">
            <span>{{ getMotto(currentTreeNode.info) }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <img width="100" height="100" src="/static/img/chat/1.jpg">
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" :offset="4">
          <div class="dividing-line"></div>
        </el-col>
      </el-row>
    </div>
    <div class="info-footer">
      <el-button type="success" size="middle" @click="startSession(currentTreeNode)" v-show="currentTreeNode.type === 'friend'">发送消息</el-button>
      <el-button type="success" size="middle" @click="accept(currentTreeNode)" v-show="currentTreeNode.type === 'friend_request'">同意</el-button>
      <el-button type="danger" size="middle" @click="reject(currentTreeNode)" v-show="currentTreeNode.type === 'friend_request'">拒绝</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      currentTreeNode: state => state.chat.currentTreeNode,
      sessions: state => state.chat.sessions
    })
  },
  methods: {
    ...mapActions('chat', ['selectSession', 'addSession', 'selectMenu']),
    getMotto(info) {
      if (info && info.motto) {
        return info.motto
      } else {
        return '此人很懒，什么都没有留下...'
      }
    },
    startSession(currentTreeNode) {
      if (this.sessions.filter(session => session.id === currentTreeNode.id).length === 0) {
        this.addSession({
          id: currentTreeNode.id,
          name: currentTreeNode.label,
          img: currentTreeNode.info.img,
          messages: []
        })
      }
      this.selectSession(currentTreeNode.id)
      this.selectMenu(1)
    }
  }
}
</script>
