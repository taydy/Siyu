<template>
  <div class="chat-list">
    <div class="friend-list">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item name="0">
          <template slot="title">
            好友申请 <el-tag class="custom-badge" v-show="friendRequests.length > 0">{{ friendRequests.length }}</el-tag>
          </template>
          <el-tree :data="friendRequests" node-key="id" @node-click="nodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-collapse-item>
        <el-collapse-item title="我的群聊" name="1">
          <ul>
            <li v-for="item in rooms" :key="item.roomId">
              <p class="chat-name">{{item.roomName}}</p>
            </li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="我的好友" name="2">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small" style="margin-bottom:10px;">
          </el-input>
          <el-tree :filter-node-method="filterNode" ref="friendTree" :data="friends" node-key="id" draggable :allow-drop="allowDrop" :allow-drag="allowDrag" @node-click="nodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span :class="node.level !== 1 && node.data.status === '1' ? 'online' : ''">{{ node.label }}</span>
              <span v-show="node.level !== 1" :class="node.level !== 1 && node.data.status === '1' ? 'online-badge status-badge' : 'status-badge'">[{{ node.data.status === '1' ? '在线' : '离线' }}]</span>
              <span class="custom-tree-node-number" v-if="node.level === 1">{{ node.data.online }}/{{ node.data.total }}</span>
            </span>
          </el-tree>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Common from '@/assets/js/common'
export default {
  data() {
    return {
      activeName: '2',
      friendRequests: [
        {
          id: 1,
          label: '部落格上的问候',
          type: 'friend_request'
        }
      ],
      rooms: [],
      friends: [
        {
          id: 1,
          label: '发小',
          total: 0,
          type: 'friend',
          children: [
            {
              id: 9,
              label: 'Rudi',
              status: '1',
              info: {
                img: '/static/img/chat/1.jpg'
              },
              type: 'friend'
            },
            {
              id: 10,
              label: 'Hamilton',
              status: '1',
              info: {
                img: '/static/img/chat/1.jpg'
              },
              type: 'friend'
            }
          ]
        },
        {
          id: 2,
          label: '同事',
          total: 0,
          type: 'friend',
          children: [
            {
              id: 5,
              label: 'Auston',
              status: '0',
              info: {
                img: '/static/img/chat/1.jpg',
                motto:
                  'Knowledge is a treasure, but practice is the key to get it.'
              },
              type: 'friend'
            },
            {
              id: 6,
              label: 'Marcia',
              status: '1',
              info: {
                img: '/static/img/chat/1.jpg'
              },
              type: 'friend'
            }
          ]
        },
        {
          id: 3,
          label: '同学',
          total: 0,
          type: 'friend',
          children: [
            {
              id: 7,
              label: 'Echo',
              status: '1',
              info: {
                img: '/static/img/chat/1.jpg'
              },
              type: 'friend'
            },
            {
              id: 8,
              label: 'Simona',
              status: '1',
              info: {
                img: '/static/img/chat/1.jpg'
              },
              type: 'friend'
            },
            {
              id: 11,
              label: 'Sion',
              status: '0',
              info: {
                img: '/static/img/chat/1.jpg'
              },
              type: 'friend'
            },
            {
              id: 12,
              label: 'Mimi',
              status: '0',
              info: {
                img: '/static/img/chat/1.jpg'
              },
              type: 'friend'
            },
            {
              id: 13,
              label: 'Manny',
              status: '1',
              info: {
                img: '/static/img/chat/1.jpg'
              },
              type: 'friend'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: ''
    }
  },
  computed: {
    ...mapState({
      sessions: state => {
        return state.chat.sessions.filter(session =>
          session.user.name.includes(state.chat.filterKey)
        )
      },
      currentSessionId: state => state.chat.currentSessionId,
      currentTreeNode: state => state.chat.currentTreeNode
    })
  },
  mounted: function() {
    this.sortFriendsData()
  },
  watch: {
    filterText(val) {
      this.$refs.friendTree.filter(val)
    }
  },
  methods: {
    ...mapActions('chat', ['selectSession', 'search', 'selectTreeNode']),
    onKeyup(e) {
      this.search(e.target.value)
    },
    sortFriendsData() {
      var compare = function(obj1, obj2) {
        if (obj1.status < obj2.status) {
          return 1
        } else if (obj1.status > obj2.status) {
          return -1
        } else {
          if (obj1.label < obj2.label) {
            return -1
          } else if (obj1.label > obj2.label) {
            return 1
          } else {
            return 0
          }
        }
      }
      var temp = Common.clone(this.friends)
      for (var item of temp) {
        if (!item.children) {
          item.children = []
        }
        item.total = item.children.length
        item.online = 0
        item.children = item.children.sort(compare)
        for (var child of item.children) {
          if (child.status === '1') {
            item.online++
          }
        }
      }
      this.friends = temp
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    allowDrop(draggingNode, dropNode, type) {
      console.log(draggingNode)
      console.log(dropNode)
      console.log(type)
      if (dropNode.level !== 1) {
        return false
      }
      if ((type === 'next' || type === 'prev') && dropNode.level === 1) {
        return false
      }
      return true
    },
    allowDrag(draggingNode) {
      return (
        !draggingNode.data.children || draggingNode.data.children.length === 0
      )
    },
    nodeClick(data, node) {
      console.log(node)
      if (data.type === 'friend' && node.level === 1) {
        return
      }
      this.selectTreeNode(data)
    }
  }
}
</script>
