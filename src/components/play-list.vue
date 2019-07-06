<template>
  <div class="recommend-content clearfix">
    <div
      class="recommend-list"
      v-for="(item,index) in data"
      :key="index"
      @click="handleClick(item)"
    >
      <img v-lazy="item.picUrl" alt />
      <p>{{item.name}}</p>
      <i class="iconfont icon-zanting"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array
    }
  },
  methods: {
    handleClick (val) {
      this.$emit('clickItem', val)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.recommend-list {
  width: px2rem(220);
  margin-right: px2rem(25);
  margin-bottom: px2rem(25);
  position: relative;
  float: left;
  &:nth-child(3n) {
    margin-right: 0;
  }
  img {
    width: 100%;
    height: px2rem(220);
    display: block;
    margin-bottom: px2rem(15);
  }
  p {
    width: 100%;
    font-size: px2rem(24);
    color: #333;
    height: px2rem(100);
  }
  i {
    position: absolute;
    right: px2rem(10);
    top: px2rem(170);
    font-size: px2rem(40);
    color: white;
  }
}
</style>
