<template>
  <div id="header">
    <header>
      <el-row>
        <el-col :span="20" :offset="2">
          <div class="header">
            <div class="inner">
              <div id="logo-wrap">
                <router-link to="/">
                  <span>Yoya Doc</span></router-link>
              </div>
              <nav id="main-nav">
                <router-link v-for="(item, index) in navItems" :key="index" :to="item.url" class="main-nav-link">{{item.name}}</router-link>
                <a v-show="isLogin" class="login" @click="popUpDialog">Login</a>
                <div v-show="!isLogin" class="user-menu">
                  <router-link to="/users" class="nav-user-title" href="#">
                    <img :src="userAvatar">
                    <span class="login-nickname">{{nickname}}</span>
                    <i></i>
                  </router-link>
                  <div class="nav-expand-list">
                    <i class="arrow"></i>
                    <div class="user-card">
                      <a class="btn-exit" @click="logout" href="#">
                        <i class="nav-exit-icon"></i>
                        <span>Logout</span>
                      </a>
                      <div class="u-info">
                        <a class="avatar"><img :src="userAvatar"></a>
                        <p class="nickname">
                          <span>{{nickname}}</span>
                        </p>
                      </div>
                      <div class="motto">
                        <span>{{motto || '此人很懒，什么都没有留下...'}} </span>
                      </div>
                      <div class="menu">
                        <router-link to="/my/blogs" class=""><i class="fa fa-book"></i>我的博客</router-link>
                        <router-link to="/users" class=""><i class="fa fa-sun-o"></i>后台管理</router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </el-col>
      </el-row>
    </header>
    <el-dialog :title='"Yoya Doc · " + action' :visible.sync="loginDialogVisible" width="30%" center id="loginDialog">
      <div style="text-align:center" v-show="action == 'Login In'">
        <div class="title">
          <img style="width:50%" src="/static/img/login.png">
        </div>
        <div class="error-msg" v-show="errorMsg !== ''">
          <span>{{errorMsg}}</span>
        </div>
      </div>
      <div style="text-align:center" id="login-input" v-show="action == 'Login In'">
        <div style="margin-bottom:30px" @keyup.enter="login">
          <effect-input v-model="email" type="hoshi" label="Email"></effect-input>
          <effect-input v-model="password" type="hoshi" label="Password" class="password"></effect-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button style="width:80%" type="primary" @click="login">Login In</el-button>
          <div style="margin-left:10%;margin-top:10px;text-align:left">
            <a style="font-size:12px;cursor: pointer" @click="switchDialog">
              No account, click to Sign Up</a>
          </div>
        </span>
      </div>

      <div style="text-align:center" v-show="action == 'Sign Up'">
        <div class="title">
          <img style="width:50%" src="/static/img/cash_register.png">
        </div>
        <div class="error-msg" v-show="errorMsg !== ''">
          <span>{{errorMsg}}</span>
        </div>

      </div>
      <div style="text-align:center" id="signup-input" v-show="action == 'Sign Up'">
        <div style="margin-bottom:30px" @keyup.enter="signUp">
          <effect-input v-model="email" type="hoshi" label="Email"></effect-input>
          <effect-input v-model="password" type="hoshi" label="Password" class="password"></effect-input>
          <effect-input v-model="passwordRepeat" type="hoshi" label="Password Repeat" class="password"></effect-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button style="width:80%" type="primary" @click="signUp">Sign Up</el-button>
          <div style="margin-left:10%;margin-top:10px;text-align:left">
            <a style="font-size:12px;cursor: pointer" @click="switchDialog">
              Have an account? Click to Login</a>
          </div>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { authApi, userApi } from '@/api/api'
import { mapActions, mapState } from 'vuex'
import { DEFAULT_WEB_ROOT } from '@/assets/js/const'
export default {
  name: 'Header',
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      email: '',
      password: '',
      passwordRepeat: '',
      loginDialogVisible: false,
      action: 'Login In',
      errorMsg: ''
    }
  },
  computed: {
    ...mapState({
      avatar: state => state.auth.avatar,
      username: state => state.auth.username,
      userId: state => state.auth.userId,
      nickname: status => status.auth.nickname,
      motto: status => status.auth.motto,
      needLogin: status => status.auth.needLogin
    }),
    userAvatar() {
      return this.commonUtil.isEmpty(this.avatar)
        ? '/static/img/avatar.jpg'
        : DEFAULT_WEB_ROOT + this.avatar
    },
    isLogin() {
      return this.commonUtil.isEmpty(this.userId)
    }
  },
  watch: {
    needLogin: function(newValue, oldValue) {
      console.log(newValue)
      if (newValue && !this.loginDialogVisible) {
        this.clearInput()
        this.loginDialogVisible = true
      }
    }
  },
  methods: {
    ...mapActions('auth', [
      'setUsername',
      'setAvatar',
      'setUserId',
      'setNickname',
      'setMotto',
      'setNeedLogin'
    ]),
    switchDialog() {
      this.action = this.action === 'Login In' ? 'Sign Up' : 'Login In'
      this.clearInput()
    },
    popUpDialog() {
      this.action = 'Login In'
      this.loginDialogVisible = true
      this.clearInput()
      setTimeout(function() {
        Array.from(document.getElementsByClassName('password')).forEach(
          element => {
            element.childNodes.forEach(node => {
              if (node.nodeName === 'INPUT') {
                node.type = 'password'
              }
            })
          }
        )
      }, 10)
    },
    clearInput() {
      this.email = ''
      this.password = ''
      this.passwordRepeat = ''
      this.errorMsg = ''
    },
    showDialogErrorMsg(errorMsg) {
      this.errorMsg = errorMsg
      document.getElementById('loginDialog').classList.add('animated', 'shake')
      setTimeout(function() {
        document
          .getElementById('loginDialog')
          .classList.remove('animated', 'shake')
      }, 1500)
    },
    getUserInfo() {
      userApi.getUserInfo().then(response => {
        let data = response.data
        localStorage.userId = data.id
        this.setUsername(data.username)
        this.setAvatar(data.avatar)
        this.setUserId(data.id)
        this.setNickname(data.nickname)
        this.setMotto(data.motto)
        this.setNeedLogin(false)
      })
    },
    login() {
      this.errorMsg = ''
      if (this.email === '' || this.password === '') {
        this.showDialogErrorMsg('You must input email and password!')
        return
      }
      if (!this.commonUtil.isEmail(this.email)) {
        this.showDialogErrorMsg('Email format is incorrect!')
        return
      }
      const loading = this.yoyaLoading({
        lock: true,
        background: 'white',
        target: document.getElementById('login-input'),
        size: 60
      })
      // login
      authApi
        .login(this.email, this.password)
        .then(response => {
          if (this.commonUtil.isEmpty(response)) {
            loading.close()
            this.showDialogErrorMsg('Unable to provide login request for now!')
          } else {
            localStorage.token = response.data['token']
            localStorage.refreshToken = response.data['refresh_token']
            localStorage.clentId = response.data['client_id']
            loading.close()
            this.loginDialogVisible = false
            this.getUserInfo()
          }
        })
        .catch(error => {
          loading.close()

          this.showDialogErrorMsg(error.message)
        })
    },
    signUp() {
      this.errorMsg = ''
      if (this.email === '' || this.password === '') {
        this.showDialogErrorMsg(' You must input email and password!')
        return
      }
      if (!this.commonUtil.isEmail(this.email)) {
        this.showDialogErrorMsg('Email format is incorrect!')
        return
      }
      if (this.password !== this.passwordRepeat) {
        this.showDialogErrorMsg(
          'The password you entered twice is inconsistent!'
        )
        return
      }
      const loading = this.yoyaLoading({
        lock: true,
        background: 'white',
        target: document.getElementById('signup-input'),
        size: 60
      })
      // login
      authApi
        .register(this.email, this.password)
        .then(response => {
          loading.close()
          this.login()
        })
        .catch(error => {
          loading.close()
          this.showDialogErrorMsg(error.message)
        })
    },
    logout() {
      localStorage.clear()
      this.$router.go({ name: 'Home' })
    }
  }
}
</script>
