const state = {
  currentMenu: 2,
  currentTreeNode: {},
  sessions: [],
  currentSessionId: 0,
  filterKey: '',
  refreshType: '',
  myNewMessage: {},
  groupFriends: []
}

const getters = {
  sessions: state => state.sessions,
  currentSessionId: state => state.currentSessionId,
  filterKey: state => state.filterKey,
  currentMenu: state => state.currentMenu,
  currentFriend: state => state.currentFriend,
  refreshType: state => state.refreshType,
  myNewMessage: state => state.myNewMessage,
  groupFriends: state => state.groupFriends
}

const mutations = {
  INIT_DATA({
    sessions
  }, userNumber) {
    let data = localStorage.getItem('chat-session-' + userNumber)
    if (data) {
      console.log(JSON.parse(data))
      state.sessions = JSON.parse(data)
    }
  },
  // 发送消息
  SEND_MESSAGE({
    sessions,
    currentSessionId
  }, message) {
    let session = sessions.find(item => item.roomId === currentSessionId)
    session.messages.push(message)
    state.myNewMessage = message
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
    }
    if (message.self) {
      var oldMessage = session.messages.find(msg => msg.msgId === message.msgId)
      if (oldMessage) {
        oldMessage.status = message.status
        return
      }
    }
    session.messages.push(message)
  },
  // 选择会话
  SELECT_SESSION(state, id) {
    state.currentSessionId = id
  },
  // 新增会话
  ADD_SESSION(state, session) {
    state.sessions.unshift(session)
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
  receiveMessage({
    commit
  }, message) {
    commit('RECEIVE_MESSAGE', message)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
