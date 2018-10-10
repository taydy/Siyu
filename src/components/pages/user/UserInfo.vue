<template>
  <div class="user-info" id="user-info">
    <el-row>
      <el-col :span="10">
        <el-form :model="userInfo" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="头像" prop="avatar">
            <el-col :span="10">
              <img :src="imageUrl" @click="toggleShow" style="width:100%;">
            </el-col>
          </el-form-item>
          <el-form-item label="用户名" prop="title">
            <el-input v-model="userInfo.username" :disabled="!commonUtil.isEmpty(userInfo.username)"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userInfo.email" :disabled="!commonUtil.isEmpty(userInfo.email)"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname" :disabled="userInfo.nickname">
            <el-input v-model="userInfo.nickname"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="userInfo.mobile"></el-input>
          </el-form-item>
          <el-form-item label="公司" prop="company">
            <el-input v-model="userInfo.company"></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="position">
            <el-input v-model="userInfo.position"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="userInfo.sex">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出生年月" prop="birthday">
            <el-date-picker v-model="userInfo.birthday" value-format="timestamp" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="签名" prop="motto">
            <el-input type="textarea" v-model="userInfo.motto" :rows="4"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <my-upload field="file" :withCredentials="true" @crop-success="cropSuccess" @crop-upload-success="cropUploadSuccess" @crop-upload-fail="cropUploadFail" :width="300" :height="300" :url="uploadUrl" :params="params" :headers="headers" v-model="show" img-format="png"></my-upload>
    </el-row>
  </div>
</template>

<script>
import { userApi } from '@/api/api'
import myUpload from 'vue-image-crop-upload'
import 'babel-polyfill'
import { DEFAULT_WEB_ROOT } from '@/assets/js/const'
import { mapActions } from 'vuex'
export default {
  components: {
    'my-upload': myUpload
  },
  data() {
    return {
      userInfo: {
        id: '',
        pid: '',
        username: '',
        nickname: '',
        email: '',
        mobile: '',
        company: '',
        position: '',
        sex: '',
        birthday: '',
        avatar: '',
        motto: ''
      },
      oldUserInfo: {},
      rules: {},
      show: false,
      params: {},
      headers: {
        'X-Authorization': `Bearer ${localStorage.token}`
      },
      uploadUrl: process.env.API_ROOT_PATH + '/api/auth/users/picture'
    }
  },
  mounted: function() {
    this.getUserInfo()
  },
  computed: {
    imageUrl() {
      return DEFAULT_WEB_ROOT + this.userInfo.avatar
    }
  },
  methods: {
    ...mapActions('auth', ['setAvatar', 'setNickname', 'setMotto']),
    getUserInfo() {
      const loading = this.yoyaLoading({
        lock: true,
        background: 'white',
        target: document.getElementById('user-info')
      })
      userApi
        .getUserInfo()
        .then(response => {
          this.userInfo = response.data
          this.oldUserInfo = this.commonUtil.clone(this.userInfo)
        })
        .finally(() => {
          if (loading) {
            loading.close()
          }
        })
    },
    updateAvatar(user) {
      this.amplitude.getInstance().logEvent('Updated User Avatar')
      userApi
        .updateUserInfo(user, localStorage.userId)
        .then(response => {
          this.$notify({
            title: '用户信息更新',
            message: '头像更新成功!',
            type: 'success'
          })
          this.oldUserInfo = this.commonUtil.clone(this.userInfo)
          this.setAvatar(user.avatar)
        })
        .catch(error => {
          this.$notify.error({
            title: '用户信息更新',
            message: error.message || '头像更新失败!'
          })
        })
    },
    updateUserInfo() {
      const loading = this.yoyaLoading({
        lock: true,
        background: 'white',
        target: document.getElementById('user-info')
      })
      this.amplitude.getInstance().logEvent('Updated User info')
      userApi
        .updateUserInfo(this.userInfo, localStorage.userId)
        .then(response => {
          this.$notify({
            title: '用户信息更新',
            message: '操作成功!',
            type: 'success'
          })
          this.oldUserInfo = this.commonUtil.clone(this.userInfo)
          this.setNickname(this.userInfo.nickname)
          this.setMotto(this.userInfo.motto)
          if (loading) {
            loading.close()
          }
        })
        .catch(error => {
          this.$notify.error({
            title: '用户信息更新',
            message: error.message || '操作失败!'
          })
          if (loading) {
            loading.close()
          }
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.underscore.isEqual(this.oldUserInfo, this.userInfo)) {
            this.$message({
              message: '请修改后再进行操作',
              type: 'warning'
            })
            return false
          }
          this.updateUserInfo()
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getUserInfo()
    },
    toggleShow() {
      this.show = !this.show
    },
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------')
    },
    cropUploadSuccess(jsonData, field) {
      this.userInfo.avatar = jsonData.message
      var user = {
        id: this.userInfo.id,
        pid: this.userInfo.pid,
        avatar: this.userInfo.avatar
      }
      this.updateAvatar(user)
      this.show = false
    },
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    }
  }
}
</script>
