<template>
    <f7-page navbar-fixed name="chat">
      <f7-navbar back-link="Back">
        <f7-nav-center sliding>{{conversationtTitle}}</f7-nav-center>
        <f7-nav-right>
          <f7-link icon="icon fa fa-podcast" style="font-size:1.5em" open-panel="right"></f7-link>
        </f7-nav-right>
      </f7-navbar>
      <f7-messages scrollMessagesOnlyOnEdge class="chats">
        <f7-message v-for="message in messages"
          :key="message.id"
          :text="message.text"
          :label="message.label"
          :date="message.date"
          :name="message.name"
          :avatar="getAvatar(message)"
          :type="message.type"
          :day="message.day"
          :time="message.time"
        ></f7-message>
      </f7-messages>
      <f7-messagebar placeholder="Say something.." @input="keyPress" @submit="onSubmit">
        <span slot="send-link"><i style="font-size:1.8em;" class="fa fa-paper-plane fa-2x"></i></span>
      </f7-messagebar>
    </f7-page>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    data() {
      return {
        messages: []
      }
    },
    props: ['id'],
    methods: {
      keyPress: function(event) {
        if (this.sendWithEnter) {
          if (event.split('\n').length > 1) {
            this.onSubmit(event.split('\n')[0], this.$f7.messagebar('.messagebar').clear)
          }
        }
      },
      onSubmit: function(text, clear) {
        if (text.trim().length === 0) return;
        let message = {
          id: this.$store.state.user.id,
          name: this.$store.state.user.username,
          avatar: `https://api.adorable.io/avatars/60/${this.$store.state.user.username}`,
          text: text,
          date: (function () {
            var now = new Date();
            var hours = now.getHours();
            var minutes = now.getMinutes();
            return hours + ':' + minutes;
          })()
        };
        this.$store.dispatch('sendMessage', message);
        message.to = this.$store.state.currentConversation.id
        message.isTrend = false
        this.$socket.emit('message', message)
        clear();
      },
      getAvatar(message) {
        return `https://api.adorable.io/avatars/60/${message.name}`;
      }
    },
    computed: {
      ...mapGetters([
       'conversation',
       'conversationtTitle',
       'sendWithEnter',
     ])
   },
   sockets: {
     disconnected: function(user) {
       if (this.id === user.id) {
         this.$f7.alert(`User offline now..`, 'Tick')
         setTimeout(() => {
           this.$router.back()
         }, 500);
       }
     }
   },
    created() {
      try {
        this.$store.dispatch('currentConversation', this.id);
        this.messages = this.$store.state.currentConversation.messages;
      } catch (e) {
        console.log(e);
      }
    }
  }
</script>

<style media="screen">
  .chats {
    padding-bottom: 40px;
  }
  .messages-content {
    background: #EEEEEE;
  }
  .message-sent .message-text {
    background-color: #00ADB5;
  }
  .message-received .message-text {
    background-color: #393E46;
    color: #EEEEEE;
  }
</style>
