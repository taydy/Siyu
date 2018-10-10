const now = new Date()
const state = {
  currentMenu: 1,
  currentTreeNode: {},
  sessions: [
    {
      id: 1,
      name: '示例介绍',
      img: '/static/img/chat/2.png',
      messages: [{
        id: '1',
        content: 'Hello，这是一个基于Vue + Vuex + Webpack构建的简单chat示例，聊天记录保存在localStorge, 有什么问题可以通过Github Issue问我。',
        date: now
      }, {
        id: '2',
        content: '项目地址: https://github.com/coffcer/vue-chat',
        date: now
      }]
    },
    {
      id: 2,
      name: 'webpack',
      img: '/static/img/chat/3.jpg',
      messages: []
    }
  ],
  currentSessionId: 1,
  filterKey: ''
}

const getters = {
  sessions: state => state.sessions,
  currentSessionId: state => state.currentSessionId,
  filterKey: state => state.filterKey,
  currentMenu: state => state.currentMenu,
  currentFriend: state => state.currentFriend
}

const mutations = {
  INIT_DATA(state) {
    let data = localStorage.getItem('chat-session')
    if (data) {
      state.sessions = JSON.parse(data)
    }
  },
  // 发送消息
  SEND_MESSAGE({
    sessions,
    currentSessionId
  }, message) {
    let session = sessions.find(item => item.id === currentSessionId)
    session.messages.push(message)
  },
  UPDATE_MESSAGE_STATUS({
    sessions,
    currentSessionId
  }, tempId, status) {
    let session = sessions.find(item => item.id === currentSessionId)
    let message = session.messages.find(msg => msg.tempId === tempId)
    message.status = status
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
  }
}

const actions = {
  initData({
    commit
  }) {
    commit('INIT_DATA')
  },
  sendMessage({
    commit
  }, message) {
    commit('SEND_MESSAGE', message)
  },
  updateMessageStatus({
    commit
  }, tempId, status) {
    commit('UPDATE_MESSAGE_STATUS', tempId, status)
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
