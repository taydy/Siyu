<template>
  <div class="friend-info" v-if="currentTreeNode.id || currentTreeNode.roomId">
    <div class="friend-info-header" v-if="currentTreeNode.id">
      <el-row>
        <el-col :span="12" :offset="4">
          <div class="info-nickname fix-width">
            <span>{{currentTreeNode.label}}</span>
          </div>
          <div class="info-motto">
            <span>{{ getMotto(currentTreeNode.info) }}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <img width="100" height="100" :src="'https://yoyadoc.com/' + currentTreeNode.info.avatar">
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" :offset="4">
          <div class="dividing-line"></div>
        </el-col>
      </el-row>
    </div>
    <div class="room-chat-info" v-if="currentTreeNode.roomId">
      <el-row>
        <el-col :span="6" :offset="9">
          <img width="120" height="120" :src="'https://yoyadoc.com/' + currentTreeNode.image">
        </el-col>
      </el-row>
      <el-row class="room-name">
        <el-col :span="14" :offset="5">
          <span>{{ currentTreeNode.roomName }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="info-footer" v-if="currentTreeNode.type === 'friend'">
      <el-button type="success" size="middle" @click="startSession(currentTreeNode)">发送消息</el-button>
      <el-button type="danger" size="middle" @click="deleteFriend(currentTreeNode)">删除好友</el-button>
    </div>
    <div class="info-footer" v-if="currentTreeNode.type === 'room_chat'">
      <el-button type="success" size="middle" @click="startRoomSession(currentTreeNode)">进入群聊</el-button>
    </div>
    <div class="info-footer" v-else-if="currentTreeNode.type === 'users'">
      <el-button type="success" size="middle" @click="startSession(currentTreeNode)" v-if="currentTreeNode.info.roomId">发送消息</el-button>
      <el-row v-if="!currentTreeNode.info.roomId && formShow">
        <el-col :span="10" :offset="7">
          <el-form label-position="top" label-width="80px" :model="form" :rules="rules" ref="ruleForm" style="text-align:left;" size="mini">
            <el-form-item label="填写验证信息" prop="message">
              <el-input type="textarea" :rows="2" v-model="form.message"></el-input>
            </el-form-item>
            <el-form-item label="设置备注" prop="remarks">
              <el-input v-model="form.remarks"></el-input>
            </el-form-item>
            <el-form-item label="设置分组" prop="groupId">
              <el-select v-model="form.groupId" placeholder="请选择分组">
                <el-option v-for="item in groups" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-button type="success" size="middle" @click="addFriend('ruleForm')" v-if="formShow">发送添加好友请求</el-button>
      <el-button type="success" size="middle" @click="showForm" v-if="!currentTreeNode.info.roomId && !formShow">添加好友</el-button>
    </div>
    <div class="info-footer" v-else-if="currentTreeNode.type === 'friend_request' && currentTreeNode.status === 1">
      <el-button type="success" size="middle" @click="openAcceptDialog">同意</el-button>
      <el-button type="danger" size="middle" @click="reject(currentTreeNode)">拒绝</el-button>
    </div>
    <el-dialog title="添加好友" :visible.sync="acceptDialogShow" width="30%">
      <el-form label-position="top" label-width="80px" :model="acceptForm" :rules="rules" ref="ruleForm" style="text-align:left;" size="mini">
        <el-form-item label="设置备注" prop="remarks">
          <el-input v-model="acceptForm.remarks"></el-input>
        </el-form-item>
        <el-form-item label="设置分组" prop="groupId">
          <el-select v-model="acceptForm.groupId" placeholder="请选择分组">
            <el-option v-for="item in groups" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="acceptDialogShow = false">取消</el-button>
        <el-button type="primary" @click="accept('ruleForm')">添加好友</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { chatApi } from '@/api/api'
import Common from '@/assets/js/common'
export default {
  data() {
    return {
      form: {},
      acceptForm: {},
      groups: [],
      formShow: false,
      acceptDialogShow: false,
      rules: {
        message: [
          { required: true, message: '请输入验证信息', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        remarks: [
          { required: true, message: '请输入备注', trigger: 'blur' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      currentTreeNode: state => state.chat.currentTreeNode,
      nickname: state => state.auth.nickname,
      sessions: state => state.chat.sessions,
      refreshType: state => state.chat.refreshType
    })
  },
  watch: {
    currentTreeNode: function(newValue, oldValue) {
      this.formShow = false
    }
  },
  methods: {
    ...mapActions('chat', [
      'selectSession',
      'addSession',
      'selectMenu',
      'selectTreeNode',
      'setRefreshType'
    ]),
    showForm() {
      this.formShow = true
      this.form = {
        sendTo: this.currentTreeNode.id,
        message: '我是 ' + this.nickname,
        remarks: this.currentTreeNode.label
      }
      this.groups = []
      chatApi.getGroups().then(response => {
        response.data.forEach(group => {
          this.groups.push({
            label: group.groupName,
            value: group.groupId
          })
        })
        this.form['groupId'] = this.groups[0].value
      })
    },
    getMotto(info) {
      if (info && info.motto) {
        return info.motto
      } else {
        return '此人很懒，什么都没有留下...'
      }
    },
    startSession(currentTreeNode) {
      if (
        this.sessions.filter(
          session => session.roomId === currentTreeNode.info.roomId
        ).length === 0
      ) {
        this.addSession({
          roomId: currentTreeNode.info.roomId,
          name: currentTreeNode.label,
          image: currentTreeNode.info.avatar,
          messages: []
        })
      }
      this.selectSession(currentTreeNode.info.roomId)
      this.selectMenu(1)
    },
    startRoomSession(currentTreeNode) {
      if (
        this.sessions.filter(
          session => session.roomId === currentTreeNode.roomId
        ).length === 0
      ) {
        this.addSession({
          roomId: currentTreeNode.roomId,
          name: currentTreeNode.roomName,
          image: currentTreeNode.image,
          messages: []
        })
      }
      this.selectSession(currentTreeNode.roomId)
      this.selectMenu(1)
    },
    deleteFriend(currentTreeNode) {
      this.$confirm('此操作将永久删除该好友, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          chatApi
            .deleteFriend({
              friend_number: currentTreeNode.id
            })
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.selectTreeNode({})
              this.setRefreshType(1)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addFriend(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          chatApi
            .addFriendRequest(this.form)
            .then(response => {
              this.$message({
                message: '好友请求已发送！',
                type: 'success'
              })
              this.formShow = false
              this.setRefreshType(2)
            })
            .catch(err => {
              this.$message({
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
    accept(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          chatApi
            .acceptFriendRequest(this.acceptForm)
            .then(response => {
              this.$message({
                message: '好友添加成功！',
                type: 'success'
              })
              this.acceptDialogShow = false
              const temp = Common.clone(this.currentTreeNode)
              temp.status = 2
              this.selectTreeNode(temp)
              this.setRefreshType(1)
            })
            .catch(err => {
              this.$message({
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
    reject() {
      chatApi
        .rejectFriendRequest({
          id: this.currentTreeNode.id
        })
        .then(response => {
          this.$message({
            message: '已拒绝该好友请求！',
            type: 'success'
          })
          this.acceptDialogShow = false
          const temp = Common.clone(this.currentTreeNode)
          temp.status = 3
          this.selectTreeNode(temp)
          this.setRefreshType(1)
        })
        .catch(err => {
          this.$message({
            message: err.message,
            type: 'warning'
          })
        })
    },
    openAcceptDialog() {
      this.acceptDialogShow = true
      this.acceptForm = {
        id: this.currentTreeNode.id,
        remarks: this.currentTreeNode.info.nickname
      }
      this.groups = []
      chatApi.getGroups().then(response => {
        response.data.forEach(group => {
          this.groups.push({
            label: group.groupName,
            value: group.groupId
          })
        })
        this.acceptForm['groupId'] = this.groups[0].value
      })
    }
  }
}
</script>
