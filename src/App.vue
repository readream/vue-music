<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <player></player>
  </div>
</template>

<script>
import player from './components/player'
export default {
  components: {
    player
  }
}
</script>

<style lang="scss">
#app {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  background-color: #f3f4f9;
  overflow: hidden;
}
</style>
