<template>
  <div class="page-list-info">
    <m-header>最近听过</m-header>
    <count>{{historyList.length}}</count>
    <scroll class="page">
      <song-list :data="historyList" @clickItem="addToPlay"></song-list>
    </scroll>
  </div>
</template>

<script>
import mHeader from '../components/m-header'
import count from '../components/count'
import Scroll from '../components/scroll'
import SongList from '../components/song-list'
import playMixin from '../common/js/playMixin'
import { mapGetters } from 'vuex'
export default {
  mixins: [playMixin],
  components: {
    mHeader,
    count,
    Scroll,
    SongList
  },
  computed: {
    ...mapGetters(['historyList'])
  },
  methods: {
    addToPlay (item, index) {
      this.SET_FULLSCREEN(true)
      this.SET_PLAY_LIST(this.historyList)
      this.SET_SEQUENCE_LIST(this.historyList)
      this.SET_CURRENT_INDEX(index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.page {
  height: calc(100vh - #{px2rem(280)});
}
</style>
