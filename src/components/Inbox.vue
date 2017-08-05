<template>
  <f7-page name="inbox">
    <f7-navbar title="Inbox" back-link="Back" sliding></f7-navbar>
    <br>
    <br>
    <div id="noConversations" v-if="conversations.length === 0" style="text-align:center">
      <h3 >There's no conversation.</h3>
      <p>Could you please share <b>{{host()}}</b> with one friend.</p>
    </div>

    <f7-list media-list no-border>
      <f7-list-item v-for="conversation in conversations"
        :key="conversation.id"
        class="inbox-list"
        :link="getConversationPath(conversation.id)"
        :media="avatar(conversation)"
        :title="conversation.username"
        :text="conversation.text"
      ></f7-list-item>
    </f7-list>

  </f7-page>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
     'conversations',
   ])
  },
  methods: {
    onChange(event) {
      console.log('Change', event);
    },
    getConversationPath(id) {
      return `/conversation/${id}`;
    },
    avatar(conversation) {
      return `<img src='https://api.adorable.io/avatars/60/${conversation.username}'>`;
    },
    isInboxEmpty() {
      return this.conversations.length === 0
    },
    host() {
      return window.location.host
    }
  }
}
</script>

<style media="screen">
  .inbox-list img {
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
  }

  .list-block .item-text {
    line-height: 41px;
    height: 36px;
  }

  .layout-dark .login-screen-content, .layout-dark .page, .layout-dark .panel, .page.layout-dark, .panel.layout-dark {
    background-color: #333333
  }

  .layout-dark .list-block ul, .list-block.layout-dark ul {
    /*background-color: #EEEEEE*/
  }

  .layout-dark .navbar, .layout-dark .subnavbar, .navbar.layout-dark, .subnavbar.layout-dark {
    background-color: #2e2e2e;
    color: #EEEEEE;
  }

  .layout-dark .content-block-inner {
    background: #353535
  }
</style>
