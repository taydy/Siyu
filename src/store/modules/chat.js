const state = {
  currentMenu: 2,
  currentTreeNode: {},
  sessions: [],
  currentSessionId: 0,
  filterKey: '',
  refreshType: '',
  myNewMessage: {},
  groupFriends: [],
  userAvatar: {},
  currentRoom: {},
  playSound: false
}

const getters = {
  sessions: state => state.sessions,
  currentSessionId: state => state.currentSessionId,
  filterKey: state => state.filterKey,
  currentMenu: state => state.currentMenu,
  currentFriend: state => state.currentFriend,
  refreshType: state => state.refreshType,
  myNewMessage: state => state.myNewMessage,
  groupFriends: state => state.groupFriends,
  userAvatar: state => state.userAvatar,
  currentRoom: state => state.currentRoom,
  playSound: state => state.playSound
}

const mutations = {
  INIT_DATA({
    sessions
  }, userNumber) {
    let data = localStorage.getItem('chat-session-' + userNumber)
    if (data) {
      state.sessions = JSON.parse(data)
    }
  },
  // 发送消息
  SEND_MESSAGE({
    sessions,
    currentSessionId
  }, message) {
    let session = sessions.find(item => item.roomId === currentSessionId)
    state.playSound = true
    session.messages.push(message)
    state.myNewMessage = message
  },
  LOAD_MESSAGE({
    sessions
  }, message) {
    let session = sessions.find(item => item.roomId === message.roomId)
    session.messages.unshift(message)
  },
  RECEIVE_MESSAGE({
    sessions
  }, message) {
    let session = sessions.find(item => item.roomId === message.roomId)
    if (!session) {
      for (var group of state.groupFriends) {
        for (var user of group.children) {
          if (user.info.userNumber === message.sendFrom) {
            session = {
              roomId: message.roomId,
              name: user.info.nickname,
              image: user.info.avatar,
              messages: []
            }
            break
          }
        }
      }
      state.sessions.unshift(session)
      state.currentSessionId = message.roomId
    }
    if (message.self) {
      if (state.currentSessionId === message.roomId) {
        session.unRead = ''
      }
      var oldMessage = session.messages.find(msg => msg.msgId === message.msgId)
      if (oldMessage) {
        oldMessage.status = message.status
        oldMessage.content = message.content
        return
      }
    } else {
      session.unRead = session.unRead ? session.unRead + 1 : 1
      state.playSound = true
    }
    session.messages.push(message)
  },
  // 选择会话
  SELECT_SESSION(state, id) {
    state.currentSessionId = id
    let session = state.sessions.find(item => item.roomId === id)
    session.unRead = ''
  },
  // 新增会话
  ADD_SESSION(state, session) {
    let temp = state.sessions.find(item => item.roomId === session.roomId)
    if (!temp) {
      state.sessions.unshift(session)
    } else {
      temp.unRead = session.unRead
    }
  },
  // 搜索
  SET_FILTER_KEY(state, value) {
    state.filterKey = value
  },
  // 切换 menu
  SELECT_MENU(state, id) {
    state.currentMenu = id
  },
  SELECT_TREE_NODE(state, node) {
    state.currentTreeNode = node
  },
  SET_REFRESH_TYPE(state, type) {
    state.refreshType = type
  },
  SET_GROUP_FRIENDS(state, groupFriends) {
    state.groupFriends = groupFriends
    groupFriends.forEach(group => {
      group.children.forEach(user => {
        state.userAvatar[user.id] = user.info.avatar
      })
    })
  },
  UPDATE_ROOM_INFO({sessions}, room) {
    state.currentRoom = room
    console.log(state.currentRoom)
    let session = sessions.find(item => item.roomId === room.roomId)
    if (room.roomName) {
      session.name = room.roomName
    }
    if (room.image) {
      session.image = room.image
    }
    session.total = room.total
  },
  ADD_USER_AVATAR({
    userAvatar
  }, data) {
    userAvatar[data.userNumber] = data.avatar
  },
  UPDATE_PLAY_SOUND({
    playSound
  }, flag) {
    state.playSound = flag
  }
}

const actions = {
  initData({
    commit
  }, userNumber) {
    commit('INIT_DATA', userNumber)
  },
  sendMessage({
    commit
  }, message) {
    commit('SEND_MESSAGE', message)
  },
  selectSession({
    commit
  }, id) {
    commit('SELECT_SESSION', id)
  },
  addSession({
    commit
  }, session) {
    commit('ADD_SESSION', session)
  },
  search({
    commit
  }, value) {
    commit('SET_FILTER_KEY', value)
  },
  selectMenu({
    commit
  }, id) {
    commit('SELECT_MENU', id)
  },
  selectTreeNode({
    commit
  }, node) {
    commit('SELECT_TREE_NODE', node)
  },
  setRefreshType({
    commit
  }, type) {
    commit('SET_REFRESH_TYPE', type)
  },
  setGroupFriends({
    commit
  }, groupFriends) {
    commit('SET_GROUP_FRIENDS', groupFriends)
  },
  loadMessage({
    commit
  }, message) {
    commit('LOAD_MESSAGE', message)
  },
  receiveMessage({
    commit
  }, message) {
    commit('RECEIVE_MESSAGE', message)
  },
  updateRoomInfo({
    commit
  }, room) {
    commit('UPDATE_ROOM_INFO', room)
  },
  addUserAvatar({
    commit
  }, data) {
    commit('ADD_USER_AVATAR', data)
  },
  updatePlaySound({
    commit
  }, flag) {
    commit('UPDATE_PLAY_SOUND', flag)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
