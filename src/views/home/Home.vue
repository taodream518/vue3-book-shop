<template>
  <div class="home">
    <!-- 顶部导航 -->
    <nav-bar>
      <template v-slot:default>图书商城</template>
    </nav-bar>

    <div class="content">
      <!-- 轮播图 -->
      <home-swiper :banners="banners"></home-swiper>

      <!-- 推荐商品 -->
      <recommend :recommends="recommends"></recommend>

      <!-- 选项卡 -->
      <van-tabs ref="tabs" @click="tabClick" color="#42b983" class="fixed">
        <van-tab title="畅销"></van-tab>
        <van-tab title="新书"></van-tab>
        <van-tab title="精选"></van-tab>
      </van-tabs>

      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多数据"
          @load="onLoad"
        >
          <!-- 商品列表 -->
          <goods-list :goods="showGoods"></goods-list>
        </van-list>
      </van-pull-refresh>
    </div>

    <back-top v-show="isShowBackTop" @bTop="bTop"></back-top>
  </div>
</template>

<script>
import {
  ref,
  toRefs,
  reactive,
  onMounted,
  computed,
  watchEffect,
  nextTick
} from "vue";
import { getHomeAllData, getHomeGoods } from "network/home";

import NavBar from "components/common/navbar/NavBar";
import BackTop from "components/common/backtop/BackTop";
import HomeSwiper from "./ChildComps/HomeSwiper";
import Recommend from "./ChildComps/Recommend";
import GoodsList from "components/content/goods/GoodsList";

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    Recommend,
    GoodsList,
    BackTop
  },

  setup() {
    const state = reactive({
      refreshing: false, // 是否正在刷新
      finished: false, // 数据是否全部加载完毕
      loading: false, // 是否显示加载数据
      isTabFixed: false, // 是否粘性标签栏
      currentTab: "sales", // 当前选中的标签
      hasNextPage: false,
      isShowBackTop: false, // 是否显示返回顶部按钮
      banners: [], // 轮播
      recommends: [], // 商品推荐
      // 商品列表数据模型
      goods: {
        sales: { page: 1, list: [] },
        recommend: { page: 1, list: [] },
        new: { page: 1, list: [] }
      }
    });

    const tabs = ref(null);

    // 当前展示页面的数据
    const showGoods = computed(() => state.goods[state.currentTab].list);

    // 数据初始化
    const init = () => {
      getHomeAllData().then(res => {
        state.banners = res.slides;
        state.recommends = res.goods.data;
      });

      getHomeGoods("sales").then(res => {
        state.goods.sales.list = res.goods.data;
        state.goods.sales.page = 1;
      });
      getHomeGoods("recommend").then(res => {
        state.goods.recommend.list = res.goods.data;
        state.goods.recommend.page = 1;
      });
      getHomeGoods("new").then(res => {
        state.goods.new.list = res.goods.data;
        state.goods.new.page = 1;
      });
    };

    onMounted(() => {
      init();
    });

    // 选项卡的自定义事件
    const tabClick = index => {
      let types = ["sales", "recommend", "new"];
      state.currentTab = types[index];
    };

    // 下拉刷新 数据初始化
    const onRefresh = () => {
      state.finished = false;
      state.refreshing = true; // 正在刷新
      state.loading = true; // 显示加载

      init();

      state.refreshing = false; // 关闭刷新
      state.loading = false; // 隐藏加载
    };

    const onLoad = () => {
      getHomeGoods(state.currentTab, state.goods[state.currentTab].page).then(
        res => {
          state.goods[state.currentTab].list.push(...res.goods.data);
          state.hasNextPage = res.goods.next_page_url ? true : false;

          state.goods[state.currentTab].page += 1;

          state.loading = false; // 关闭加载
          state.refreshing = false; // 关闭刷新

          console.log("当前类型: ", state.currentTab);
          console.log("## page:", state.goods[state.currentTab].page);
          console.log(state.goods);

          if (!state.hasNextPage) {
            state.finished = true;
          }
        }
      );
    };

    // 使用Better-Scroll插件
    // bscroll = new BScroll(document.querySelector(".wrapper"), {
    //   probeType: 3,
    //   click: true, // 允许点击
    //   pullUpLoad: true // 上拉加载更多
    // });

    // 触发滚动事件
    // bscroll.on("scroll", position => {
    //   // console.log(Math.abs(position.y));

    //   state.isTabFixed = Math.abs(position.y) > 50;
    //   state.isShowBackTop = Math.abs(position.y) > 600;
    // });

    // 监听上拉加载更多数据
    //   bscroll.on("pullingUp", () => {
    //     bscroll.refresh(); // 每拉动一次，重新计算conent容器的高度

    //     const page = state.goods[currentType.value].page + 1; // 页数＋1
    //     getHomeGoods(currentType.value, page).then(res => {
    //       state.goods[currentType.value].list.push(...res.goods.data); // 拼接请求回来后的数据
    //       state.goods[currentType.value].page += 1; // 对象页数＋1
    //     });

    //     // 完成上拉，等数据请求完成，将数据展示出来
    //     bscroll.finishPullUp();
    //     // 重新计算高度
    //     bscroll.refresh();

    //     console.log("当前类型：" + currentType.value, "当前页：" + page);
    //   });

    // 回到顶部
    const bTop = () => {
      bscroll.scrollTo(0, 0, 300);
    };

    return {
      ...toRefs(state),
      tabClick,
      bTop,
      showGoods,
      onRefresh,
      onLoad
    };
  }
};
</script>

<style lang="scss" scoped>
.fixed {
  width: 100%;
  position: sticky;
  top: 44px;
  z-index: 10;
}

.home {
  .content {
    margin-top: 45px;
  }
}

.banners img {
  width: 100%;
  height: auto;
}
</style>