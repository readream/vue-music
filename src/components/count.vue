<template>
  <div class="count">
    共有
    <slot></slot>首歌曲
  </div>
</template>

<script>
export default {
  name: 'count'
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.count {
  height: px2rem(80);
  line-height: px2rem(80);
  font-size: px2rem(26);
  color: #808080;
  padding-left: px2rem(30);
}
</style>
