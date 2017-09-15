<template>
  <splash v-if="!isSocketConnected"></splash>
  <gmap-map
    v-else
    :center="center"
    :zoom="zoom"
    :options="options"
    style="height: 100%"
    @zoom_changed="zoomChange($event)"
    >
    <google-cluster v-if="isClustered">
        <google-marker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :id="m.id"
          :username="m.username"
          :clickable="m.isClickable"
          :draggable="false"
          :icon="m.icon"
          @click="clickMarker(m)">
          <gmap-info-window v-if="m.data.length > 0">{{ m.data }}</gmap-info-window>
        </google-marker>
    </google-cluster>
      <google-marker v-else
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :id="m.id"
        :username="m.username"
        :clickable="m.isClickable"
        :draggable="false"
        :icon="m.icon"
        @click="clickMarker(m)">
        <gmap-info-window v-if="m.data.length > 0">{{ m.data }}</gmap-info-window>
      </google-marker>
  </gmap-map>
</template>

<script>
 import { mapGetters } from 'vuex';
 import Splash from './Splash';

  export default {
    data() {
      return {
        zoom: 5,
        center: {
          lat: 38,
          lng: 34
        },
        init: false,
        options: {
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
              position: 8
          },
          streetViewControl: true,
          streetViewControlOptions: {
              position: 4
          },
          scrollwheel: true,
          styles: [ { "featureType": "all", "elementType": "labels.text.fill", "stylers": [ { "saturation": 36 }, { "color": "#000000" }, { "lightness": 40 } ] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [ { "visibility": "on" }, { "color": "#000000" }, { "lightness": 16 } ] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [ { "color": "#000000" }, { "lightness": 20 } ] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [ { "color": "#000000" }, { "lightness": 17 }, { "weight": 1.2 } ] }, { "featureType": "administrative.locality", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "administrative.neighborhood", "elementType": "all", "stylers": [ { "visibility": "off" } ] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [ { "color": "#000000" }, { "lightness": 20 } ] }, { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#000000" }, { "lightness": 21 } ] }, { "featureType": "road.highway", "elementType": "all", "stylers": [ { "visibility": "simplified" } ] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [ { "color": "#000000" }, { "lightness": 17 } ] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#000000" }, { "lightness": 29 }, { "weight": 0.2 } ] }, { "featureType": "road.highway", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [ { "color": "#000000" }, { "lightness": 18 } ] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [ { "color": "#000000" }, { "lightness": 16 } ] }, { "featureType": "transit", "elementType": "geometry", "stylers": [ { "color": "#000000" }, { "lightness": 19 } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#000000" }, { "lightness": 17 } ] } ]
        },
      }
    },
    methods: {
      zoomChange(event) {
        this.zoom = event;
      },
      clickMarker(marker) {
        this.$store.dispatch('clickMarker', marker);
        this.$socket.emit('joinConversation', marker)
        try {
          this.$f7.views.main.router.load({url: `/conversation/${marker.id}`})
        } catch (e) {
          this.$f7.alert(marker.username, 'Tick')
        }
      },
      initMap(position) {
        this.$store.dispatch('init', true);

        let lat = this.locationBlur ? Number(position.coords.latitude.toFixed(2)) : position.coords.latitude;
        let lng = this.locationBlur ? Number(position.coords.longitude.toFixed(2)) : position.coords.longitude;

        let myLocation = { lat, lng, username: this.$store.state.user.username, id: this.$socket.id }

        if (!this.init) {
          console.log('Howdy, u\'re awesome. What a shiny day. Have a good day, be polite.');
          this.center = myLocation;
          this.zoom = 15;
          this.init = true;
          // TODO: @cagataycali do it this a function.
          fetch(`https://trends.tick.chat/${lat.toFixed(0)}/${lng.toFixed(0)}`)
            .then(res => res.json())
            .then(res => {
              this.$store.dispatch('setTrends', res)
            })
            .catch(err => {
              alert(`Request err ${JSON.stringify(err)}`)
            })
        } else {
          if (this.$store.state.trends.length === 0) {
            fetch(`https://trends.tick.chat/${lat.toFixed(0)}/${lng.toFixed(0)}`)
              .then(res => res.json())
              .then(res => {
                this.$store.dispatch('setTrends', res)
              })
              .catch(err => {
                alert(`Request err ${JSON.stringify(err)}`)
              })
          }
          console.log('Wow, you\'re moving buddy.');
        }
        this.$store.dispatch('setLocation', myLocation);
        this.$socket.emit('myLocation', myLocation);
      },
    },
    computed: {
      ...mapGetters([
       'isSocketConnected',
       'markers',
       'locationBlur'
     ]),
     isClustered() {
       return this.zoom < 20
     }
   },
  created() {
    let isMobile = window.isMobile();
    this.options.zoomControl = !isMobile;
    this.options.streetViewControl = !isMobile;
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(this.initMap,
      (error) => {
        if (error.code == error.PERMISSION_DENIED)
            this.$f7.alert('Tick require your location information. We promise about your location is blurred by default. You can share your exact location If you want. Please share your location and restart page.', 'Tick')
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    } else {
      this.$f7.alert('Geolocation is not supported by this browser.', 'Tick')
    }
  },
  components: {
    Splash
  }
}
</script>

<style media="screen">
  .gm-style-iw {
    color: #353535
  }
@media screen and (max-width: 500px) {
  .gm-style-cc {
    display: none;
  }
  .gm-style-iw {
    color: #353535
  }
  img[src="https://maps.gstatic.com/mapfiles/api-3/images/google_white5_hdpi.png"]{display:none}
}
</style>
