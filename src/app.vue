<template>
  <div id="app">
    <!-- <f7-statusbar></f7-statusbar> -->
    <f7-views>
      <f7-view id="main-view"  main layout="dark" :theme="theme">
        <f7-pages>
          <f7-page name="map">
            <g-map></g-map>
            <f7-toolbar tabbar v-if="isSocketConnected">
              <f7-link icon="icon fa fa-podcast fa-2x" open-popup="#popup"></f7-link>
              <f7-link icon="icon fa fa-inbox fa-2x" href="/inbox/"></f7-link>
            </f7-toolbar>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-views>

    <f7-popup id="popup">
      <f7-view navbar-fixed layout="dark" :theme="theme">
        <f7-pages>
          <f7-page>
            <f7-navbar>
              <f7-nav-center>
                Status & Settings
              </f7-nav-center>
              <f7-nav-right>
                <f7-link close-popup>Close</f7-link>
              </f7-nav-right>
            </f7-navbar>

            <f7-block><h2>Share your ideas whole world!</h2></f7-block>

            <f7-block>
              <f7-list form>
                <f7-list-item>
                  <f7-input @input="ideas" type="textarea" :placeholder="user.data || 'Ideas spreads the world!'"></f7-input>
                </f7-list-item>
              </f7-list>
            </f7-block>

            <f7-block><h2>Publication settings</h2></f7-block>

            <f7-block>
              <f7-list form>
                  <f7-list-item>
                    <f7-icon slot="media">
                      <i class="fa fa-user-secret"></i>
                    </f7-icon>
                    <f7-input type="text" :value="user.username" placeholder="username" disabled/>
                  </f7-list-item>
                  <f7-list-item>
                    <f7-label>Theme</f7-label>
                    <f7-input type="select" @change="onChange('theme', $event)">
                      <option value="green">Green</option>
                      <option value="blue">Blue</option>
                      <option value="pink">Pink</option>
                      <option value="gray">Gray</option>
                    </f7-input>
                  </f7-list-item>
                  <f7-list-item>
                    <f7-label>Location blur?</f7-label>
                    <f7-input type="switch" @change="onChange('blur', $event)" :checked="locationBlur"></f7-input>
                  </f7-list-item>
                  <f7-list-item>
                    <f7-label>Send via enter?</f7-label>
                    <f7-input type="switch" @change="onChange('sendWithEnter', $event)" :checked="sendWithEnter"></f7-input>
                  </f7-list-item>
                </f7-list>
            </f7-block>

          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-popup>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Splash from './components/Splash';

export default {
  computed: {
    ...mapGetters([
     'isSocketConnected',
     'theme',
     'user',
     'locationBlur',
     'sendWithEnter'
   ])
 },
 methods: {
  ideas: _.debounce(function (value) {
     this.user.data = value;
     let me = this.$store.state.users.find(user => user.id === this.$store.state.user.id);
     me.data = value;
     this.spread(me)
  }, 3000),
  spread: _.debounce(function (me) {
     let {id, data, username} = me;
     this.$socket.emit('spread', {id, data, username});
  }, 50),
  onChange: function(type, event) {
    let input = event.target;
    if (type === 'theme') {
      this.$store.state.theme = input.value;
    } else if (type === 'blur') {
      if (!input.checked) {
        this.$f7.alert('Your current position will published exactly. It can be risky for you. You agree terms of usage with these use.', 'Tick')
      }
      this.$store.state.locationBlur = input.checked;
    } else if (type === 'sendWithEnter') {
      this.$store.state.sendWithEnter = input.checked;
    }
  }
 },
 components: {
   Splash
 },
 created() {
   window.f7 = this.$f7
   window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    return false;
  });

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

.label-switch input[type=checkbox]:checked+.checkbox {
  background: #00ADB5
}
</style>
