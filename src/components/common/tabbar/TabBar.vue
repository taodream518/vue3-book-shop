<template>
  <div class="nav" v-show="isShowTabbar">
    <router-link class="tabbar-item" to="/home">
      <div class="icon">
        <i class="iconfont icon-home"></i>
      </div>
      <div>首页</div>
    </router-link>
    <router-link class="tabbar-item" to="/category">
      <div class="icon">
        <i class="iconfont icon-category"></i>
      </div>
      <div>分类</div>
    </router-link>
    <router-link class="tabbar-item" to="/shopcart">
      <div class="icon">
        <van-badge v-if="$store.state.cart.count" :content="$store.state.cart.count" max="50">
          <i class="iconfont icon-shopcart"></i>
        </van-badge>
        <div v-else class="icon">
          <i class="iconfont icon-shopcart"></i>
        </div>
      </div>
      <div>购物车</div>
    </router-link>
    <router-link class="tabbar-item" to="/profile">
      <div class="icon">
        <i class="iconfont icon-profile"></i>
      </div>
      <div>我的</div>
    </router-link>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "TabBar",
  setup() {
    const route = useRoute();
    // 隐藏tabbar组件的路由
    const hideRoutes = ["/detail"];

    const isShowTabbar = computed(() => {
      return hideRoutes.includes(route.path) ? false : true;
    });
    return {
      isShowTabbar
    };
  }
};
</script>

<style lang="scss" scoped>
.nav {
  background: #f6f6f6;
  box-shadow: 0 -2px 1px rgba(100, 100, 100, 0.1);
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  a {
    color: var(--color-text);

    &.router-link-exact-active {
      color: var(--color-high-text);
    }
  }

  .tabbar-item {
    flex: 1;
    text-align: center;
    height: 50px;
    font-size: var(--font-size);

    .icon {
      width: 24px;
      height: 24px;
      margin-top: 5px;
      display: inline-block;
      vertical-align: middle;
    }
  }
}
</style>