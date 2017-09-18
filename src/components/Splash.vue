<template>
  <div class='centerWrapper'>
    <div class='centerMap'> <i style="font-size: 6em;" id="splash" class="fa fa-check faa-bounce animated"></i></div>
    <div class='centerMap' align="center" style="margin-top:55px"> {{slogan}} </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      slogan: ""
    }
  },
  created() {
    this.slogan = randomSlogan()
    setInterval(() => {
      this.slogan = randomSlogan()
    }, 2500);
  }
}
</script>

<style media="screen">
  .centerWrapper:before {
    content: '';
    height: 100%;
    display: inline-block;
    vertical-align: middle;
  }

  .centerMap {
    position: fixed;
    display: inline-block;
    vertical-align: middle;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  li { cursor: pointer; cursor: hand; }
</style>
