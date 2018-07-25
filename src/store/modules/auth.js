// initial state
const state = {
  username: '',
  userId: '',
  avatar: '',
  nickname: '',
  motto: '',
  needLogin: false
}

// getters
const getters = {
  username: state => state.token,
  avatar: state => state.avatar,
  userId: state => state.userId,
  nickname: state => state.nickname,
  motto: state => state.motto,
  needLogin: state => state.needLogin
}

// mutations
const mutations = {
  username(state, username) {
    state.username = username
  },
  avatar(state, avatar) {
    state.avatar = avatar
  },
  userId(state, userId) {
    state.userId = userId
  },
  nickname(state, nickname) {
    state.nickname = nickname
  },
  motto(state, motto) {
    state.motto = motto
  },
  needLogin(state, needLogin) {
    state.needLogin = needLogin
  }
}

// actions
const actions = {
  setUsername({
    commit
  }, username) {
    commit('username', username)
  },
  setAvatar({
    commit
  }, avatar) {
    commit('avatar', avatar)
  },
  setUserId({
    commit
  }, userId) {
    commit('userId', userId)
  },
  setNickname({
    commit
  }, nickname) {
    commit('nickname', nickname)
  },
  setMotto({
    commit
  }, motto) {
    commit('motto', motto)
  },
  setNeedLogin({
    commit
  }, needLogin) {
    commit('needLogin', needLogin)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
