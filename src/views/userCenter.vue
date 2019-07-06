<template>
  <div>
    <div class="user-bg">
      <m-header :red="false">个人中心</m-header>
      <img src="../assets/image/user-bg.png" alt />
      <p>MIKO</p>
    </div>
    <ul class="user-list">
      <li @click="goToPage('/userPlayList')">
        <div class="icon-wrap">
          <i class="iconfont icon-music"></i> 播放列表
        </div>
        <i class="iconfont icon-you"></i>
      </li>
      <li @click="goToPage('/userLoveList')">
        <div class="icon-wrap">
          <i class="iconfont icon-xiai"></i> 我的收藏
        </div>
        <i class="iconfont icon-you"></i>
      </li>
      <li @click="goToPage('/userHistoryList')">
        <div class="icon-wrap">
          <i class="iconfont icon-guangdie"></i> 最近听过
        </div>
        <i class="iconfont icon-you"></i>
      </li>
    </ul>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import mHeader from '../components/m-header'
export default {
  components: {
    mHeader
  },
  methods: {
    goToPage (path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.user-bg {
  position: relative;
  left: 0;
  top: 0;
  right: 0;
  width: 100%;
  height: px2rem(400);
  background-image: url("../assets/image/user-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  text-align: center;
  color: #fff;
  margin-bottom: px2rem(30);

  img {
    width: px2rem(100);
    height: px2rem(100);
    border-radius: 50%;

    margin-top: px2rem(60);
    margin-bottom: px2rem(20);
  }
}
.user-list {
  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: px2rem(100);
    padding: 0 px2rem(30);
    font-size: px2rem(30);
    color: #333;
    background-color: white;
    border-bottom: px2rem(1) solid #e6e6e6;
    margin-bottom: px2rem(20);
    i {
      font-size: px2rem(40);
      color: #ccc;
    }

    .icon-wrap {
      display: flex;
      align-items: center;

      i {
        margin-right: px2rem(20);
      }
    }
  }
}
</style>
