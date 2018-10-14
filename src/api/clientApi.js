import axios from 'axios'
import {
  DELETE_AUTH_CLIENT_CANCEL,
  PUT_AUTH_CLIENT_RENEW,
  POST_AUTH_CLIENT_REGISTER
} from './endpoint'

/**
 * client api.
 */
const ClientApi = {
  /**
   * client register.
   */
  clientRegister() {
    return axios.post(POST_AUTH_CLIENT_REGISTER)
  },
  /**
   * client renew.
   */
  clientRenew() {
    return axios.put(PUT_AUTH_CLIENT_RENEW)
  },
  /**
   * client cancel.
   */
  clientCancel() {
    return axios.delete(DELETE_AUTH_CLIENT_CANCEL)
  }
}

export default ClientApi
