<template>
  <div class="room-info" :class="isOpen ? 'open' : 'close'">
    <el-row>
      <el-col :span="20" :offset="2">
        <div class="room-main-info" v-show="roomInfo.total > 2" @keydown.native.enter.prevent ="roomNameChange">
          <el-form label-position="top" label-width="80px" :model="roomInfo" size="mini" @keydown.native.enter.prevent ="console.log('enter')">
            <el-form-item label="群名">
              <el-input v-model="roomInfo.roomName" @blur="roomNameChange"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <div class="room-uers">
      <el-row v-show="currentRoom.total > 2">
        <el-col :span="20" :offset="2">
          <el-input prefix-icon="el-icon-search" placeholder="过滤好友" v-model="roomUserFilterText" size="mini" style="margin-bottom:10px;">
          </el-input>
        </el-col>
      </el-row>
      <div class="setting" @click="openAddUserDialog">
        <el-row :gutter="20">
          <el-col :span="5" :offset="1">
            <img class="tree-leaf-user-avatar" src="/static/img/chat/square-add.svg" style="margin-left:2px;">
          </el-col>
          <el-col :span="12" class="fix-width" style="padding: 6px;">
            <span>添加成员</span>
          </el-col>
        </el-row>
      </div>
      <el-tree :data="users" node-key="id" :filter-node-method="roomUsersFilterNode" ref="roomUsersTree" @node-click="nodeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <div class="tree-leaf">
            <el-row :gutter="20">
              <el-col :span="5" :offset="1">
                <img class="tree-leaf-user-avatar" :src="'https://yoyadoc.com/' + data.avatar">
              </el-col>
              <el-col :span="12" class="fix-width" style="padding: 5px;">
                <span>{{ data.nickname }}</span>
              </el-col>
            </el-row>
          </div>
        </span>
      </el-tree>
    </div>
    <el-dialog title="提示" :visible.sync="addUserDialogVisible" width="30%" :append-to-body="true">
      <el-input prefix-icon="el-icon-search" placeholder="过滤好友" v-model="filterText" size="mini" style="margin-bottom:10px;">
      </el-input>
      <el-tree :filter-node-method="filterNode" ref="friendTree" :data="friends" node-key="id" empty-text="无分组及好友" show-checkbox :default-checked-keys="defaultChecked">
        <span class="custom-tree-node" style="width:100%" slot-scope="{ node, data }">
          <div v-if="node.level === 1" @contextmenu.prevent="$refs.menu.open($event, node.data)">
            <span>{{ node.label }}</span>
            <span class="custom-tree-node-number">{{ node.data.online }}/{{ node.data.total }}</span>
          </div>
          <div class="tree-leaf" v-else>
            <el-row :gutter="10">
              <el-col :span="3">
                <img style="max-width:40px;" class="tree-leaf-user-avatar" :src="'https://yoyadoc.com/' + node.data.info.avatar">
              </el-col>
              <el-col :span="21">
                <el-row>
                  <el-col :span="18" class="fix-width">
                    <span :class="node.data.status === 1 ? 'online' : ''">{{ node.label }}</span>
                  </el-col>
                  <el-col :span="4" :offset="2">
                    <span :class="node.data.status === 1 ? 'online-badge status-badge' : 'status-badge'">[{{ node.data.status === 1 ? '在线' : '离线' }}]</span>
                  </el-col>
                </el-row>
                <el-row class="fix-width">
                  <span>{{ node.data.info.motto || '此人很懒，什么都没有留下...' }}</span>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addRoomUsers" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { chatApi } from '@/api/api'
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      users: [],
      addUserDialogVisible: false,
      filterText: '',
      roomUserFilterText: '',
      roomInfo: {}
    }
  },
  watch: {
    isOpen(val) {
      console.log(val)
    },
    currentSessionId(val) {
      this.getRoomUsers()
    },
    filterText(val) {
      this.$refs.friendTree.filter(val)
    },
    roomUserFilterText(val) {
      this.$refs.roomUsersTree.filter(val)
    },
    currentRoom(val) {
      this.roomInfo = this.commonUtil.clone(val)
    }
  },
  computed: {
    ...mapState({
      currentSessionId: state => state.chat.currentSessionId,
      groupFriends: state => state.chat.groupFriends,
      sessions: state => state.chat.sessions,
      currentRoom: state => state.chat.currentRoom
    }),
    defaultChecked() {
      var checkeds = []
      this.users.forEach(user => {
        checkeds.push(user.userNumber)
      })
      return checkeds
    },
    friends() {
      let tempFriends = this.commonUtil.clone(this.groupFriends)
      tempFriends.forEach(group => {
        group.children.forEach(friend => {
          if (this.defaultChecked.indexOf(friend.id) > -1) {
            friend.disabled = true
          }
        })
      })
      return tempFriends
    }
  },
  mounted: function() {
    this.getRoomUsers()
  },
  methods: {
    ...mapActions('chat', [
      'selectSession',
      'addSession',
      'selectMenu',
      'addUserAvatar',
      'updateRoomInfo'
    ]),
    getRoomUsers() {
      if (this.currentSessionId === 0) {
        return
      }
      chatApi.getRoomUsers(this.currentSessionId).then(response => {
        this.users = response.data
        this.users.forEach(user => {
          this.addUserAvatar({
            userNumber: user.userNumber,
            avatar: user.avatar
          })
        })
      })
    },
    nodeClick(data, node) {
      console.log(data)
    },
    openAddUserDialog() {
      this.addUserDialogVisible = true
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    roomUsersFilterNode(value, data) {
      if (!value) return true
      return data.nickname.indexOf(value) !== -1
    },
    addRoomUsers() {
      let userNumbers = this.$refs.friendTree
        .getCheckedKeys()
        .filter(key => key > 1000)
      chatApi
        .addRoomUsers({
          room_id: this.currentSessionId,
          room_users: userNumbers
        })
        .then(response => {
          this.addUserDialogVisible = false
          let room = response.data
          if (room.roomId === this.currentSessionId) {
            this.getRoomUsers()
          } else {
            if (
              this.sessions.filter(session => session.roomId === room.roomId)
                .length === 0
            ) {
              this.addSession({
                roomId: room.roomId,
                name: room.roomName,
                image: 'static/img/chat/default.jpg',
                messages: []
              })
            }
            this.selectSession(room.roomId)
            this.selectMenu(1)
          }
        })
    },
    roomNameChange() {
      chatApi.updateRoom({
        room_id: this.roomInfo.roomId,
        room_name: this.roomInfo.roomName
      }).then(response => {
        this.updateRoomInfo(response.data)
      })
    }
  }
}
</script>
