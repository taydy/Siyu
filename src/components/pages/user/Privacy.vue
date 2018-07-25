<template>
    <div class="user-privacy">
        <el-row>
            <el-col :span="10">
                <el-form :model="privacy" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="原始密码" prop="oldPassword" auto-complete="off">
                        <el-input type="password" v-model="privacy.oldPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="password" auto-complete="off">
                        <el-input type="password" v-model="privacy.password"></el-input>
                    </el-form-item>
                    <el-form-item label="密码确认" prop="passwordRepeat" auto-complete="off">
                        <el-input type="password" v-model="privacy.passwordRepeat"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { userApi } from '@/api/api'
export default {
  data() {
    var validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.privacy.passwordRepeat !== '') {
          this.$refs.ruleForm.validateField('passwordRepeat')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.privacy.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      privacy: {
        oldPassword: '',
        password: '',
        passwordRepeat: ''
      },
      rules: {
        oldPassword: [{ validator: validateOldPass, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        passwordRepeat: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updatePaasword()
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.privacy = {}
    },
    updatePaasword() {
      userApi
        .updatePassword(
          {
            oldPassword: this.privacy.oldPassword,
            password: this.privacy.password
          },
          localStorage.userId
        )
        .then(response => {
          if (response.data.code === 200) {
            this.$notify({
              title: '用户密码更新',
              message: '操作成功!',
              type: 'success'
            })
            this.resetForm('ruleForm')
          } else {
            this.$notify({
              title: '用户密码更新',
              message: '操作失败!',
              type: 'error'
            })
          }
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            title: '用户密码更新',
            message: error.message,
            type: 'error'
          })
        })
    }
  }
}
</script>
