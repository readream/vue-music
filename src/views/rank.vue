<template>
  <div>
    <div class="rank" v-if="officeList.length">
      <m-header>排行榜</m-header>
      <scroll class="page">
        <div class="rank-wrapper">
          <div class="offical">
            <p class="rank-title">官方榜</p>
            <ul class="offical-list">
              <li
                class="list"
                v-for="(item,index) in officeList"
                :key="index"
                @click="goRankInfo(item.id)"
              >
                <img v-lazy="`${item.coverImgUrl}?param=400y400`" alt />
                <ul>
                  <li
                    class="list-txt"
                    v-for="(listItem,index) in item.tracks"
                    :key="index"
                  >{{index+1}}.{{listItem.first}}-{{listItem.second}}</li>
                </ul>
                <i class="iconfont icon-zanting"></i>
              </li>
            </ul>
          </div>
          <div class="recommend">
            <p class="rank-title">推荐榜</p>
            <ul class="rank-list">
              <li v-for="(item,index) in recommendList" :key="index" @click="goRankInfo(item.id)">
                <img v-lazy="`${item.coverImgUrl}?param=400y400`" alt />
                <p>{{item.name}}</p>
                <i class="iconfont icon-zanting"></i>
              </li>
            </ul>
          </div>
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
import Scroll from '../components/scroll'
import axios from 'axios'
import loading from '../components/loading'
export default {
  components: {
    mHeader,
    Scroll,
    loading
  },
  data () {
    return {
      officeList: [],
      recommendList: []
    }
  },
  created () {
    this.getTopList()
  },
  methods: {
    async getTopList () {
      const { data } = await axios.get('/api/toplist/detail')
      this.officeList = data.list.slice(0, 4)
      this.recommendList = data.list.slice(4, data.list.length)
      // console.log(this.officeList)
      // console.log(this.recommendList)
    },
    goRankInfo (id) {
      this.$router.push({
        name: 'rankInfo',
        params: {
          id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.rank-title {
  padding: px2rem(30) px2rem(0) px2rem(10) px2rem(20);
  font-size: px2rem(26);
}
.offical-list {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  .list {
    padding: px2rem(30) px2rem(20);
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    img {
      width: px2rem(200);
      height: px2rem(200);
      display: block;
      margin-right: px2rem(50);
      border-radius: px2rem(10);
    }
    ul {
      .list-txt {
        font-size: px2rem(22);
        color: #808080;
        padding-bottom: px2rem(20);
      }
    }
    i {
      position: absolute;
      font-size: px2rem(50);
      color: #808080;
      right: px2rem(20);
      top: px2rem(30);
    }
  }
}
.rank-list {
  background: #fff;
  padding: px2rem(30) px2rem(20);
  li {
    position: relative;
    display: inline-block;
    width: px2rem(220);
    margin-right: px2rem(25);
    margin-bottom: px2rem(40);
    color: #333;
    vertical-align: top;
    line-height: 1.5;

    &:nth-child(3n) {
      margin-right: 0;
    }

    img {
      width: 100%;
      margin-bottom: px2rem(15);
      border-radius: px2rem(10);
    }
    p {
      font-size: px2rem(24);
      color: #333;
    }
    i {
      position: absolute;
      top: px2rem(150);
      right: px2rem(20);
      color: white;
      font-size: px2rem(40);
    }
  }
}
</style>
