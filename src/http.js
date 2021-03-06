import axios from 'axios'
import store from './store/index'
// import router from './router'

// axios 全局配置
axios.defaults.timeout = 5000
axios.defaults.baseURL = process.env.API_ROOT_PATH
axios.defaults.headers.post['Content-Type'] = 'application/json'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.token) {
      config.headers['Authorization'] = `Bearer ${localStorage.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
      case 401:
        // TODO: 401 清除 token 信息并跳转登录页面
        localStorage.clear()
        store.dispatch('auth/setNeedLogin', true)
        // let url = localStorage.url ? localStorage.url : '/login'
        // router.push({
        //   path: url,
        //   query: {
        //     redirect: router.currentRoute.fullPath
        //   }
        // })
        break
      default:
        // TODO: handle other errors
      }
      // console.log(JSON.stringify(error))
      return Promise.reject(error.response.data)
    }
  }
)

export default axios
