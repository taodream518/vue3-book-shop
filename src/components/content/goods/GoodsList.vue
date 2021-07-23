<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :key="item" :product="item" @click="itemClick(item.id)"></goods-list-item>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

import GoodsListItem from "./GoodsListItem";

export default {
  name: "GoodsList",
  props: {
    goods: {
      type: Array,
      default: () => []
    }
  },
  components: {
    GoodsListItem
  },
  setup() {
    const router = useRouter();
    const itemClick = id => {
      router.push({ path: "/detail", query: { id } });
    };

    return {
      itemClick
    };
  }
};
</script>

<style lang="scss" scoped>
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 5px;
}
</style>