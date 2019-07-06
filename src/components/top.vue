<template>
  <div>
    <div class="top" :style="{'backgroundImage': `url(${img}?param=400y400)`}">
      <m-header :red="false">{{title}}</m-header>
      <img :src="`${img}?param=400y400`" alt />
    </div>
    <count>{{count}}</count>
  </div>
</template>

<script>
import mHeader from '../components/m-header'
import count from '../components/count'

export default {
  components: {
    mHeader,
    count
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.top {
  position: relative;
  width: 100%;
  height: px2rem(300);
  left: 0;
  top: 0;
  right: 0;
  background-size: 100% 100%;
  &:after {
    content: "";
    width: calc(100% + #{px2rem(40)});
    height: calc(100% + #{px2rem(40)});
    position: absolute;
    left: px2rem(-40);
    top: px2rem(-40);
    background: inherit;
    filter: blur(px2rem(20));
  }
  img {
    width: px2rem(120);
    height: px2rem(120);
    border: px2rem(10) solid #9e8d7f;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 60%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 1;
  }
}
</style>
