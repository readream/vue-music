<template>
  <div class="artist-list-info">
    <top :title="title" :img="img" :count="formatData.length" v-if="formatData.length"></top>
    <scroll class="page">
      <song-list :data="formatData" @clickItem="addToPlay"></song-list>
    </scroll>
  </div>
</template>

<script>

import axios from 'axios'
import infoMixin from '../common/js/infoMixin'
import { formatSongDetail } from '../common/js/util'
import { mapMutations } from 'vuex'
export default {
  mixins: [infoMixin],
  data () {
    return {
      formatData: []
    }
  },
  created () {
    this.getInfo(this.$route.params.id)
  },
  methods: {
    ...mapMutations(['SET_FULLSCREEN', 'SET_PLAY_LIST', 'SET_SEQUENCE_LIST', 'SET_CURRENT_INDEX']),
    async getInfo (id) {
      const { data } = await axios.get(`/api/artists?id=${id}`)
      this.formatData = formatSongDetail(data.hotSongs)
      // console.log(this.formatData)
    },
    addToPlay (item, index) {
      this.SET_FULLSCREEN(true)
      this.SET_PLAY_LIST(this.formatData)
      this.SET_SEQUENCE_LIST(this.formatData)
      this.SET_CURRENT_INDEX(index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.artist-list-info {
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
