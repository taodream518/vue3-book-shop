<template>
  <div class="shopcart">
    <nav-bar>
      <template v-slot:default>购物车({{$store.state.cart.count}})</template>
    </nav-bar>

    <div class="content">
      <van-checkbox-group v-model="checkedIds" @change="groupChange">
        <van-swipe-cell v-for="item in list" :key="item.goods_id">
          <div class="list-item">
            <van-checkbox class="checked" :name="item.id" checked-color="#42b983"></van-checkbox>
            <van-card
              class="goods-card"
              lazy-load
              :num="item.num"
              :desc="item.goods.description"
              :title="item.goods.title"
              :price="`${item.goods.price}.00`"
              :thumb="item.goods.cover_url"
            >
              <template #num>
                <van-stepper
                  integer
                  :min="1"
                  :max="item.goods.stock"
                  :name="item.id"
                  v-model.number="item.num"
                  async-change
                  @change="onChange"
                />
              </template>
            </van-card>
          </div>

          <template #right>
            <van-button
              square
              text="删除"
              type="danger"
              @click="handleDelete(item.id)"
              style="height: 100%"
            />
            <van-button
              square
              :text="is_collect ? '取消收藏' : '收藏' "
              type="warning"
              @click="handleCollect(item.id)"
              style="height: 100%"
            />
          </template>
        </van-swipe-cell>
      </van-checkbox-group>

      <!-- 空状态 -->
      <van-empty v-if="!list.length" description="购物车空空如也~">
        <van-button round type="success" style="width: 120px" @click="goTo">去购物</van-button>
      </van-empty>
    </div>
    <van-submit-bar
      class="submit-bar"
      :price="totalPrice * 100"
      button-text="去结算"
      @submit="onSubmit"
    >
      <van-checkbox
        @click="handleCheckedAll"
        v-model:checked="checkedAll"
        checked-color="#42b983"
      >全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import { Toast, Dialog } from "vant";
import { ref, toRefs, reactive, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getCartList, modifyCart, deleteCart, checkedCart } from "network/cart";
import { updateCollect } from "network/collect";

export default {
  name: "Shopcart",
  components: {
    NavBar
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    // 购物车数据模型
    const state = reactive({
      is_collect: false, // 是否收藏
      list: [],
      checkedIds: [], // 选中的商品id
      checkedAll: true // 全选
    });

    // 总价格
    const totalPrice = computed(() => {
      let sum = 0;
      state.list
        .filter(item => state.checkedIds.includes(item.id))
        .forEach(item => {
          sum += parseInt(item.goods.price) * parseInt(item.num);
        });
      return sum;
    });

    // 数据初始化
    const init = () => {
      getCartList(true).then(res => {
        // 商品列表
        state.list = res.data;
        // 选中的商品id
        state.checkedIds = res.data
          .filter(item => item.is_checked === 1)
          .map(item => item.id);
      });
    };

    onMounted(() => {
      init();
    });

    // 去购物按钮
    const goTo = () => {
      router.push({ path: "/home" });
    };

    // 异步改变购物车数量
    const onChange = (num, detail) => {
      if (!num) return;
      const id = detail.name;
      modifyCart(id, { num }).then(res => {
        // 同时更新数据模型中的list的数量 (可能有问题)
      });
    };

    // 点击单个复选框change事件
    const groupChange = result => {
      // 关联全选按钮
      if (state.checkedIds.length === state.list.length) {
        state.checkedAll = true;
      } else {
        state.checkedAll = false;
      }

      state.checkedIds = result; // 更改选中数组
      // 请求改变数据表中的选中状态
      checkedCart({ cart_ids: result }).then(res => {
        console.log(res);
      });
    };

    // 全选按钮的点击事件
    const handleCheckedAll = () => {
      // 如果全选没勾选上
      if (!state.checkedAll) {
        state.checkedAll = true; // 勾选
        state.checkedIds = state.list.map(item => item.id);
      } else {
        state.checkedAll = false; // 取消勾选
        state.checkedIds = [];
      }
    };

    // 点击删除按钮事件
    const handleDelete = id => {
      Dialog.confirm({
        title: "提示",
        message: "确认在购物车中删除该商品吗？"
      }).then(() => {
        deleteCart(id).then(res => {
          init(); // 重新获取数据
          store.dispatch("updateCart"); // 更新vuex的状态
          Toast.success("删除成功");
        });
      });
    };

    // 点击收藏按钮事件
    const handleCollect = id => {
      updateCollect(id).then(res => {
        console.log(res);
      });
    };

    // 提交订单
    const onSubmit = () => {
      if (!state.checkedIds.length) {
        Toast.fail("请选中商品进行结算");
        return;
      }

      router.push({ path: "/create_order" });
    };

    return {
      ...toRefs(state),
      onSubmit,
      handleCheckedAll,
      handleDelete,
      handleCollect,
      onChange,
      groupChange,
      totalPrice,
      goTo
    };
  }
};
</script>

<style lang="scss">
.shopcart {
  .content {
    position: fixed;
    left: 0;
    right: 0;
    top: 45px;
    bottom: 100px;
    overflow-y: auto;
    padding-bottom: 10px;

    .list-item {
      display: flex;
      border-bottom: 1px solid #efefef;
      .checked {
        width: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .goods-card {
        flex: 1;
        margin: 0;
        background-color: #fff;
      }
    }
  }

  .submit-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 50px;
    z-index: -1;
  }
}
</style>