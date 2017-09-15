<template>
  <div id="app">
    <f7-views>
      <f7-view id="main-view"  main layout="dark" :theme="theme">
        <f7-pages>
          <f7-page name="map">
            <g-map></g-map>
            <f7-toolbar tabbar v-if="isSocketConnected">
              <!-- <f7-link icon="icon fa fa-podcast fa-2x" open-popup="#popup"></f7-link> -->
              <f7-link icon="icon fa fa-bolt fa-2x" href="/inbox/"></f7-link>
            </f7-toolbar>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-views>

    <f7-panel right reveal layout="dark" :theme="theme">
      <f7-view id="right-panel-view" navbar-through :dynamic-navbar="true">
        <f7-navbar title="Publications" sliding></f7-navbar>
        <f7-pages>
          <f7-page>
            <f7-block-title>Announcement</f7-block-title>

            <f7-block>Announce idea, ask a question, feel free be polite.</f7-block>

            <f7-block>
              <f7-list form>
                <f7-list-item>
                  <f7-input v-model="user.data" @input="ideas" type="textarea" :placeholder="user.data || getRandom()"></f7-input>
                </f7-list-item>
                <f7-list-item>
                  <f7-button @click="spread" color="green" style="width: 100%;" no-link-class close-panel :disabled="isDisabled"><span class="icon fa fa-paper-plane faa-pulse animated-hover"></span></f7-button>
                </f7-list-item>
              </f7-list>


            </f7-block>

            <f7-block-title>Settings</f7-block-title>

            <f7-block>
              <f7-list form>
                  <f7-list-item>
                    <f7-icon slot="media">
                      <i class="fa fa-user-secret"></i>
                    </f7-icon>
                    <f7-input type="text" :value="user.username" placeholder="username" disabled/>
                  </f7-list-item>
                  <f7-list-item>
                    <f7-label>Blur? <i>*</i></f7-label>
                    <f7-input type="switch" @change="onChange('blur', $event)" :checked="locationBlur"></f7-input>
                  </f7-list-item>
                  <!-- <f7-list-item>
                    <f7-label>Send via enter?</f7-label>
                    <f7-input type="switch" @change="onChange('sendWithEnter', $event)" :checked="sendWithEnter"></f7-input>
                  </f7-list-item> -->
                </f7-list>
            </f7-block>

            <f7-block-title>FAQ</f7-block-title>

            <f7-block>
              <f7-accordion>
                <!-- Item 1 -->
                <f7-accordion-item>
                  <f7-accordion-toggle>What is blur</f7-accordion-toggle>
                  <f7-accordion-content>
                    <p>Tick, by default, share your location in privacy. Your exact location is <i>blurred</i>.</p>
                    <p>If you <b>disable blur option, your current location will be published as exactly</b>.</p>
                  </f7-accordion-content>
                </f7-accordion-item>
                <!-- Item 2 -->
                <f7-accordion-item>
                  <f7-accordion-toggle>Privacy</f7-accordion-toggle>
                  <f7-accordion-content>
                    <p>* Only the necessary logs and debug information are kept</p>
                    <p>* Developed features are made available under a Free Software license</p>
                    <p>* Tick.chat can block your access any time for any reason</p>
                    <p>* Changes can happen any time, sometimes without notice</p>
                    <p>* The app, can share your current location with other parties in real time.</p>
                  </f7-accordion-content>
                </f7-accordion-item>
              </f7-accordion>
            </f7-block>

            <f7-block>
              <f7-link href="https://github.com/cagataycali/tick.chat" external>Tick.chat is open-source, contributions are welcome!  <span class="icon fa fa-github faa-pulse animated"></span></f7-link>
            </f7-block>

          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-panel>
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
 data() {
   return {
     isDisabled: true
   };
 },
 methods: {
   getRandom: function() {
     let messages = ['happiness must spread to the world.', 'ask a quick solution of making money!', 'ask for help!', 'discuss your idea'];
     return messages[Math.floor(Math.random()*messages.length)];
   },
  ideas: function (value) {
     this.isDisabled = false;
  },
  spread: function () {
    // let me = this.$store.state.users.find(user => user.id === this.$store.state.user.id);
    let me = this.$store.state.user;
    me.data = this.user.data; // This for map info box.
    this.$socket.emit('spread', me);
    this.isDisabled = true;
  },
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
  //  window.f7 = this.$f7
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
