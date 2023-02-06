<template>
  <f7-page name="inbox">
    <f7-navbar back-link="Back">
      <f7-nav-center sliding>Discover</f7-nav-center>
      <f7-nav-right>
        <f7-link icon="icon fa fa-podcast" style="font-size:1.5em" open-panel="right"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <br>
    <br>

    <f7-block-title style="text-align:center">Trends</f7-block-title>

    <!-- <f7-list media-list no-border>
      <f7-list-item v-for="trend in trends"
        :key="trend.id"
        class="inbox-list"
        :link="getConversationPath(trend.id, true)"
        :title="trend.name"
        media="<img src='/static/hashtag.png' style='width:60px'/>"
        :text="volumeText(trend.volume)"
      ></f7-list-item>
    </f7-list> -->

    <f7-block-title style="text-align:center">Conversations</f7-block-title>

    <f7-block id="noConversations" v-if="conversations.length === 0" style="text-align:center">
      <p><b>There's no conversation.</b></p>
      <p>Could you please share <b>{{host()}}</b> with one friend.</p>
    </f7-block>


    <f7-list media-list no-border>
      <f7-list-item v-for="conversation in conversations"
        :key="conversation.id"
        class="inbox-list"
        :link="getConversationPath(conversation.id, false)"
        :media="avatar(conversation)"
        :title="conversation.username"
        :text="conversation.text"
      >
      </f7-list-item>
    </f7-list>

  </f7-page>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
     'conversations',
     'trends'
   ])
  },
  methods: {
    getConversationPath(id, isGroup) {
      return `/${isGroup ? 'group' : 'conversation'}/${id}`;
    },
    avatar(conversation) {
      return `<img src='https://api.adorable.io/avatars/60/${conversation.username}'>`;
    },
    volumeText(volume) {
      return `tweeted more than ${volume} time.`
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

  .layout-dark .navbar, .layout-dark .subnavbar, .navbar.layout-dark, .subnavbar.layout-dark {
    background-color: #2e2e2e;
    color: #EEEEEE;
  }

  .layout-dark .content-block-inner {
    background: #353535
  }

  .list-block.media-list .item-link .item-title-row {
    background-image: none
  }
</style>
