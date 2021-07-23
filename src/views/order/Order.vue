<template>
  <div class="order">
    <nav-bar>
      <template v-slot:default>我的订单</template>
    </nav-bar>

    <van-tabs ref="tabs" @click="onChangeTab" class="order-tabs">
      <van-tab title="全部"></van-tab>
      <van-tab title="待付款"></van-tab>
      <van-tab title="待发货"></van-tab>
      <van-tab title="待收货"></van-tab>
      <van-tab title="待评价"></van-tab>
    </van-tabs>

    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="order-item" v-for="(item, index) in list" :key="index">
            <div class="order-info">
              <van-cell
                :border="false"
                :title="`订单号: ${item.order_no}`"
                value="查看"
                is-link
                :to="`/order_detail?id=${item.id}`"
              />
              <van-cell :border="false" :title="`创建时间: ${item.created_at}`" />
            </div>
            <van-card
              v-for="(sub, index) in item.orderDetails.data"
              :key="sub.id"
              :num="sub.num"
              :price="`${sub.goods.price}.00`"
              :title="sub.goods.title"
              :thumb="sub.goods.cover_url"
              style="background: #fff"
              lazy-load
            >
              <template #tags>
                <van-tag plain type="danger">七天无理由退换</van-tag>
              </template>
            </van-card>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import { ref, toRefs, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getOrderList } from "network/order";

export default {
  name: "Order",
  components: {
    NavBar
  },
  setup() {
    /**
     * List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
     */

    const router = useRouter();
    const state = reactive({
      list: [], // 订单列表
      loading: false, // 数据加载中
      finished: false, // 表示数据尚未数据加载完毕
      refreshing: false,
      page: 1,
      totalPage: 0,
      status: 0
    });

    onMounted(() => {
      // 初始化
      onRefresh();
    });

    // 获取订单列表接口数据
    const getOrderListData = () => {
      const params = {
        page: state.page,
        status: state.status,
        include: "orderDetails.goods"
      };
      getOrderList(params).then(res => {
        state.list = state.list.concat(res.data);
        state.loading = false;

        console.log("page:", state.page + " ###################");

        state.totalPage = res.meta.pagination.total_pages;
        // 当前页数 >= 总页数 => 数据请求完毕
        if (state.page >= state.totalPage) {
          state.finished = true;
        }
      });
    };

    // tabs标签栏点击切换事件
    const onChangeTab = name => {
      state.status = name;
      onRefresh(); // 重新加载数据
    };

    const onRefresh = () => {
      // 清空列表数据 finished = false 即数据尚未加载完毕
      state.finished = false;

      // 是否处于加载状态,处于加载状态则不触发load事件
      state.refreshing = true;

      // 重新加载数据 loading = true 表示处于加载状态
      state.loading = true;

      // 初始化页数
      state.page = 1;

      onLoad();
    };

    const onLoad = () => {
      console.log(state);

      // 如果数据不是处于加载中 && 当前页数 < 总页数 => 页数+1请求下一页数据
      if (!state.refreshing && state.page < state.totalPage) {
        state.page = state.page + 1;
      }

      if (state.refreshing) {
        state.list = [];
        state.refreshing = false;
      }

      getOrderListData();
    };

    return {
      ...toRefs(state),
      onLoad,
      onRefresh,
      onChangeTab
    };
  }
};
</script>

<style lang="scss" scoped>
.order {
  .order-tabs {
    top: 45px;
    position: fixed;
    z-index: 99;
    width: 100%;
  }
  .content {
    margin-top: 90px;
    .order-item {
      border-bottom: 10px solid #eee;
      padding: 10px;
      background: #ffffff;
      .order-info {
        white-space: nowrap;
        .van-cell {
          padding: 5px;
        }
      }
    }
  }
}
</style>