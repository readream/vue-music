<template>
  <div class="header" :class="{'red': red}">
    <i class="iconfont icon-zuo" @click="goBack"></i>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    red: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.header {
  position: relative;
  width: 100%;
  height: px2rem(90);
  left: 0;
  top: 0;
  right: 0;
  font-size: px2rem(34);
  color: #fefefe;
  text-align: center;
  z-index: 10;
  line-height: px2rem(90);
  &.red {
    background: #f2353c;
  }
  i {
    position: absolute;
    font-size: px2rem(50);
    left: px2rem(20);
  }
}
</style>
