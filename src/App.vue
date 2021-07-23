<template>
  <router-view v-slot="{ Component }">
    <transition>
      <keep-alive exclude="Detail,Shopcart">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>

  <tab-bar></tab-bar>
</template>

<script>
import TabBar from "components/common/tabbar/TabBar";
import { onMounted } from "vue";
import { useStore } from "vuex";
import { getSessItem, setSessItem } from "./utils/storage";

export default {
  components: {
    TabBar
  },
  setup() {
    const store = useStore();
    store.dispatch("updateCart");

    //在页面加载时读取sessionStorage里的状态信息
    if (getSessItem("store")) {
      store.replaceState(Object.assign({}, store.state, getSessItem("store")));
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      //在页面刷新时将vuex里的信息保存到sessionStorage里
      setSessItem("store", store.state);
    });
  }
};
</script>

<style lang="scss">
@import "assets/css/base.css";
@import "assets/css/iconfont.css";
</style>
