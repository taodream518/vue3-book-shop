<template>
  <div class="goods-item">
    <img v-lazy="product.cover_url" />
    <div class="goods-info">
      <p>{{product.title}}</p>
      <span class="price">
        <small>￥</small>
        <span>{{product.price}}.00</span>
      </span>
      <span class="collect">
        <small>{{product.collects_count}}人收藏</small>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    product: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
.goods-item {
  width: 46%;
  padding-bottom: 40px;
  position: relative;

  img {
    width: 100%;
  }

  .goods-info {
    font-size: 14px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
    overflow: hidden;
    text-align: center;

    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 5px;
    }
    .price {
      color: #f00;
      margin-right: 20px;
    }
  }
}
</style>