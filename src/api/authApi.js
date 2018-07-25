import axios from 'axios'
import {
  LOGIN_ENDPOINT,
  REGISTER_ENDPOINT
} from './endpoint'

/**
 * 用户认证 api.
 */
const AuthApi = {
  /**
   * login.
   */
  login(username, password) {
    return axios.post(LOGIN_ENDPOINT, {
      username: username,
      password: password
    })
  },

  /**
   * register.
   */
  register(username, password) {
    return axios.post(REGISTER_ENDPOINT, JSON.stringify({
      username: username,
      password: password
    }))
  }
}

export default AuthApi
