<template>
  <div>
    <div class="mini-player" v-show="!fullScreen">
      <div class="player-info" @click="toggleShow(true)">
        <div class="player-img">
          <img :src="songImg" class="rotate" :class="rotateStop" alt />
        </div>
        <div>
          <p class="player-name">{{songName}}</p>
          <p class="player-artist">
            <span v-for="(item,index) in songArtists" :key="index">{{item.name}}</span>
          </p>
        </div>
      </div>
      <div class="player-operate">
        <i class="iconfont" :class="playIcon" @click="togglePlay"></i>
        <i class="iconfont icon-xiayiqu" @click="next"></i>
      </div>
      <div class="mini-progress" :style="{'width': `${barPercent}`}"></div>
    </div>
    <transition name="player">
      <div class="player" v-show="fullScreen" :style="{'backgroundImage': `url(${songImg})`}">
        <div class="player-mask"></div>
        <div class="player-header">
          <i class="iconfont icon-xia" @click="toggleShow(false)"></i>
          <div class="header-info">
            <p>{{songName}}</p>
            <p class="header-artist">
              <span v-for="(item,index) in songArtists" :key="index">{{item.name}}</span>
            </p>
          </div>
        </div>
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide class="img-container">
            <img :src="songImg" class="rotate" :class="rotateStop" alt />
            <i class="iconfont icon-xiai" :class="{'icon-xiai-red': isLove}" @click="addToLove"></i>
          </swiper-slide>
          <swiper-slide class="lyric-container">
            <scroll ref="lyricScroll" class="lyric-scroll">
              <div>
                <ul v-if="lyricLines.length > 0">
                  <li
                    ref="lyricLine"
                    class="list-item"
                    :class="{'active': index === currentLineNumber}"
                    v-for="(item, index) in lyricLines"
                    :key="index"
                  >{{item.txt}}</li>
                </ul>
                <div v-else>暂无歌词</div>
              </div>
            </scroll>
          </swiper-slide>
          <!-- Optional controls -->
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="player-operate">
          <div class="operate-mask"></div>
          <div class="progress">
            <span class="time">{{formatTime(currentTime)}}</span>
            <div class="progress-bar" ref="progressBar" @click="progressClick">
              <div class="bar-moved" :style="{'width': `${barPercent}`}"></div>
              <div
                class="bar-btn"
                :style="{'left': `${barPercent}`}"
                @touchmove.prevent="progressMove"
                @touchend.prevent="progressEnd"
              ></div>
            </div>
            <span class="time">{{formatTime(overTime)}}</span>
          </div>
          <div class="operate-icon">
            <i class="iconfont ft-40" :class="modeIcon" @click="changeMode"></i>
            <i class="iconfont icon-shangyiqu ft-80" @click="prev"></i>
            <i class="iconfont ft-100" :class="playIcon" @click="togglePlay"></i>
            <i class="iconfont icon-xiayiqu ft-80" @click="next"></i>
            <i class="iconfont icon-more ft-40" @click="togglePlaylistShow"></i>
          </div>
        </div>
      </div>
    </transition>
    <div v-if="playlistShow" @click="togglePlaylistShow" class="playlist-mask"></div>
    <transition name="playlist">
      <scroll v-if="playlistShow" class="playlist-scroll">
        <ul>
          <li v-for="(item, index) in playList" :key="index" @click="addToPlay(index)">
            <p>
              {{item.name}} -
              <span
                class="artists-name"
                v-for="(arItem, arIndex) in item.ar"
                :key="arIndex"
              >{{arItem.name}}</span>
            </p>
            <i class="iconfont icon-shanchu2" @click.stop="delFromPlayList(item)"></i>
          </li>
        </ul>
        <div class="close" @click="togglePlaylistShow">关闭</div>
      </scroll>
    </transition>
    <audio :src="musicData.url" ref="audio" @ended="end" @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { playMode } from '../common/js/aliasConfig'
import axios from 'axios'
import Scroll from './scroll'
export default {
  components: {
    Scroll
  },
  data () {
    return {
      swiperOption: {
        loop: true,
        // autoplay: {
        //   disableOnInteraction: false
        // },
        pagination: {
          el: '.swiper-pagination'
        }
      },
      musicData: [], // 歌曲地址
      lyricData: null, // 歌词地址
      playing: false, // 控制播放暂停
      currentTime: 0, // 歌曲当前时长
      overTime: 0, // 总时长
      touchBarWillMove: false, // 移动进度条
      lyricLines: [], // 初始新的歌词
      currentLineNumber: 0, // 当前歌词列的索引
      playlistShow: false
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList',
      'sequencesList',
      'currentIndex',
      'mode',
      'currentSong',
      'isLove'
    ]
    ),
    songName () {
      return this.currentSong ? this.currentSong.name : '暂无播放歌曲'
    },
    songArtists () {
      return this.currentSong ? this.currentSong.ar : []
    },
    songImg () {
      return this.currentSong && this.currentSong.al.picUrl ? `${this.currentSong.al.picUrl}?param=400y400` : require('../assets/image/user-bg.png')
    },
    // 暂停播放样式
    playIcon () {
      return this.playing ? 'icon-bofang' : 'icon-zanting'
    },
    // 播放模式样式
    modeIcon () {
      return this.mode === playMode.sequence ? 'icon-liebiaoxunhuan' : (this.mode === playMode.loop ? 'icon-danquxunhuan' : 'icon-suiji')
    },
    // 进度条宽度
    barPercent () {
      let p = this.currentTime / this.overTime
      if (p === 0) {
        return 0
      }
      p = Number(p * 100).toFixed()
      return `${p}%`
    },
    rotateStop () {
      return this.playing ? '' : 'rotate-stop'
    }
  },
  // 监视当前歌曲是否改变，并重新获取歌曲播放的地址和歌词的地址
  watch: {
    currentSong (newVal, oldVal) {
      if (oldVal === undefined || newVal.id !== oldVal.id) {
        this.getMusicUrl(newVal.id)
        this.getLyricUrl(newVal.id)
      }
    }
  },
  methods: {
    ...mapMutations([
      'SET_FULLSCREEN',
      'SET_PLAY_LIST',
      'SET_SEQUENCE_LIST',
      'SET_CURRENT_INDEX',
      'SET_MODE',
      'DEL_FROM_PLAY_LIST',
      'SET_HISTORY_LIST',
      'SET_LOVE_LIST',
      'DEL_FROM_LOVE_LIST'
    ]),
    // 是否全屏
    toggleShow (val) {
      this.SET_FULLSCREEN(val)
    },
    // 获取歌曲播放的地址
    async getMusicUrl (id) {
      const { data } = await axios.get(`/api/song/url?id=${id}`)
      if (data.code === 200 && data.data[0].code === 200) {
        this.musicData = data.data[0]
        this.$nextTick(() => {
          this.togglePlay(true)
          this.SET_HISTORY_LIST(this.currentSong)
        })
      }
    },
    // 获取歌词的地址
    async getLyricUrl (id) {
      const { data } = await axios.get(`/api/lyric?id=${id}`)
      if (data.code === 200 && data.lrc) {
        this.lyricData = data.lrc.lyric
        // console.log(this.lyricData)
        // 初始化歌词数据
        this.initLines()
      }
    },
    // 控制播放暂停
    togglePlay (val) {
      if (!this.currentSong) return
      if (val === true || val === false) {
        this.playing = val
      } else {
        this.playing = !this.playing
      }
      const audio = this.$refs.audio
      if (this.playing) {
        audio.play()
      } else {
        audio.pause()
      }
    },
    // 上一首
    prev () {
      const len = this.playList.length
      let newIndex = this.currentIndex - 1
      if (newIndex < 0) {
        newIndex = len - 1
      }
      this.SET_CURRENT_INDEX(newIndex)
    },
    // 下一首
    next () {
      const len = this.playList.length
      let newIndex = this.currentIndex + 1
      if (newIndex === len) {
        newIndex = 0
      }
      this.SET_CURRENT_INDEX(newIndex)
    },
    // 改变播放模式
    changeMode () {
      const modeNumber = (this.mode + 1) % 3
      this.SET_MODE(modeNumber)
      // console.log(modeNumber)
      let newPlayList = []
      if (this.mode === playMode.random) {
        newPlayList = this.getRandomList(this.sequencesList)
      } else {
        newPlayList = this.sequencesList
      }
      const newIndex = newPlayList.findIndex(item => item.id === this.currentSong.id)
      this.SET_PLAY_LIST(newPlayList)
      this.SET_CURRENT_INDEX(newIndex)
    },
    // 生成随机播放列表
    getRandomList (arr) {
      const newArr = [].concat(arr)
      return newArr.sort((a, b) => (Math.random() > 0.5 ? -1 : 1))
    },
    // 歌曲结束时是否循环播放
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // 循环
    loop () {
      const audio = this.$refs.audio
      audio.currentTime = 0
      audio.play()
    },
    // 获取歌曲的时长
    updateTime (e) {
      if (!this.touchBarWillMove) {
        this.currentTime = e.target.currentTime
        this.overTime = e.target.duration
      }
      if (this.lyricData) {
        this.moveLyric()
      }
    },
    // 格式化歌曲时间
    formatTime (val) {
      if (isNaN(val)) {
        return '00: 00'
      }
      let m = Math.floor(val / 60)
      let s = Math.floor(val % 60)
      if (m < 10) {
        m = '0' + m
      }
      if (s < 10) {
        s = '0' + s
      }
      return m + ':' + s
    },
    // 移动进度条
    progressMove (e) {
      this.touchBarWillMove = true
      const pageX = e.touches[0].pageX
      this.calcPercent(pageX)
    },
    calcPercent (x) {
      const offsetLeft = this.$refs.progressBar.offsetLeft
      const barWidth = this.$refs.progressBar.clientWidth
      let movedWidth = x - offsetLeft
      if (movedWidth > barWidth) { movedWidth = barWidth }
      if (movedWidth < 0) { movedWidth = 0 }
      const p = movedWidth / barWidth
      this.currentTime = this.overTime * p
      this.moveLyric()
    },
    // 停止移动进度条
    progressEnd () {
      this.resetPlayer()
    },
    resetPlayer () {
      this.$refs.audio.currentTime = this.currentTime
      this.togglePlay(true)
      this.touchBarWillMove = false
    },
    // 点击滚动条
    progressClick (e) {
      this.touchBarWillMove = true
      const pageX = e.pageX
      this.calcPercent(pageX)
      this.resetPlayer()
    },
    // 处理歌词
    initLines () {
      this.lyricLines = []
      if (this.lyricData) {
        const lines = this.lyricData.split('\n')
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          const timeExp = /\[(\d{2}):(\d{2}\.\d{2,3})\]/g
          const result = timeExp.exec(line)
          // console.log(result)
          if (result) {
            const time = Number(result[1] * 60 * 1000) + Number(result[2] * 1000)
            const txt = line.replace(timeExp, '').trim()
            this.lyricLines.push({
              time,
              txt
            })
          }
        }
      }
    },
    // 歌词移动
    moveLyric () {
      this.currentLineNumber = this.findCurrentNumber(this.currentTime * 1000)
      // console.log(this.currentTime, this.currentLineNumber)
      if (this.currentLineNumber > 6) {
        this.$refs.lyricScroll.scrollToElement(this.$refs.lyricLine[this.currentLineNumber - 6], 1000)
      } else {
        this.$refs.lyricScroll.scrollTo(0, 0, 1000)
      }
    },
    findCurrentNumber (time) {
      for (let i = 0; i < this.lyricLines.length; i += 1) {
        if (time < this.lyricLines[i].time) {
          return i - 1
        }
      }
      return this.lyricLines.length - 1
    },
    togglePlaylistShow () {
      this.playlistShow = !this.playlistShow
    },
    addToPlay (index) {
      this.SET_CURRENT_INDEX(index)
      this.togglePlaylistShow()
    },
    delFromPlayList (item) {
      this.DEL_FROM_PLAY_LIST({
        delSong: item,
        curSong: this.currentSong
      })
    },
    // 添加到收藏
    addToLove () {
      if (this.isLove) {
        this.DEL_FROM_LOVE_LIST(this.currentSong)
      } else {
        this.SET_LOVE_LIST(this.currentSong)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.mini-player {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background: #150a06;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding: px2rem(10) px2rem(30) px2rem(10) px2rem(20);
  .player-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    .player-img {
      width: px2rem(80);
      height: px2rem(80);
      flex-shrink: 0;
      border-radius: 50%;
      border: px2rem(4) solid #695945;
      margin-right: px2rem(20);
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .player-name {
      font-size: px2rem(26);
      margin-bottom: px2rem(10);
      line-height: px2rem(30);
    }
    .player-artist {
      font-size: px2rem(20);
      color: #b2b2b2;
    }
  }
  .player-operate {
    i {
      font-size: px2rem(65);
      color: #c9c3c1;
    }
    .icon-zanting,
    .icon-bofang {
      margin-right: px2rem(50);
    }
  }
  .mini-progress {
    height: px2rem(6);
    background: #f2353c;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
.player {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  color: white;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  overflow: hidden;
  &:after {
    content: "";
    background: inherit;
    position: absolute;
    filter: blur(px2rem(20));
    left: px2rem(-40);
    top: px2rem(-40);
    width: calc(100% + #{px2rem(80)});
    height: calc(100% + #{px2rem(80)});
    z-index: -2;
  }
  .player-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.5;
    z-index: -1;
  }
  .player-header {
    height: px2rem(60);
    padding: px2rem(30);
    i {
      font-size: px2rem(46);
      position: absolute;
      left: px2rem(30);
      top: px2rem(30);
    }
    .header-info {
      width: 70%;
      margin: 0 auto;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: px2rem(30);
      .header-artist {
        font-size: px2rem(18);
        color: #b2b2b2;
        margin-top: px2rem(12);
      }
    }
  }
  .swiper-container {
    width: 100%;
    height: calc(100% - #{px2rem(360)});
    .img-container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      img {
        width: px2rem(500);
        height: px2rem(500);
        border-radius: 50%;
        border: px2rem(20) solid #2b433c;
      }
      i {
        position: absolute;
        left: px2rem(30);
        bottom: px2rem(30);
        font-size: px2rem(50);
        color: #c4b9bb;
      }
    }
    .lyric-container {
      height: 100%;
      box-sizing: border-box;
      padding: px2rem(30) px2rem(30) px2rem(70) px2rem(30);
      //overflow: hidden;
      .lyric-scroll {
        height: 100%;
        width: 100%;
        color: white;
        overflow: hidden;
        text-align: center;
        .list-item {
          font-size: px2rem(24);
          line-height: px2rem(36);
          min-height: px2rem(50);
          opacity: 0.5;

          &.active {
            opacity: 1;
          }
        }
      }
    }
  }
  .player-operate {
    width: 100%;
    height: px2rem(300);
    position: relative;
    .operate-mask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.1);
      z-index: -1;
    }
    .progress {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: px2rem(30);
      height: px2rem(50);
      .time {
        width: px2rem(60);
        font-size: px2rem(24);
      }
      .progress-bar {
        width: px2rem(560);
        height: px2rem(4);
        background-color: #7e7374;
        position: relative;
        margin: 0 px2rem(30);
        .bar-moved {
          position: absolute;
          left: 0;
          top: 0;
          height: px2rem(4);
          background-color: #f2353c;
        }
        .bar-btn {
          position: absolute;
          top: 0;
          width: px2rem(20);
          height: px2rem(20);
          border-radius: 50%;
          background-color: white;
          border: px2rem(5) solid #5d5759;
          transform: translate3d(-50%, -50%, 0);
        }
      }
    }
    .operate-icon {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 px2rem(30);
      color: #c4b9bb;
      .ft-40 {
        font-size: px2rem(40);
      }

      .ft-80 {
        font-size: px2rem(80);
      }

      .ft-100 {
        font-size: px2rem(100);
      }
    }
  }
}
.playlist-scroll {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: px2rem(800);
  overflow: hidden;
  z-index: 99999;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: px2rem(10) px2rem(10) 0 0;

  ul {
    padding-bottom: px2rem(80);

    li {
      padding: px2rem(30) px2rem(20);
      font-size: px2rem(24);
      border-bottom: px2rem(1) solid #e6e6e6;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .artists-name {
      font-size: px2rem(18);
      color: #b3b3b3;
    }

    i {
      font-size: px2rem(24);
      color: lightgray;
    }
  }

  .close {
    line-height: px2rem(80);
    font-size: px2rem(30);
    color: #333;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-top: px2rem(1) solid #e6e6e6;
    background-color: white;
  }
}

.playlist-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.4);
}

.playlist-enter-active,
.playlist-leave-active {
  transition: all 0.3s;
}

.playlist-enter,
.playlist-leave-to {
  transform: translate3d(0, 100%, 0);
}
.player-enter-active,
.player-leave-active {
  transition: all 1s;
  opacity: 1;

  .player-header,
  .player-operate {
    transform: translate3d(0, 0, 0);
    transition: all 0.3s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
}

.player-enter,
.player-leave-to {
  opacity: 0;

  .player-header {
    transform: translate3d(0, px2rem(-100), 0);
  }

  .player-operate {
    transform: translate3d(0, px2rem(100), 0);
  }
}
.rotate {
  animation: rotate 30s linear infinite;
}
.rotate-stop {
  animation-play-state: paused;
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
