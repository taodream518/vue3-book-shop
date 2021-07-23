<template>
  <van-swipe v-if="banners.length" class="swiper" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="(item, index) in banners" :key="index">
      <!-- <img v-lazy="item.img_url" :alt="item.title" /> -->
      <img :src="item.img_url" :alt="item.title" />
    </van-swipe-item>
  </van-swipe>
</template>

<script>
export default {
  name: "HomeSwiper",
  props: {
    banners: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="scss" scoped>
.swiper {
  img {
    width: 100%;
    height: auto;
  }
}
</style>