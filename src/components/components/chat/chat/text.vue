<template>
  <div class="chat-input-text">
    <!-- <textarea placeholder="按 Enter 发送" v-model="content" @keyup="onKeyup"></textarea> -->
    <div id="editor" @keyup="onKeyup">
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import E from 'wangeditor'
export default {
  data() {
    return {
      content: '',
      editor: ''
    }
  },
  computed: {
    ...mapState({
      currentSessionId: state => state.chat.currentSessionId,
      userNumber: state => state.auth.userNumber
    })
  },
  mounted: function() {
    this.initEditor()
  },
  methods: {
    ...mapActions('chat', ['sendMessage']),
    onKeyup(e) {
      // e.ctrlKey &&
      if (!e.ctrlKey && e.keyCode === 13 && this.content.length) {
        let json = this.editor.txt.getJSON()
        const messages = this.handlerMessage(json)
        var index = 0
        messages.forEach(message => {
          let msg = {
            msgId: this.commonUtil.uuid32(),
            sendFrom: this.userNumber,
            content: JSON.stringify(message.msg),
            roomId: this.currentSessionId,
            msgType: message.type,
            createdTime: Date.parse(new Date()),
            status: 0
          }
          console.log(msg)
          if (
            message.type === 'image' &&
            message.msg.children[0].attrs[0].value.indexOf('http') !== 0
          ) {
            let content = ''
            message.msg.children[0].attrs.forEach(attr => {
              if (attr.name === 'src') {
                content = attr.value
              }
            })
            let imgType = content.substr(11, content.indexOf(';') - 11)
            const key = `upload/images/message/${Date.parse(new Date())}_${
              this.userNumber
            }.${imgType}`
            msg.realUrl = key
          }
          setTimeout(() => {
            this.sendMessage(msg)
          }, 10 * index++)
        })
        this.editor.txt.clear()
      }
    },
    handlerMessage(json) {
      const message = this.commonUtil.clone(json)
      var msgs = []
      var msg = {
        attrs: [],
        tag: 'p',
        children: []
      }
      message.forEach(p => {
        p.children.forEach(child => {
          if (
            child.tag === 'img' &&
            child.attrs[0].value.indexOf('http') !== 0
          ) {
            this.removeBr(msg.children)
            if (msg.children.length !== 0) {
              msgs.push({
                type: 'text',
                msg: this.commonUtil.clone(msg)
              })
            }
            msgs.push({
              type: 'image',
              msg: {
                attrs: p.attrs,
                tag: p.tag,
                children: [child]
              }
            })
            msg.children = []
          } else {
            msg.children.push(child)
          }
        })
      })
      this.removeBr(msg.children)
      if (msg.children.length !== 0) {
        msgs.push({
          type: 'text',
          msg: msg
        })
      }
      console.log(msgs)
      return msgs
    },
    removeBr(childrenMsg) {
      console.log(childrenMsg)
      if (!childrenMsg || childrenMsg.length === 0) {
        return
      }
      if (childrenMsg[0].tag === 'br') {
        childrenMsg.splice(0, 1)
      }
      console.log(childrenMsg)
      if (
        childrenMsg.length !== 0 &&
        childrenMsg[childrenMsg.length - 1].tag === 'br'
      ) {
        childrenMsg.splice(childrenMsg.length - 1, 1)
        this.removeBr(childrenMsg)
      }
      console.log(childrenMsg)
    },
    initEditor() {
      this.editor = new E('#editor')
      this.editor.customConfig.menus = ['emoticon']
      this.editor.customConfig.uploadImgShowBase64 = true
      this.editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024
      this.editor.customConfig.uploadImgMaxLength = 2
      this.editor.customConfig.onchange = html => {
        this.content = html
      }
      this.editor.customConfig.emotions = [
        {
          // tab 的标题
          title: 'Smileys',
          // type -> 'emoji' / 'image'
          type: 'emoji',
          // content -> 数组
          content: [
            '😀',
            '😁',
            '😂',
            '🤣',
            '😃',
            '😄',
            '😅',
            '😆',
            '😉',
            '😊',
            '😋',
            '😎',
            '😍',
            '😘',
            '😗',
            '😙',
            '😚',
            '🙂',
            '🤗',
            '🤩',
            '🤔',
            '🤨',
            '😐',
            '😑',
            '😶',
            '🙄',
            '😏',
            '😣',
            '😥',
            '😮',
            '🤐',
            '😯',
            '😪',
            '😫',
            '😴',
            '😌',
            '😛',
            '😜',
            '😝',
            '🤤',
            '😒',
            '😓',
            '😔',
            '😕',
            '🙃',
            '🤑',
            '😲',
            '☹️',
            '🙁',
            '😖',
            '😞',
            '😟',
            '😤',
            '😢',
            '😭',
            '😦',
            '😧',
            '😨',
            '😩',
            '🤯',
            '😬',
            '😰',
            '😱',
            '😳',
            '🤪',
            '😵',
            '😡',
            '😠',
            '🤬',
            '😷',
            '🤒',
            '🤕',
            '🤢',
            '🤮',
            '🤧',
            '😇',
            '🤠',
            '🤡',
            '🤥',
            '🤫',
            '🤭',
            '🧐',
            '🤓',
            '😈',
            '👿',
            '👹',
            '👺',
            '💀',
            '👻',
            '👽',
            '🤖',
            '💩',
            '😺',
            '😸',
            '😹',
            '😻',
            '😼',
            '😽',
            '🙀',
            '😿',
            '😾'
          ]
        },
        {
          title: 'People and Fantasy',
          type: 'emoji',
          content: [
            '👶',
            '👧',
            '🧒',
            '👦',
            '👩',
            '🧑',
            '👨',
            '👵',
            '🧓',
            '👴',
            '👲',
            '👳‍♀️',
            '👳‍♂️',
            '🧕',
            '🧔',
            '👱‍♂️',
            '👱‍♀️',
            '👨‍',
            '👩‍',
            '👨‍',
            '👩‍',
            '👨‍',
            '👩‍',
            '👨‍',
            '👩‍',
            '👮‍♀️',
            '👮‍♂️',
            '👷‍♀️',
            '👷‍♂️',
            '💂‍♀️',
            '💂‍♂️',
            '🕵️‍♀️',
            '🕵️‍♂️',
            '👩‍⚕️',
            '👨‍⚕️',
            '👩‍🌾',
            '👨‍🌾',
            '👩‍🍳',
            '👨‍🍳',
            '👩‍🎓',
            '👨‍🎓',
            '👩‍🎤',
            '👨‍🎤',
            '👩‍🏫',
            '👨‍🏫',
            '👩‍🏭',
            '👨‍🏭',
            '👩‍💻',
            '👨‍💻',
            '👩‍💼',
            '👨‍💼',
            '👩‍🔧',
            '👨‍🔧',
            '👩‍🔬',
            '👨‍🔬',
            '👩‍🎨',
            '👨‍🎨',
            '👩‍🚒',
            '👨‍🚒',
            '👩‍✈️',
            '👨‍✈️',
            '👩‍🚀',
            '👨‍🚀',
            '👩‍⚖️',
            '👨‍⚖️',
            '👰',
            '🤵',
            '👸',
            '🤴',
            '🤶',
            '🎅',
            '🧙‍♀️',
            '🧙‍♂️',
            '🧝‍♀️',
            '🧝‍♂️',
            '🧛‍♀️',
            '🧛‍♂️',
            '🧟‍♀️',
            '🧟‍♂️',
            '🧞‍♀️',
            '🧞‍♂️',
            '🧜‍♀️',
            '🧜‍♂️',
            '🧚‍♀️',
            '🧚‍♂️',
            '👼',
            '🤰',
            '🤱',
            '🙇‍♀️',
            '🙇‍♂️',
            '💁‍♀️',
            '💁‍♂️',
            '🙅‍♀️',
            '🙅‍♂️',
            '🙆‍♀️',
            '🙆‍♂️',
            '🙋‍♀️',
            '🙋‍♂️',
            '🤦‍♀️',
            '🤦‍♂️',
            '🤷‍♀️',
            '🤷‍♂️',
            '🙎‍♀️',
            '🙎‍♂️',
            '🙍‍♀️',
            '🙍‍♂️',
            '💇‍♀️',
            '💇‍♂️',
            '💆‍♀️',
            '💆‍♂️',
            '🧖‍♀️',
            '🧖‍♂️',
            '💅',
            '🤳',
            '💃',
            '🕺',
            '👯‍♀️',
            '👯‍♂️',
            '🕴',
            '🚶‍♀️',
            '🚶‍♂️',
            '🏃‍♀️',
            '🏃‍♂️',
            '👫',
            '👭',
            '👬',
            '💑',
            '👩‍❤️‍👩',
            '👨‍❤️‍👨',
            '💏',
            '👩‍❤️‍💋‍👩',
            '👨‍❤️‍💋‍👨',
            '👪',
            '👨‍👩‍👧',
            '👨‍👩‍👧‍👦',
            '👨‍👩‍👦‍👦',
            '👨‍👩‍👧‍👧',
            '👩‍👩‍👦',
            '👩‍👩‍👧',
            '👩‍👩‍👧‍👦',
            '👩‍👩‍👦‍👦',
            '👩‍👩‍👧‍👧',
            '👨‍👨‍👦',
            '👨‍👨‍👧',
            '👨‍👨‍👧‍👦',
            '👨‍👨‍👦‍👦',
            '👨‍👨‍👧‍👧',
            '👩‍👦',
            '👩‍👧',
            '👩‍👧‍👦',
            '👩‍👦‍👦',
            '👩‍👧‍👧',
            '👨‍👦',
            '👨‍👧',
            '👨‍👧‍👦',
            '👨‍👦‍👦',
            '👨‍👧‍👧',
            '🤲',
            '👐',
            '🙌',
            '👏',
            '🤝',
            '👍',
            '👎',
            '👊',
            '✊',
            '🤛',
            '🤜',
            '🤞',
            '✌️',
            '🤟',
            '🤘',
            '👌',
            '👈',
            '👉',
            '👆',
            '👇',
            '☝️',
            '✋',
            '🤚',
            '🖐',
            '🖖',
            '👋',
            '🤙',
            '💪',
            '🖕',
            '✍️',
            '🙏',
            '💍',
            '💄',
            '💋',
            '👄',
            '👅',
            '👂',
            '👃',
            '👣',
            '👁',
            '👀',
            '🧠',
            '🗣',
            '👤',
            '👥'
          ]
        },
        {
          title: 'Animals & Nature',
          type: 'emoji',
          content: [
            '🐶',
            '🐱',
            '🐭',
            '🐹',
            '🐰',
            '🦊',
            '🐻',
            '🐼',
            '🐨',
            '🐯',
            '🦁',
            '🐮',
            '🐷',
            '🐽',
            '🐸',
            '🐵',
            '🙈',
            '🙉',
            '🙊',
            '🐒',
            '🐔',
            '🐧',
            '🐦',
            '🐤',
            '🐣',
            '🐥',
            '🦆',
            '🦅',
            '🦉',
            '🦇',
            '🐺',
            '🐗',
            '🐴',
            '🦄',
            '🐝',
            '🐛',
            '🦋',
            '🐌',
            '🐚',
            '🐞',
            '🐜',
            '🦗',
            '🕷',
            '🕸',
            '🦂',
            '🐢',
            '🐍',
            '🦎',
            '🦖',
            '🦕',
            '🐙',
            '🦑',
            '🦐',
            '🦀',
            '🐡',
            '🐠',
            '🐟',
            '🐬',
            '🐳',
            '🐋',
            '🦈',
            '🐊',
            '🐅',
            '🐆',
            '🦓',
            '🦍',
            '🐘',
            '🦏',
            '🐪',
            '🐫',
            '🦒',
            '🐃',
            '🐂',
            '🐄',
            '🐎',
            '🐖',
            '🐏',
            '🐑',
            '🐐',
            '🦌',
            '🐕',
            '🐩',
            '🐈',
            '🐓',
            '🦃',
            '🕊',
            '🐇',
            '🐁',
            '🐀',
            '🐿',
            '🦔',
            '🐾',
            '🐉',
            '🐲',
            '🌵',
            '🎄',
            '🌲',
            '🌳',
            '🌴',
            '🌱',
            '🌿',
            '☘️',
            '🍀',
            '🎍',
            '🎋',
            '🍃',
            '🍂',
            '🍁',
            '🍄',
            '🌾',
            '💐',
            '🌷',
            '🌹',
            '🥀',
            '🌺',
            '🌸',
            '🌼',
            '🌻',
            '🌞',
            '🌝',
            '🌛',
            '🌜',
            '🌚',
            '🌕',
            '🌖',
            '🌗',
            '🌘',
            '🌑',
            '🌒',
            '🌓',
            '🌔',
            '🌙',
            '🌎',
            '🌍',
            '🌏',
            '💫',
            '⭐️',
            '🌟',
            '✨',
            '⚡️',
            '☄️',
            '💥',
            '🔥',
            '🌪',
            '🌈',
            '☀️',
            '🌤',
            '⛅️',
            '🌥',
            '☁️',
            '🌦',
            '🌧',
            '⛈',
            '🌩',
            '🌨',
            '❄️',
            '☃️',
            '⛄️',
            '🌬',
            '💨',
            '💧',
            '💦',
            '☔️',
            '☂️',
            '🌊',
            '🌫'
          ]
        }
      ]
      this.editor.create()
    }
  }
}
</script>

<style>
#editor {
  height: 100%;
}
.w-e-panel-container {
  width: 450px !important;
}
.w-e-text-container {
  z-index: 1 !important;
}
.w-e-text-container .w-e-panel-container {
  top: -270px !important;
  left: 17% !important;
}
.w-e-text-container .w-e-panel-container .w-e-emoticon-container .w-e-item {
  font-size: 18px;
}
.w-e-toolbar {
  background-color: #eeeeee !important;
  border: none !important;
  border-top: 1px solid #ddd !important;
  /* border-bottom: 1px solid #ddd; */
}
.w-e-text-container {
  /* padding: 0 5px; */
  height: 80% !important;
  width: 100%;
  border: none !important;
  outline: none;
  font-family: 'Micrsofot Yahei';
  resize: none;
}
.w-e-text p {
  line-height: 1.2;
}

.w-e-menu {
  z-index: 1 !important;
}
</style>
