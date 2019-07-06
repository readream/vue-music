<template>
  <div>
    <div class="play-list-view" v-if="playListData.length>0">
      <m-header>全部歌单</m-header>
      <scroll :data="playListData" class="page">
        <div class="play-wrapper">
          <play-list :data="playListData" @clickItem="goPlayListInfo"></play-list>
        </div>
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
import PlayList from '../components/play-list'
import Scroll from '../components/scroll'
import Loading from '../components/loading'
import axios from 'axios'
export default {
  components: {
    mHeader,
    PlayList,
    Scroll,
    Loading
  },
  data () {
    return {
      playListData: []
    }
  },
  created () {
    this.getPlayList()
  },
  methods: {
    async getPlayList () {
      const { data } = await axios.get('/api/personalized')
      if (data.code === 200) {
        this.playListData = data.result
        // console.log(this.recommendList)
      }
    },
    goPlayListInfo (item) {
      this.$router.push({
        name: 'playListInfo',
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
.play-wrapper {
  background: #fff;
  padding: px2rem(30) px2rem(20);
}
</style>
