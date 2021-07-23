<template>
  <div class="category">
    <nav-bar>
      <template v-slot:default>商品分类</template>
    </nav-bar>
    <div class="main">
      <van-collapse class="left-menu" v-model="sliderBar.activeName" accordion>
        <van-collapse-item
          v-for="(item, index) in categories"
          :key="item.index"
          :title="item.name"
          :name="item.name"
        >
          <van-sidebar v-model="sliderBar.activeKey">
            <van-sidebar-item
              v-for="sub in item.children"
              :key="sub.id"
              :title="sub.name"
              @click="getGoods(sub.id)"
            />
          </van-sidebar>
        </van-collapse-item>
      </van-collapse>
      <div class="right-content">
        <div class="order-tab">
          <van-tabs :active="sliderBar.activeOrderIndex" @click="tabOrderClick">
            <van-tab title="销量排序"></van-tab>
            <van-tab title="价格排序"></van-tab>
            <van-tab title="评论排序"></van-tab>
          </van-tabs>
        </div>
        <div class="goods-list wrapper">
          <div class="content">
            <van-card
              v-for="(item, index) in showGoods"
              :key="index"
              :tag="item.sales > 20 ? '热销' : '新品'"
              :desc="item.update_time"
              :title="item.title"
              :thumb="item.cover_url"
              @click="itemClick(item.id)"
            >
              <template #price>
                <span style="color: #f00">
                  <small>￥</small>
                  {{`${item.price}.00`}}
                </span>
              </template>
              <template #num>
                <span>{{`销量: ${item.sales}`}}</span>
              </template>
            </van-card>
          </div>
        </div>
        <!-- <van-empty v-if="!showGoods.length" description="暂无数据" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import {
  ref,
  toRefs,
  reactive,
  onMounted,
  computed,
  watch,
  watchEffect,
  nextTick
} from "vue";
import { useRouter } from "vue-router";
import { getCategory, getCategoryGoods } from "network/category";
import { getSessItem, setSessItem } from "utils/storage";
import BScroll from "better-scroll";
import moment from "moment";

export default {
  name: "Category",
  components: {
    NavBar
  },
  setup(props, { emit }) {
    const router = useRouter();
    let bscroll = reactive({});
    const state = reactive({
      sliderBar: getSessItem("sliderBar") || {
        activeName: "",
        activeKey: 0,
        activeOrderIndex: 0
      },
      currentOrder: "sales", // 当前排序条件
      currentCid: 0, // 当前商品分类Id
      categories: [], // 左侧菜单分类数据模型
      // 商品数据模型
      goods: {
        sales: { page: 1, list: [] },
        price: { page: 1, list: [] },
        comments_count: { page: 1, list: [] }
      }
    });

    //collapse组件的手风琴模式为string 非手风琴模式为 [] => activeName = "" || []
    // 保存当前分类
    watch(
      [
        () => state.sliderBar.activeName,
        () => state.sliderBar.activeKey,
        () => state.sliderBar.activeOrderIndex
      ],
      (newValue, oldValue) => {
        if (newValue[0] != oldValue[0]) {
          state.sliderBar.activeKey = 0;
          state.sliderBar.activeOrderIndex = 0;
        }

        setSessItem("sliderBar", state.sliderBar);
        console.log(newValue, "#######");
        console.log(oldValue, "@@@@@@@@@@@@");
      }
    );

    // 获取数据初始化
    const init = () => {
      getCategoryGoods("sales", state.currentCid).then(res => {
        state.goods.sales.list = res.goods.data;
      });
      getCategoryGoods("price", state.currentCid).then(res => {
        state.goods.price.list = res.goods.data;
      });
      getCategoryGoods("comments_count", state.currentCid).then(res => {
        state.goods.comments_count.list = res.goods.data;
      });
    };

    const showGoods = computed(() =>
      state.goods[state.currentOrder].list.map(item => ({
        ...item,
        update_time: moment(item.update_at).format("YYYY-MM-DD HH:mm:ss")
      }))
    );

    console.log(showGoods);

    // 排序选项卡点击事件
    const tabOrderClick = index => {
      // 保存当前选中排序的标签栏
      state.sliderBar.activeOrderIndex = index;
      const tabOrder = ["sales", "price", "comments_count"];
      state.currentOrder = tabOrder[index];

      // 点击排序选项卡 根据排序条件和商品分类cid 获取商品数据
      getCategoryGoods(state.currentOrder, state.currentCid).then(res => {
        state.goods[state.currentOrder].list = res.goods.data;
      });

      // 点击排序选项卡 重新计算高度
      nextTick(() => {
        bscroll && bscroll.refresh();
      });
      // console.log("当前排序条件是:", state.currentOrder);
      // console.log("当前商品分类Id是:", state.currentCid);
    };

    // 通过cid获取商品数据
    const getGoods = cid => {
      state.currentCid = cid;

      // 点击左侧菜单获取商品数据
      init();
      // console.log("当前排序条件是:", state.currentOrder);
      // console.log("当前商品分类Id是:", state.currentCid);
    };

    onMounted(() => {
      // 获取左侧菜单栏数据
      getCategory().then(res => {
        state.categories = res.categories;
      });

      // 页面进来获取商品数据
      init();

      // 使用Better-Scroll插件
      bscroll = new BScroll(document.querySelector(".wrapper"), {
        probeType: 3,
        click: true, // 允许点击
        pullUpLoad: true // 上拉加载更多
      });

      // 监听上拉加载更多数据
      bscroll.on("pullingUp", () => {
        const page = state.goods[state.currentOrder].page + 1; // 页数＋1
        getCategoryGoods(state.currentOrder, state.currentCid).then(res => {
          state.goods[state.currentOrder].list.push(...res.goods.data); // 拼接请求回来后的数据
          state.goods[state.currentOrder].page += 1; // 对象页数＋1
        });

        // 完成上拉，等数据请求完成，将数据展示出来
        bscroll.finishPullUp();

        // 重新计算高度
        nextTick(() => {
          bscroll && bscroll.refresh();
        });

        console.log(
          "当前排序条件：" + state.currentOrder,
          "当前页：" + state.goods[state.currentOrder].page
        );
      });
    });

    const itemClick = id => {
      router.push({ path: "/detail", query: { id } });
    };

    // 监听任何一变量则触发
    watchEffect(() => {
      nextTick(() => {
        // 重新计算高度
        bscroll && bscroll.refresh();
      });
    });

    return {
      ...toRefs(state),
      bscroll,
      showGoods,
      getGoods,
      tabOrderClick,
      itemClick
    };
  }
};
</script>

<style lang="scss" scoped>
.main {
  position: fixed;
  left: 0;
  right: 0;
  top: 45px;
  bottom: 50px;
  width: 100%;
  display: flex;

  .left-menu {
    width: 130px;
    overflow-y: auto;
    background: #fff;

    .van-sidebar {
      width: 100%;
    }

    .van-sidebar-item {
      white-space: nowrap;
    }
  }

  .right-content {
    flex: 1;
    position: relative;
    z-index: 9;

    .order-tab {
      position: fixed;
      top: 45px;
      right: 0;
      left: 130px;
      height: 45px;
      z-index: 9;
    }
    .goods-list {
      position: fixed;
      box-sizing: border-box;
      left: 130px;
      top: 95px;
      bottom: 50px;
      right: 0;
    }
  }
}
</style>