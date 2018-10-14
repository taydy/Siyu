<template>
  <div class="chat-list">
    <div class="friend-list">
      <el-collapse v-model="activeName">
        <el-collapse-item name="0">
          <template slot="title">
            添加好友
          </template>
          <div @keyup.enter="searchUsers">
            <el-input prefix-icon="el-icon-search" placeholder="输入昵称或 chat 号进行搜索" v-model="userQuery" size="mini" style="margin-bottom:10px;">
            </el-input>
          </div>
          <el-tree :data="users" node-key="id" empty-text="暂无匹配结果" @node-click="nodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div class="tree-leaf">
                <el-row :gutter="10">
                  <el-col :span="4">
                    <img class="tree-leaf-user-avatar" :src="'https://yoyadoc.com/' + node.data.info.avatar">
                  </el-col>
                  <el-col :span="20">
                    <el-row>
                      <el-col :span="18" class="fix-width">
                        <span>{{ node.label }}</span>
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
        </el-collapse-item>
        <el-collapse-item name="1">
          <template slot="title">
            好友申请 <el-tag class="custom-badge" v-show="newRequest > 0">{{ newRequest }}</el-tag>
          </template>
          <el-tree :data="friendRequests" node-key="id" empty-text="暂无好友申请记录" @node-click="nodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div class="tree-leaf">
                <el-row :gutter="10">
                  <el-col :span="4">
                    <img class="tree-leaf-user-avatar" :src="'https://yoyadoc.com/' + node.data.info.avatar">
                  </el-col>
                  <el-col :span="20">
                    <el-row>
                      <el-col :span="18" class="fix-width">
                        <span>{{ node.label }}</span>
                      </el-col>
                      <el-col :span="6" class="fix-width">
                        <span>{{ status[node.data.status] }}</span>
                      </el-col>
                    </el-row>
                    <el-row class="fix-width">
                      <span>{{ node.data.message }}</span>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </span>
          </el-tree>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            我的申请
          </template>
          <el-tree :data="myRequests" node-key="id" empty-text="暂无好友申请记录" @node-click="nodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div class="tree-leaf">
                <el-row :gutter="10">
                  <el-col :span="4">
                    <img class="tree-leaf-user-avatar" :src="'https://yoyadoc.com/' + node.data.info.avatar">
                  </el-col>
                  <el-col :span="20">
                    <el-row>
                      <el-col :span="18" class="fix-width">
                        <span>{{ node.label }}</span>
                      </el-col>
                      <el-col :span="6" class="fix-width">
                        <span>{{ status[node.data.status] }}</span>
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
        </el-collapse-item>
        <el-collapse-item title="我的群聊" name="3">
          <ul>
            <li v-for="item in rooms" :key="item.roomId">
              <p class="chat-name">{{item.roomName}}</p>
            </li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="我的好友" name="4">
          <el-input prefix-icon="el-icon-search" placeholder="过滤好友" v-model="filterText" size="mini" style="margin-bottom:10px;">
          </el-input>
          <el-tree :filter-node-method="filterNode" ref="friendTree" :data="friends" node-key="id" empty-text="无分组及好友" :indent="-10" draggable @node-drag-end="handleDragEnd" :allow-drop="allowDrop" :allow-drag="allowDrag" @node-click="nodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div v-if="node.level === 1" @contextmenu.prevent="$refs.menu.open($event, node.data)">
                <span>{{ node.label }}</span>
                <span class="custom-tree-node-number">{{ node.data.online }}/{{ node.data.total }}</span>
              </div>
              <div class="tree-leaf" v-else>
                <el-row :gutter="10">
                  <el-col :span="4">
                    <img class="tree-leaf-user-avatar" :src="'https://yoyadoc.com/' + node.data.info.avatar">
                  </el-col>
                  <el-col :span="20">
                    <el-row>
                      <el-col :span="18" class="fix-width">
                        <span :class="node.data.status === 1 ? 'online' : ''">{{ node.label }}</span>
                      </el-col>
                      <el-col :span="5" :offset="1">
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
        </el-collapse-item>
      </el-collapse>
    </div>
    <vue-context ref="menu">
      <ul slot-scope="child">
        <li @click="menuClick($event.target.innerText, child.data)">重命名</li>
        <li @click="menuClick($event.target.innerText, child.data)">删除分组</li>
        <li @click="menuClick($event.target.innerText, child.data)">新增分组</li>
      </ul>
    </vue-context>
    <el-dialog title="重命名分组" :visible.sync="renameGroupDialogShow" width="30%">
      <el-form label-position="top" label-width="80px" :model="groupForm" :rules="rules" ref="renameForm" style="text-align:left;" size="mini">
        <el-form-item label="分组名" prop="group_name">
          <el-input v-model="groupForm.group_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="renameGroupDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="renameGroup('renameForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增分组" :visible.sync="addGroupDialogShow" width="30%">
      <el-form label-position="top" label-width="80px" :model="groupForm" :rules="rules" ref="addForm" style="text-align:left;" size="mini">
        <el-form-item label="分组名" prop="group_name">
          <el-input v-model="groupForm.group_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGroupDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addGroup('addForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Common from '@/assets/js/common'
import { chatApi, userApi } from '@/api/api'
import { VueContext } from 'vue-context'
export default {
  data() {
    return {
      activeName: '4',
      users: [],
      userQuery: '',
      friendRequests: [],
      newRequest: 0,
      myRequests: [],
      rooms: [],
      friends: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      status: {
        1: '等待审批',
        2: '已添加',
        3: '已拒绝'
      },
      renameGroupDialogShow: false,
      addGroupDialogShow: false,
      groupForm: {},
      rules: {
        group_name: [
          { required: true, message: '请输入分组名', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  components: {
    VueContext
  },
  computed: {
    ...mapState({
      sessions: state => {
        return state.chat.sessions.filter(session =>
          session.user.name.includes(state.chat.filterKey)
        )
      },
      currentSessionId: state => state.chat.currentSessionId,
      currentTreeNode: state => state.chat.currentTreeNode,
      refreshType: state => state.chat.refreshType
    })
  },
  mounted: function() {
    this.refreshFriends()
    this.getFriendRequest()
  },
  watch: {
    filterText(val) {
      this.$refs.friendTree.filter(val)
    },
    friendRequests(val) {
      this.newRequest = this.friendRequests.filter(
        item => item.status === 1
      ).length
    },
    refreshType(val) {
      console.log(val)
      if (val === 1) {
        this.getFriendRequest()
        this.refreshFriends()
        this.setRefreshType(0)
      } else if (val === 2) {
        this.getFriendRequest()
        this.setRefreshType(0)
      } else if (val === 3) {
        this.refreshFriends()
        this.setRefreshType(0)
      }
    }
  },
  methods: {
    ...mapActions('chat', [
      'selectSession',
      'search',
      'selectTreeNode',
      'setRefreshType',
      'setGroupFriends'
    ]),
    onKeyup(e) {
      this.search(e.target.value)
    },
    refreshFriends() {
      chatApi.getGroupFriends().then(response => {
        console.log(response.data)
        var temp = []
        response.data.forEach(group => {
          let tempGroup = {
            id: group.groupId,
            label: group.groupName,
            type: 'friend',
            children: []
          }
          group.friends.forEach(friend => {
            tempGroup.children.push({
              id: friend.userNumber,
              label: friend.nickname,
              status: friend.userStatus,
              info: friend,
              type: 'friend'
            })
          })
          temp.push(tempGroup)
          this.friends = temp
        })
        this.sortFriendsData()
        this.setGroupFriends(this.friends)
      })
    },
    sortFriendsData() {
      var compare = function(obj1, obj2) {
        if (obj1.status < obj2.status) {
          return 1
        } else if (obj1.status > obj2.status) {
          return -1
        } else {
          if (obj1.label < obj2.label) {
            return -1
          } else if (obj1.label > obj2.label) {
            return 1
          } else {
            return 0
          }
        }
      }
      var temp = Common.clone(this.friends)
      for (var item of temp) {
        if (!item.children) {
          item.children = []
        }
        item.total = item.children.length
        item.online = 0
        item.children = item.children.sort(compare)
        for (var child of item.children) {
          if (child.status === 1) {
            item.online++
          }
        }
      }
      this.friends = temp
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.level !== 1) {
        return false
      }
      if ((type === 'next' || type === 'prev') && dropNode.level === 1) {
        return false
      }
      return true
    },
    allowDrag(draggingNode) {
      return (
        !draggingNode.data.children || draggingNode.data.children.length === 0
      )
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      this.sortFriendsData()
      chatApi.updateFriend({
        friend_number: draggingNode.data.id,
        group_id: dropNode.data.id
      })
    },
    nodeClick(data, node) {
      if (data.type === 'friend' && node.level === 1) {
        return
      }
      this.selectTreeNode(data)
    },
    searchUsers() {
      userApi.searchUsers(this.userQuery).then(response => {
        var temp = []
        response.data.forEach(user => {
          let tempGroup = {
            id: user.userNumber,
            label: user.nickname,
            type: 'users',
            info: user
          }
          temp.push(tempGroup)
        })
        this.users = temp
      })
    },
    getFriendRequest() {
      chatApi.getMyFriendRequest().then(response => {
        var temp = []
        response.data.forEach(request => {
          let tempGroup = {
            id: request.id,
            label: request.to.nickname,
            type: 'my_friend_request',
            info: request.to,
            status: request.status,
            message: request.message
          }
          temp.push(tempGroup)
        })
        this.myRequests = temp
        console.log(this.myRequests)
      })
      chatApi.getOtherFriendRequest().then(response => {
        var temp = []
        response.data.forEach(request => {
          let tempGroup = {
            id: request.id,
            label: request.from.nickname,
            type: 'friend_request',
            info: request.from,
            status: request.status,
            message: request.message
          }
          temp.push(tempGroup)
        })
        this.friendRequests = temp
      })
    },
    menuClick(text, data) {
      this.groupForm = {
        group_id: data.id
      }
      if (text === '重命名') {
        this.renameGroupDialogShow = true
        this.groupForm['group_name'] = data.label
      } else if (text === '新增分组') {
        this.addGroupDialogShow = true
        this.groupForm['group_name'] = ''
      } else if (text === '删除分组') {
        this.deleteGroup(data)
      }
    },
    renameGroup(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          chatApi
            .updateGroup(this.groupForm)
            .then(response => {
              this.$notify({
                title: '成功',
                message: '重命名分组成功！',
                type: 'success'
              })
              this.renameGroupDialogShow = false
              this.refreshFriends()
            })
            .catch(err => {
              this.$notify({
                title: '警告',
                message: err.message,
                type: 'warning'
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteGroup(data) {
      if (data.children.length !== 0) {
        this.$message({
          message:
            '改分组下存在用户，请先转移用户至其他分组后，再尝试删除操作!',
          type: 'warning'
        })
      } else {
        this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            chatApi
              .deleteGroup({
                group_id: data.id
              })
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.refreshFriends()
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    addGroup(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          chatApi
            .addGroup(this.groupForm)
            .then(response => {
              this.$notify({
                title: '成功',
                message: '新增分组成功！',
                type: 'success'
              })
              this.addGroupDialogShow = false
              this.refreshFriends()
            })
            .catch(err => {
              this.$notify({
                title: '警告',
                message: err.message,
                type: 'warning'
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
