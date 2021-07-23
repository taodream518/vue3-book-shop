<template>
  <div class="recommend">
    <div class="recommend-item" v-for="(item, index) in recommends.slice(0, 4)" :key="item.id">
      <a @click.prevent="go(item.id)">
        <img v-lazy="item.cover_url" />
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "Recommend",
  props: {
    recommends: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const router = useRouter();

    // 跳转方法
    const go = id => {
      router.push({
        path: "/detail",
        query: {
          id
        }
      });
    };

    return {
      go
    };
  }
};
</script>

<style lang="scss" scoped>
.recommend {
  width: 100%;
  display: flex;
  text-align: center;
  padding: 15px 0;
  border-bottom: 10px solid #eee;
  font-size: 12px;

  &-item {
    flex: 1;

    img {
      width: 70px;
      height: 70px;
      margin-bottom: 10px;
    }
  }
}
</style>