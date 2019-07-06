<template>
  <div class="recommend-info">
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
    this.getNewSongs()
  },
  methods: {
    async getNewSongs () {
      const { data } = await axios.get('/api/personalized/newsong')
      if (data.code === 200) {
        this.formatData = formatSongDetail(data.result)
        // console.log(this.formatData)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.page {
  height: calc(100vh - #{px2rem(500)});
}
</style>
