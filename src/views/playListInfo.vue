<template>
  <div class="play-list-info">
    <top :title="title" :img="img" :count="formatData.length" v-if="formatData.length"></top>
    <scroll class="page">
      <song-list :data="formatData" @clickItem="addToPlay"></song-list>
    </scroll>
  </div>
</template>

<script>
import axios from 'axios'
import infoMixin from '../common/js/infoMixin'
import playMixin from '../common/js/playMixin'
import { formatSongDetail } from '../common/js/util'
export default {
  mixins: [infoMixin, playMixin],
  data () {
    return {
      formatData: []
    }
  },
  created () {
    this.getInfo(this.$route.params.id)
  },
  methods: {
    async getInfo (id) {
      const { data } = await axios.get(`/api/playlist/detail?id=${id}`)
      this.formatData = formatSongDetail(data.playlist.tracks)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.play-list-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f3f4f9;
  z-index: 9999;
  .page {
    height: calc(100vh - #{px2rem(500)});
  }
}
</style>
