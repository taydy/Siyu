import axios from 'axios'
import commonUtil from '@/assets/js/common'
import {
  GET_AUTH_GROUP_FRIENDS,
  PUT_AUTH_FRIEND,
  DELETE_AUTH_FRIEND,
  GET_AUTH_GROUPS,
  POST_AUTH_GROUP,
  PUT_AUTH_GROUP,
  POST_AUTH_FRIEND_REQUEST,
  GET_AUTH_FRIEND_REQUEST_MY,
  GET_AUTH_FRIEND_REQUEST_OTHER,
  PUT_AUTH_ACCEPT_FRIEND_REQUEST,
  PUT_AUTH_REJECT_FRIEND_REQUEST,
  GET_AUTH_ROOM_USERS,
  GET_AUTH_ROOM,
  GET_AUTH_ROOM_CHAT,
  GET_AUTH_ROOM_BY_ID,
  PUT_AUTH_ROOM,
  GET_MESSAGE
} from './endpoint'

/**
 * chat api.
 */
const ChatApi = {
  /**
   * get group friends.
   */
  getGroupFriends() {
    return axios.get(GET_AUTH_GROUP_FRIENDS)
  },
  /**
   * get groups.
   */
  getGroups() {
    return axios.get(GET_AUTH_GROUPS)
  },
  /**
   * add group.
   */
  addGroup(option) {
    return axios.post(POST_AUTH_GROUP, option)
  },
  /**
   * update group.
   */
  updateGroup(option) {
    return axios.put(commonUtil.expandUrl(PUT_AUTH_GROUP, option), option)
  },
  /**
   * delete group.
   */
  deleteGroup(option) {
    return axios.delete(commonUtil.expandUrl(PUT_AUTH_GROUP, option))
  },
  /**
   * update friend.
   */
  updateFriend(option) {
    return axios.put(commonUtil.expandUrl(PUT_AUTH_FRIEND, option), option)
  },
  /**
   * delete friend.
   */
  deleteFriend(option) {
    return axios.delete(commonUtil.expandUrl(DELETE_AUTH_FRIEND, option))
  },
  /**
   * add friend request.
   */
  addFriendRequest(option) {
    return axios.post(POST_AUTH_FRIEND_REQUEST, option)
  },
  /**
   * get friend reuqest.
   */
  getMyFriendRequest() {
    return axios.get(GET_AUTH_FRIEND_REQUEST_MY)
  },
  getOtherFriendRequest() {
    return axios.get(GET_AUTH_FRIEND_REQUEST_OTHER)
  },
  /**
   * ACCEPT FRIEND REQUEST.
   */
  acceptFriendRequest(option) {
    return axios.put(commonUtil.expandUrl(PUT_AUTH_ACCEPT_FRIEND_REQUEST, option), option)
  },
  /**
   * reject friend request.
   */
  rejectFriendRequest(option) {
    return axios.put(commonUtil.expandUrl(PUT_AUTH_REJECT_FRIEND_REQUEST, option))
  },
  /**
   * room users.
   */
  getRoomUsers(roomId) {
    return axios.get(commonUtil.expandUrl(GET_AUTH_ROOM_USERS, {
      room_id: roomId
    }))
  },
  /**
   * add room users.
   */
  addRoomUsers(option) {
    return axios.post(commonUtil.expandUrl(GET_AUTH_ROOM_USERS, option), option)
  },
  /**
   * get room.
   */
  getRoom(roomId) {
    return axios.get(commonUtil.expandUrl(GET_AUTH_ROOM_BY_ID, {
      room_id: roomId
    }))
  },
  /**
   * update room.
   */
  updateRoom(option) {
    return axios.put(commonUtil.expandUrl(PUT_AUTH_ROOM, option), option)
  },
  /**
   * get room chats.
   */
  getRoomChats() {
    return axios.get(GET_AUTH_ROOM_CHAT)
  },
  /**
   * get rooms.
   */
  getRooms() {
    return axios.get(GET_AUTH_ROOM)
  },
  /**
   * LIST MESSAGES.
   */
  listMessage(roomId, lastTime) {
    return axios.get(commonUtil.expandUrl(GET_MESSAGE, {
      room_id: roomId,
      last_time: lastTime
    }))
  }
}

export default ChatApi
