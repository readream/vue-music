<template>
  <div class="artist-content">
    <div class="artist-list" v-for="(item,index) in data" :key="index" @click="handleClick(item)">
      <img v-lazy="item.picUrl" alt />
      <div class="info">
        <p class="name">{{item.name}}</p>
        <p class="songs">专辑{{item.albumSize}}张,共{{item.musicSize}}首歌</p>
      </div>
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
    handleClick (item) {
      this.$emit('clickItem', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.artist-list {
  width: 100%;
  border-top: 1px solid #e6e6e6;
  margin-right: px2rem(20);
  padding: px2rem(30);
  display: flex;
  flex-direction: row;
  img {
    width: px2rem(80);
    height: px2rem(80);
    margin-right: px2rem(20);
    display: block;
  }
  .info {
    flex: 1;
    .name {
      font-size: px2rem(30);
      color: #000;
      margin-bottom: px2rem(20);
    }
    .songs {
      font-size: px2rem(24);
      color: #b2b2b2;
    }
  }
}
</style>
