window.isMobile = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check
}

try {
  Notification.requestPermission().then(function (result) {
    window.isGranted = (result === 'granted')
  })
} catch (e) {
  window.isGranted = false
}

let notify = function (obj, callback) {
  obj.icon = obj.icon || '../static/check.png'
  try {
    if (!window.isMobile) {
      var audio = new Audio(obj.sound)
      audio.play()
    }

    if (window.isGranted) {
      let n = new Notification(obj.title, obj)
      n.onclick = (event) => callback(n)
    } else {
      window.f7.addNotification({message: obj.body, title: obj.title, id: obj.tag, media: `<img style="-webkit-border-radius: 20px;-moz-border-radius: 20px; border-radius: 20px;" src="https://api.adorable.io/avatars/60/${obj.name}">`, hold: 3000, onClick: () => window.f7.views.main.router.load({url: `/conversation/${obj.tag}`})})
    }
  } catch (e) {
    window.f7.addNotification({message: obj.body, title: obj.title, id: obj.tag, media: `<img style="-webkit-border-radius: 20px;-moz-border-radius: 20px; border-radius: 20px;" src="https://api.adorable.io/avatars/60/${obj.name}">`, hold: 3000, onClick: () => window.f7.views.main.router.load({url: `/conversation/${obj.tag}`})})
  }
}

const loadUrl = (notification) => {
  window.f7.views.main.router.load({url: `/conversation/${notification.tag}`})
}

const state = {
  connect: false,
  users: [],
  user: {},
  init: false,
  conversations: [],
  currentConversation: {},
  theme: 'gray',
  locationBlur: true,
  sendWithEnter: !(window.isMobile()),
  trends: []
}

const getters = {
  isSocketConnected (state) {
    return state.connect && state.init
  },
  trends (state) {
    return state.trends
  },
  markers (state) {
    return state.users
  },
  conversations (state) {
    return state.conversations
  },
  conversation (state) {
    return state.currentConversation
  },
  conversationtTitle (state) {
    return state.currentConversation.username || state.currentConversation.name // For trends.
  },
  theme (state) {
    return state.theme
  },
  user (state) {
    return state.user
  },
  locationBlur (state) {
    return state.locationBlur
  },
  sendWithEnter (state) {
    return state.sendWithEnter
  }
}

const mutations = {
  SOCKET_CONNECT: (state, status) => {
    state.connect = true
  },
  SOCKET_CONNECT_ERROR: (state, status) => {
    state.connect = false
  },
  SOCKET_USERS: (state, users) => {
    state.users = users.map(user => {
      return {
        id: user.id,
        username: user.username,
        isClickable: state.user.id !== user.id,
        position: user.position,
        icon: {
          anchor: {x: user.position.lat, y: user.position.lng},
          url: `/static/${state.user.id === user.id ? 'tick' : 'child'}.svg`,
          scaledSize: {b: 'px', f: 'px', height: 32, width: 32}
        },
        data: user.data
      }
    })
  },
  SOCKET_USER_CREDENTIALS: (state, user) => {
    state.user = user
  },
  SOCKET_LOCATION: (state, user) => {
    let isMe = state.user.id === user.id
    let find = state.users.find(marker => marker.id === user.id)
    if (find) {
      find.position.lat = user.position.lat
      find.position.lng = user.position.lng
    } else {
      state.users.push({
        id: user.id,
        username: user.username,
        isClickable: !isMe,
        position: user.position,
        icon: {
          anchor: {x: user.position.lat, y: user.position.lng},
          url: `/static/${isMe ? 'tick' : 'child'}.svg`,
          scaledSize: {b: 'px', f: 'px', height: 32, width: 32}
        },
        data: user.data
      })
    }
  },
  SOCKET_DISCONNECTED: (state, user) => {
    state.users = state.users.filter(marker => marker.id !== user.id)
    state.conversations = state.conversations.filter(conversation => conversation.id !== user.id)
  },
  SOCKET_JOIN: (state, user) => {
    let conversation = state.conversations.find(conversation => conversation.id === user.id)
    if (!conversation) {
      notify({title: 'Tick', body: `Hola! ${user.username} opened conversation page with you, say hi!`, username: user.username, tag: user.id, sound: '../static/sounds/map.mp3'}, loadUrl)
      user.messages = []
      user.text = 'Opened conversation page..'
      state.conversations.push(user)
    }
  },
  SOCKET_MESSAGE: (state, message) => {
    if (message.isTrend) {
      if (message.name !== state.user.username) {
        let _trend = state.trends.find(trend => trend.id === message.to);
        message.type = 'received'
        _trend.messages.push(message)
      }
    } else {
      let conversation = state.conversations.find(conversation => conversation.id === message.id)
      message.type = 'received'
      if (conversation) {
        conversation.messages.push(message)
        conversation.text = message.text
      } else {
        let user = state.users.find(user => user.id === message.id)
        user.messages = [message]
        user.text = message.text
        state.conversations.push(user)
      }
      let currentPage = window.f7.views.main.activePage.name
      if (currentPage === 'chat' && state.currentConversation.id === message.id && !window.isMobile) {
        var audio = new Audio('../static/sounds/chat.mp3')
        audio.play()
      } else {
        notify({title: message.name, username: message.name, body: `${message.text}`, tag: message.id, sound: `../static/sounds/inbox.mp3`}, loadUrl)
      }
    }
  },
  SOCKET_SPREAD: (state, message) => {
    if (message.id !== state.user.id) {
      let conversation = state.conversations.find(conversation => conversation.id === message.id)
      if (conversation) {
        conversation.messages.push(message)
        conversation.text = message.day
      } else {
        let user = state.users.find(user => user.id === message.id)
        notify({title: 'Tick', body: `Hola! ${user.username} opened conversation page with you, say hi!`, username: user.username, tag: user.id, sound: '../static/sounds/map.mp3'}, loadUrl)
        user.messages = []

        user.messages.push(message)
        user.text = 'Opened conversation page..'
        state.conversations.push(user)
      }

      let who = state.users.find(user => user.id === message.id)
      who.data = message.day

      let currentPage = window.f7.views.main.activePage.name
      if (currentPage === 'chat' && state.currentConversation.id === message.id && !window.isMobile) {
        var audio = new Audio('../static/sounds/chat.mp3')
        audio.play()
      } else {
        notify({title: message.name, username: message.name, body: `${message.day}`, tag: message.id, sound: `../static/sounds/map.mp3`}, loadUrl)
      }
    }
  },
  setLocation: (state, location) => {
    try {
      if (state.user.id === location.id) {
        state.user.position.lat = location.lat
        state.user.position.lng = location.lng
      }
      let setUser = state.users.find(user => user.id === location.id)
      setUser.position.lat = location.lat
      setUser.position.lng = location.lng
    } catch (e) {
      // Just will try again .. :)
    }
  },
  clickMarker: (state, user) => {
    let conversation = state.conversations.find(conversation => conversation.username === user.username)
    try {
      let messageCount = conversation.messages.length
    } catch (e) {
      user.messages = []
      user.text = 'Opened conversation page..'
      state.conversations.push(user)
      state.currentConversation = user
    }
  },
  currentConversation: (state, id) => {
    let conversation = state.conversations.find(conversation => conversation.id === id)
    if (!conversation) {
      conversation = state.trends.find(trend => trend.id === id)
    }
    state.currentConversation = conversation
  },
  setTrends: (state, trends) => {
    state.trends = trends
  },
  sendMessage: (state, message) => {
    try {
      let conversation = state.conversations.find(conversation => conversation.id === state.currentConversation.id)
      conversation.messages.push(message)
      conversation.text = message.text
    } catch (e) {
      let conversation = state.trends.find(trend => trend.id === state.currentConversation.id)
      if (!conversation.messages) conversation.messages = []
      conversation.messages.push(message)
      conversation.text = message.text
    }
  },
  init: (state, bool) => {
    state.init = bool
  }
}

const actions = {
  setLocation (context, location) {
    context.commit('setLocation', location)
  },
  clickMarker (context, user) {
    context.commit('clickMarker', user)
  },
  currentConversation (context, id) {
    context.commit('currentConversation', id)
  },
  sendMessage (context, message) {
    context.commit('sendMessage', message)
  },
  setTrends (context, trends) {
    context.commit('setTrends', trends)
  },
  init (context, bool) {
    context.commit('init', bool)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
