import axios from 'axios'
import commonUtil from '@/assets/js/common'
import {
  GET_USERINFO,
  PUT_USERINFO,
  UPDATE_PASSWORD_USERINFO
} from './endpoint'

/**
 * user api.
 */
const UserApi = {
  /**
   * get user info.
   */
  getUserInfo() {
    return axios.get(GET_USERINFO)
  },

  /**
   * update user info.
   */
  updateUserInfo(user, id) {
    return axios.put(commonUtil.expandUrl(PUT_USERINFO, {
      id: id
    }), user)
  },
  /**
   * update password.
   */
  updatePassword(obj, id) {
    return axios.put(commonUtil.expandUrl(UPDATE_PASSWORD_USERINFO, {
      id: id
    }), obj)
  }
}

export default UserApi
