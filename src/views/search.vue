<template>
  <div class="search">
    <div class="search-header">
      <i class="iconfont icon-chaxun"></i>
      <input
        type="text"
        v-model="keyWord"
        @keyup.enter="searchSongs"
        @focus="toggleResultShow(false)"
      />
      <i class="iconfont icon-shanchu2" v-show="keyWord" @click="clearWord"></i>
      <span class="cancel" @click="goBack">取消</span>
    </div>
    <scroll class="list-container history-list" v-show="!resultShow">
      <ul>
        <li class="list-title" v-if="searchText.length">搜索历史</li>
        <li
          class="list-item history-item"
          v-for="(item,index) in searchText"
          :key="index"
          @click="addToSearch(item)"
        >
          {{item}}
          <i class="iconfont icon-shanchu1" @click.stop="delKeyWrod(item)"></i>
        </li>
        <li class="list-title">热门搜索</li>
        <li
          class="list-item"
          v-for="(item,index) in hotWords"
          :key="`hot-${index}`"
          @click="addToSearch(item.first)"
        >{{item.first}}</li>
      </ul>
    </scroll>
    <div v-show="resultShow">
      <p class="list-count">共有{{resultData.length}}首歌曲</p>
      <scroll class="list-container result-list">
        <ul>
          <li
            class="list-item"
            v-for="(item,index) in resultData"
            :key="index"
            @click="addToPlay(item,index)"
          >
            <p>{{item.name}}</p>
            <p class="artists-name" v-for="(item,index) in item.ar" :key="index">
              <span>{{item.name}}</span>
            </p>
          </li>
        </ul>
      </scroll>
    </div>
  </div>
</template>

<script>
import Scroll from '../components/scroll'
import axios from 'axios'
import { mapGetters, mapMutations } from 'vuex'
import { formatSongDetail } from '../common/js/util'
export default {
  components: {
    Scroll
  },
  data () {
    return {
      resultShow: false,
      hotWords: [],
      keyWord: '',
      resultData: []
    }
  },
  computed: {
    ...mapGetters(['searchText'])
  },
  created () {
    this.searchHotWords()
    this.searchSongs()
  },
  methods: {
    ...mapMutations(
      [
        'SET_SEARCH_TEXT',
        'DEL_SEARCH_TEXT',
        'SET_FULLSCREEN',
        'SET_PLAY_LIST',
        'SET_SEQUENCE_LIST',
        'SET_CURRENT_INDEX'
      ]
    ),
    // 热门搜索
    async searchHotWords () {
      const { data } = await axios.get('/api/search/hot')
      if (data.code === 200) {
        this.hotWords = data.result.hots
        // console.log(this.hotWords)
      }
    },
    // 搜索栏搜索
    async searchSongs () {
      if (!this.keyWord.trim()) {
        return
      }
      const { data } = await axios.get(`/api/search?keywords=${this.keyWord}`)
      if (data.code === 200) {
        this.resultData = formatSongDetail(data.result.songs)
        // console.log(this.resultData)
      }
      this.SET_SEARCH_TEXT(this.keyWord)
      this.toggleResultShow(true)
    },
    toggleResultShow (val) {
      this.resultShow = val
    },
    addToSearch (val) {
      this.keyWord = val
      this.searchSongs()
    },
    clearWord () {
      this.keyWord = ''
      this.toggleResultShow(false)
    },
    goBack () {
      this.$router.go(-1)
    },
    delKeyWrod (val) {
      this.DEL_SEARCH_TEXT(val)
    },
    // 添加到播放
    addToPlay (item, index) {
      this.SET_FULLSCREEN(true)
      this.SET_PLAY_LIST(this.resultData)
      this.SET_SEQUENCE_LIST(this.resultData)
      this.SET_CURRENT_INDEX(index)
    }
  }

}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.search-header {
  padding: px2rem(15) px2rem(30);
  background-color: #f2353c;
  height: px2rem(60);
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;

  input {
    border-radius: px2rem(10);
    height: px2rem(60);
    font-size: px2rem(32);
    color: #999;
    padding-left: px2rem(65);
    flex: 1;
    box-sizing: border-box;
    outline: none;
  }

  .icon-chaxun {
    position: absolute;
    left: px2rem(45);
    top: px2rem(32);
    font-size: px2rem(32);
    color: #999;
  }

  .icon-shanchu2 {
    position: absolute;
    top: px2rem(32);
    right: px2rem(130);
    font-size: px2rem(32);
    color: #999;
  }

  .cancel {
    margin-left: px2rem(30);
    font-size: px2rem(28);
    color: white;
  }
}
.history-list {
  height: calc(100vh - #{px2rem(200)});
}
.list-container {
  overflow: hidden;
  .list-title {
    padding: 0 px2rem(30);
    line-height: px2rem(65);
    font-size: px2rem(24);
    color: #989898;
  }
  .list-item {
    padding: px2rem(30);
    font-size: px2rem(28);
    color: #333;
    background-color: white;
    border-bottom: px2rem(1) solid #e6e6e6;
  }
  .history-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .icon-shanchu1 {
    font-size: px2rem(30);
    color: #999;
  }

  .artists-name {
    margin-top: px2rem(10);
    color: #b2b2b2;
    font-size: px2rem(20);
  }
}
.list-count {
  padding: 0 px2rem(30);
  line-height: px2rem(80);
  font-size: px2rem(26);
  color: #808080;
}
.result-list {
  height: calc(100vh - #{px2rem(280)});
}
</style>
