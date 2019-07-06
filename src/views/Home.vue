<template>
  <div class="home">
    <div class="header">
      <div class="personal" @click="goUserCenter">我的</div>
      <div class="mk">MIKO</div>
      <div class="search" @click="goSearch">
        <i class="iconfont icon-chaxun"></i>
      </div>
    </div>
    <scroll class="home-container">
      <div>
        <div class="swiper">
          <swiper :options="swiperOption" ref="mySwiper" v-if="newSongData.length>0">
            <!-- slides -->
            <swiper-slide v-for="(item,index) in newSongData" :key="index">
              <img :src="`${item.song.album.blurPicUrl}?param=400y400`" alt />
            </swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="nav">
          <div class="item">
            <div class="item-icon" @click="goRecommend">
              <i class="iconfont icon-date"></i>
            </div>
            <div class="title">每日推荐</div>
          </div>
          <div class="item">
            <div class="item-icon" @click="goPlayList">
              <i class="iconfont icon-music-list"></i>
            </div>
            <div class="title">歌单</div>
          </div>
          <div class="item">
            <div class="item-icon" @click="goRank">
              <i class="iconfont icon-rank"></i>
            </div>
            <div class="title">排行榜</div>
          </div>
        </div>
        <div class="recommend">
          <div class="title-wrapper">
            <div class="title">推荐歌单</div>
            <div class="more" @click="goPlayList">
              <i class="iconfont icon-more"></i>
            </div>
          </div>
          <play-list :data="playList" @clickItem="goPlayListInfo"></play-list>
        </div>
        <div class="hot">
          <div class="title-wrapper">
            <div class="title">热门歌手</div>
            <div class="more" @click="goArtists">
              <i class="iconfont icon-more"></i>
            </div>
          </div>
          <artist-list :data="artistList" class="clearfix" @clickItem="goArtistsInfo"></artist-list>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import axios from 'axios'
import PlayList from '../components/play-list'
import ArtistList from '../components/artist-list'
import Scroll from '../components/scroll'
export default {
  components: {
    PlayList,
    ArtistList,
    Scroll
  },
  data () {
    return {
      swiperOption: {
        loop: true,
        autoplay: {
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination'
        }
      },
      newSongData: [],
      playList: [],
      artistList: []
    }
  },
  created () {
    this.getNewSongs()
    this.getPlayList()
    this.getArtistList()
  },
  methods: {
    async getNewSongs () {
      const { data } = await axios.get('/api/personalized/newsong')
      if (data.code === 200) {
        this.newSongData = data.result
        // console.log(this.newSongData)
      }
    },
    async getPlayList () {
      const { data } = await axios.get('/api/personalized')
      if (data.code === 200) {
        this.playList = data.result.slice(0, 6)
        // console.log(this.recommendList)
      }
    },
    async getArtistList () {
      const { data } = await axios.get('/api/top/artists?limit=10')
      if (data.code === 200) {
        this.artistList = data.artists
        // console.log(this.artistList)
      }
    },
    goPlayList () {
      this.$router.push('/playListView')
    },
    goRecommend () {
      this.$router.push('/recommend')
    },
    goRank () {
      this.$router.push('/rank')
    },
    goArtists () {
      this.$router.push('/artists')
    },
    goPlayListInfo (item) {
      this.$router.push({
        name: 'playListInfo',
        params: {
          id: item.id
        }
      })
    },
    goArtistsInfo (item) {
      this.$router.push({
        name: 'artistsInfo',
        params: {
          id: item.id
        }
      })
    },
    goSearch () {
      this.$router.push('/search')
    },
    goUserCenter () {
      this.$router.push('/userCenter')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.home-container {
  width: 100%;
  height: calc(100vh - #{px2rem(200)});
  overflow: hidden;
}
.header {
  position: relative;
  left: 0;
  top: 0;
  right: 0;
  background: #f2353c;
  width: 100%;
  height: px2rem(90);
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  color: white;
  font-size: px2rem(36);
  z-index: 9;
  .personal {
    color: #f9aeb0;
    margin-left: px2rem(20);
  }
  .mk {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .search {
    position: absolute;
    right: px2rem(20);
  }
  i {
    font-size: px2rem(36);
  }
}
.swiper {
  width: 100%;
  height: px2rem(375);
  padding: px2rem(20);
  box-sizing: border-box;
  .swiper-container {
    width: 100%;
    height: 100%;
    border-radius: px2rem(10);
    .swiper-wrapper img {
      width: 100%;
      height: 100%;
    }
  }
}
.nav {
  padding: px2rem(20) px2rem(50);
  margin-bottom: px2rem(20);
  background: #fff;
  display: flex;
  text-align: center;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .item {
    .item-icon {
      display: flex;
      justify-content: center;
      width: px2rem(120);
      height: px2rem(120);
      background: #f2353c;
      border-radius: 50%;
      align-items: center;
      margin-bottom: px2rem(20);
      i {
        font-size: px2rem(70);
        color: #fff;
      }
    }
    .title {
      margin-bottom: px2rem(20);
      font-size: px2rem(24);
    }
  }
}
.recommend,
.hot {
  padding: px2rem(20);
  margin-bottom: px2rem(20);
  background: #fff;
  .title-wrapper {
    margin-bottom: px2rem(40);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .title {
      padding-left: px2rem(20);
      font-size: px2rem(34);
      border-left: px2rem(6) solid #f2353c;
    }
    .more {
      width: px2rem(50);
      height: px2rem(38);
      border-radius: px2rem(25);
      border: 1px solid #ccc;
      color: #bfbfbf;
      text-align: center;
    }
  }
}
</style>
