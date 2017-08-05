try {
  Notification.requestPermission().then(function(result) {
    window.isGranted = (result === 'granted');
  });
} catch (e) {
    window.isGranted = false;
}


let notify = function(obj, callback) {
  obj.icon = obj.icon || '../static/check.png';
  try {

    var audio = new Audio(obj.sound);
    audio.play();

    if (window.isGranted) {
      let n = new Notification(obj.title, obj);
      n.onclick = (event) => callback(n);
    } else {
      window.f7.addNotification({message: obj.body, title: obj.title, id: obj.tag, media:`<img style="-webkit-border-radius: 20px;-moz-border-radius: 20px; border-radius: 20px;" src="https://api.adorable.io/avatars/60/${obj.name}">`, hold:3000, onClick:() => window.f7.views.main.router.load({url: `/conversation/${obj.tag}`}) })
    }
  } catch (e) {
    window.f7.addNotification({message: obj.body, title: obj.title, id: obj.tag, media:`<img style="-webkit-border-radius: 20px;-moz-border-radius: 20px; border-radius: 20px;" src="https://api.adorable.io/avatars/60/${obj.name}">`, hold:3000, onClick:() => window.f7.views.main.router.load({url: `/conversation/${obj.tag}`}) })
  }
}

const loadUrl = (notification) => {
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
  sendWithEnter: true,
};

const getters = {
  isSocketConnected(state) {
    return state.connect && state.init
  },
  markers(state) {
    return state.users;
  },
  conversations(state) {
    return state.conversations;
  },
  conversation(state) {
    return state.currentConversation;
  },
  conversationtTitle(state) {
    return state.currentConversation.username;
  },
  theme(state) {
    return state.theme;
  },
  user(state) {
    return state.user;
  },
  locationBlur(state) {
    return state.locationBlur;
  },
  sendWithEnter(state) {
    return state.sendWithEnter;
  }
};

const mutations = {
  SOCKET_CONNECT: (state,  status ) => {
    state.connect = true;
  },
  SOCKET_CONNECT_ERROR: (state, status) => {
    state.connect = false;
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
          url: `https://static.tick.fun/${state.user.id === user.id ? 'tick' : 'child'}.svg`,
          scaledSize: {b:"px", f:"px", height: 32, width: 32}
        },
        data: user.data
      }
    });
  },
  SOCKET_USER_CREDENTIALS:(state, user) => {
    state.user = user;
  },
  SOCKET_LOCATION: (state, user) => {
    let isMe = state.user.id === user.id;
    let find = state.users.find(marker => marker.id === user.id);
    if (find) {
      find.position.lat = user.position.lat;
      find.position.lng = user.position.lng;
    } else {
      state.users.push({
        id: user.id,
        username: user.username,
        isClickable: !isMe,
        position: user.position,
        icon: {
          anchor: {x: user.position.lat, y: user.position.lng},
          url: `https://static.tick.fun/${isMe ? 'tick' : 'child'}.svg`,
          scaledSize: {b:"px", f:"px", height: 32, width: 32}
        },
        data: user.data
      });
    }

  },
  SOCKET_DISCONNECTED: (state, user) => {
    state.users = state.users.filter(marker => marker.id !== user.id);
    state.conversations = state.conversations.filter(conversation => conversation.id !== user.id);
  },
  SOCKET_JOIN: (state, user) => {
    let conversation = state.conversations.find(conversation => conversation.id === user.id);
    if (!conversation) {
      notify({title: 'Tick', body: `Hola! ${user.username} opened conversation page with you, say hi!`, username: user.username, tag: user.id, sound:'../static/sounds/map.mp3'}, loadUrl)
      user.messages = [];
      user.text = 'Opened conversation page..'
      state.conversations.push(user);
    }
  },
  SOCKET_MESSAGE: (state, message) => {
    let conversation = state.conversations.find(conversation => conversation.id === message.id);
    message.type = 'received'
    if (conversation) { // TODO @may crash messaging.
      conversation.messages.push(message);
      conversation.text = message.text;
    } else {
      let user = state.users.find(user => user.id === message.id);
      user.messages = [message];
      user.text = message.text
      state.conversations.push(user);
    }
    let currentPage = window.f7.views.main.activePage.name;
    if (currentPage === 'chat' && state.currentConversation.id === message.id) {
      var audio = new Audio('../static/sounds/chat.mp3');
      audio.play();
    } else {
      notify({title: message.name, username: message.name, body: `${message.text}`, tag: message.id, sound:`../static/sounds/inbox.mp3`}, loadUrl)
    }
  },
  SOCKET_SPREAD: (state, message) => {
    let conversation = state.conversations.find(conversation => conversation.id === message.id);
    if (conversation) {
      conversation.messages.push(message);
      conversation.text = message.day;
    } else {
      let user = state.users.find(user => user.id === message.id);
      notify({title: 'Tick', body: `Hola! ${user.username} opened conversation page with you, say hi!`, username: user.username, tag: user.id, sound:'../static/sounds/map.mp3'}, loadUrl)
      user.messages = [];

      user.messages.push(message);
      user.text = 'Opened conversation page..'
      state.conversations.push(user);
    }

    let who = state.users.find(user => user.id === message.id);
    who.data = message.day;

    let currentPage = window.f7.views.main.activePage.name;
    if (currentPage === 'chat' && state.currentConversation.id === message.id) {
      var audio = new Audio('../static/sounds/chat.mp3');
      audio.play();
    } else {
      notify({title: message.name, username: message.name, body: `${message.day}`, tag: message.id, sound:`../static/sounds/map.mp3`}, loadUrl)
    }
  },
  setLocation: (state, location) => {
    try {
      if (state.user.id === location.id) {
        state.user.position.lat = location.lat;
        state.user.position.lng = location.lng;
      }
      let setUser = state.users.find(user => user.id === location.id);
      setUser.position.lat = location.lat;
      setUser.position.lng = location.lng;
    } catch (e) {
      // Just will try again .. :)
    }
  },
  clickMarker: (state, user) => {
    let conversation = state.conversations.find(conversation => conversation.username === user.username);
    try {
      let messageCount = conversation.messages.length;
    } catch (e) {
      user.messages = [];
      user.text = 'Opened conversation page..'
      state.conversations.push(user);
      state.currentConversation = user;
    }
  },
  currentConversation: (state, id) => {
    let conversation = state.conversations.find(conversation => conversation.id === id);
    state.currentConversation = conversation;
  },
  sendMessage: (state, message) => {
    let conversation = state.conversations.find(conversation => conversation.id === state.currentConversation.id);
    conversation.messages.push(message);
    conversation.text = message.text;
  },
  init: (state, bool) => {
    state.init = bool;
  }
};

const actions = {
  setLocation(context, location) {
    context.commit('setLocation', location);
  },
  clickMarker(context, user) {
    context.commit('clickMarker', user);
  },
  currentConversation(context, id) {
    context.commit('currentConversation', id);
  },
  sendMessage(context, message) {
    context.commit('sendMessage', message)
  },
  init(context, bool) {
    context.commit('init', bool);
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
}
