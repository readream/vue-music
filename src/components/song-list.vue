<template>
  <div class="song-content">
    <div
      class="song-list"
      v-for="(item,index) in data"
      :key="index"
      @click="handleClick(item,index)"
    >
      <img v-lazy="`${item.al.picUrl}?param=400y400`" alt />
      <div class="info">
        <p class="name">{{item.name}}</p>
        <p class="songs">
          <span v-for="(item,index) in item.ar" :key="index">{{item.name}}</span>
        </p>
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
    handleClick (item, index) {
      this.$emit('clickItem', item, index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.song-list {
  width: 100%;
  margin-right: px2rem(20);
  border-bottom: 1px solid #e6e6e6;
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
