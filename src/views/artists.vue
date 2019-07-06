<template>
  <div>
    <div class="artists" v-if="artistsList.length">
      <m-header>全部歌手</m-header>
      <scroll class="page">
        <artist-list :data="artistsList" @clickItem="goArtistsInfo"></artist-list>
      </scroll>
    </div>
    <loading v-else></loading>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import mHeader from '../components/m-header'
import ArtistList from '../components/artist-list'
import axios from 'axios'
import Scroll from '../components/scroll'
import loading from '../components/loading'
export default {
  components: {
    mHeader,
    ArtistList,
    Scroll,
    loading
  },
  data () {
    return {
      artistsList: []
    }
  },
  created () {
    this.getArtists()
  },
  methods: {
    async getArtists () {
      const { data } = await axios.get('/api/top/artists')
      if (data.code === 200) {
        this.artistsList = data.artists
        // console.log(this.artistsList)
      }
    },
    goArtistsInfo (item) {
      this.$router.push({
        name: 'artistsInfo',
        params: {
          id: item.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
</style>
