<template>
  <div class="order">
    <nav-bar>
      <template v-slot:default>确认订单</template>
    </nav-bar>

    <div class="content">
      <van-skeleton :row="2" :loading="loading">
        <div class="address-info" @click="goTo">
          <div class="contact">
            <div class="name" v-if="addressInfo.name">
              <span>姓 名: {{addressInfo.name}}</span>
              <span>电 话: {{addressInfo.phone}}</span>
            </div>
            <div>地 址: {{addressInfo.province}}{{addressInfo.city}}{{addressInfo.county}}{{addressInfo.address}}</div>
          </div>
          <van-icon class="right-icon" name="arrow" />
        </div>
      </van-skeleton>

      <van-card
        v-for="(item,index) in cartList"
        lazy-load
        :key="index"
        :num="item.num"
        :price="`${item.goods.price}.00`"
        :thumb="item.goods.cover_url"
      >
        <template #title>
          <span style="font-size: 15px">{{item.goods.title}}</span>
        </template>
        <template #num>
          <span>{{ `数量: x${item.num}`}}</span>
        </template>
        <template #price>
          <span style="color: #f00; font-size: 15px">
            <small>￥</small>
            {{`${item.goods.price}.00`}}
          </span>
        </template>
      </van-card>

      <van-submit-bar
        style="bottom: 50px;z-index: 0"
        :price="totalPrice * 100"
        button-text="生成订单"
        @submit="onSubmit"
      >
        <span>共{{totalNum}}件</span>
      </van-submit-bar>

      <van-popup
        v-model:show="isShowPay"
        closeable
        round
        position="bottom"
        :style="{ height: '35%' }"
        @click-close-icon="onClose"
        @click-overlay="isShowPay == false"
      >
        <van-grid :column-num="2">
          <van-grid-item>
            <h6 class="pay-title">
              <van-icon name="alipay" size="24" color="#2857e9" />&nbsp;支付宝支付
            </h6>
            <van-image width="140" height="140" lazy-load :src="qr_code.aliyun" />
          </van-grid-item>
          <van-grid-item>
            <h6 class="pay-title">
              <van-icon name="wechat" size="24" color="#42b983" />&nbsp;微信支付
            </h6>
            <van-image width="140" height="140" lazy-load :src="qr_code.wechat" />
          </van-grid-item>
        </van-grid>
      </van-popup>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import { ref, toRefs, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  getOrderPreview,
  createOrder,
  getPayOrder,
  getPayOrderStatus
} from "network/order";
import { Toast } from "vant";

export default {
  name: "CreateOrder",
  components: {
    NavBar
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const state = reactive({
      loading: true,
      isShowPay: false, // 是否显示支付弹层
      orderId: 0, // 订单ID
      // 支付二维码图片地址
      qr_code: {
        aliyun: "",
        wechat: ""
      },
      totalPrice: 0,
      totalNum: 0,
      cartList: [],
      addressInfo: {}
    });

    onMounted(() => {
      init();
      setTimeout(() => {
        state.loading = false;
      }, 0);
    });

    // 总数量
    state.totalNum = computed(() => {
      return state.cartList
        .map(item => item.num)
        .reduce((pre, cur) => pre + cur, 0);
    });

    // 总价格
    state.totalPrice = computed(() => {
      let sum = 0;
      state.cartList.forEach(item => {
        sum += parseInt(item.num) * parseFloat(item.goods.price);
      });
      return sum;
    });

    const init = () => {
      getOrderPreview().then(res => {
        state.cartList = res.carts;
        const address = res.address.filter(item => item.is_default == 1);
        if (address.length == 0) {
          // 设置初始换数据
          state.addressInfo = {
            address: "尚未设置默认地址,请选择或添加地址"
          };
        } else {
          state.addressInfo = address[0];
        }
        console.log(state);
      });
    };

    // 跳转地址列表页面
    const goTo = () => {
      router.push({ path: "/address" });
    };

    // 关闭按钮
    const onClose = () => {
      router.push({ path: "/order_detail", query: { id: state.orderId } });
    };

    // 生成订单
    const onSubmit = () => {
      if (!state.cartList.length) {
        Toast.fail("请重新添加商品下单");
        return;
      }

      const params = {
        address_id: state.addressInfo.id
      };

      createOrder(params).then(res => {
        Toast.success("创建订单成功");
        store.dispatch("updateCart"); // 更新购物车数据

        state.isShowPay = true;
        state.orderId = res.id; // 订单ID
        state.cartList = [];

        // 支付宝支付
        getPayOrder(state.orderId, { type: "aliyun" }).then(res => {
          state.qr_code.aliyun = res.qr_code_url;
          console.log(res);
        });

        // 微信支付
        // getPayOrder(state.orderId, { type: "wechat" }).then(res => {
        //   state.qr_code.wechat = res.qr_code_url;
        //   console.log(res);
        // });

        // 轮询支付状态
        let timer = setInterval(() => {
          console.log("##### 轮询调用支付状态接口中...#####");
          getPayOrderStatus(state.orderId).then(res => {
            if (!state.isShowPay) clearInterval(timer);
            if (res == 2) {
              clearInterval(timer);
              router.push({
                path: "/order_detail",
                query: { id: state.orderId }
              });
            }
          });
        }, 3000);
      });
    };

    return {
      ...toRefs(state),
      goTo,
      onSubmit,
      onClose
    };
  }
};
</script>

<style lang="scss" scoped>
.order {
  .content {
    margin-top: 55px;
    .address-info {
      padding: 8px 14px;
      font-size: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 8px solid #f6f6f6;

      .contact {
        .name {
          margin-bottom: 5px;
          span {
            margin-right: 10px;
          }
        }
      }
      .right-icon {
        margin-left: 10px;
      }
    }

    .pay-title {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  }
}
</style>