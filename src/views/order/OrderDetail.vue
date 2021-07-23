<template>
  <div class="order">
    <nav-bar>
      <template v-slot:default>订单详情</template>
    </nav-bar>
    <div class="content">
      <div class="order-info">
        <h4 class="title">订单信息</h4>
        <div class="desc">
          <div>
            <span class="label">订单状态:</span>
            <span>{{orderStatus}}</span>
          </div>
          <div>
            <span class="label">订单编号:</span>
            <input
              id="order_num"
              style="background: transparent;border: none;"
              readonly="readonly"
              :value="detail.order_no"
            />
            <van-button plain size="mini" @click="onCopy">复制</van-button>
          </div>
          <div>
            <span class="label">创建时间:</span>
            <span>{{detail.created_at}}</span>
          </div>

          <div>
            <span class="label">配送方式:</span>
            <span>普通快递</span>
          </div>

          <div>
            <span class="label">商品金额:</span>
            <span style="color: #f00">
              <small>￥</small>
              {{`${totalPrice}.00`}}
            </span>
          </div>
        </div>
        <div class="btn">
          <van-button
            class="mt10"
            block
            v-if="detail.status == 1"
            @click="showPay"
            type="success"
          >去支付</van-button>
          <van-button class="mt10" block v-if="detail.status == 2" @click="handleConfirmOrder">确认订单</van-button>
        </div>
      </div>
      <div class="goods-info mt10">
        <van-card
          style="background: #fff"
          v-for="(item, index) in detail.orderDetails.data"
          :key="index"
          :origin-price="`${item.price * 1.5}`"
          :price="`${item.price}.00`"
          :thumb="item.goods.cover_url"
        >
          <template #title>
            <h5>{{item.goods.title}}</h5>
          </template>
          <template #num>
            <span>数量: x{{item.num}}</span>
          </template>
        </van-card>
      </div>
    </div>

    <van-popup
      v-model:show="isShowPay"
      closeable
      round
      position="bottom"
      :style="{ height: '35%' }"
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
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import { ref, toRefs, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getOrder,
  getPayOrder,
  getPayOrderStatus,
  confirmOrder
} from "network/order";
import { Toast, Dialog } from "vant";

export default {
  name: "OrderDetail",
  components: {
    NavBar
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      isShowPay: false, // 是否显示支付弹层
      qr_code: {
        aliyun: "",
        wechat: ""
      },
      orderId: 0, // 订单ID
      detail: {
        orderDetails: {
          data: []
        }
      }
    });

    // 数据初始化
    const init = () => {
      const { id } = route.query;
      state.orderId = id;
      getOrder(state.orderId).then(res => {
        state.detail = res;
        console.log(res);
      });
    };

    // 商品总价
    const totalPrice = computed(() => {
      let sum = 0;
      state.detail.orderDetails.data.forEach(item => {
        sum += item.num * item.price;
      });
      return sum;
    });

    // 订单状态
    const orderStatus = computed(() => {
      // 1已下单 2支付 3发货 4收货 5过期
      const statusText = [
        "",
        "已下单",
        "已支付",
        "待收货",
        "确认收货",
        "已取消"
      ];
      return statusText[state.detail.status];
    });

    // 点击复制
    const onCopy = () => {
      const orderNum = document.getElementById("order_num");
      orderNum.select();
      console.log(orderNum);
      document.execCommand("Copy"); // 执行浏览器复制功能
      Toast.success("复制成功");
    };

    // 点击去支付
    const showPay = () => {
      state.isShowPay = true;

      // 支付宝支付
      getPayOrder(state.orderId, { type: "aliyun" }).then(res => {
        state.qr_code.aliyun = res.qr_code_url;
        console.log(res);
      });

      // 轮询支付状态
      let timer = setInterval(() => {
        console.log(555555555);
        getPayOrderStatus(state.orderId).then(res => {
          // 当支付弹出层关闭时,则不轮询
          if (!state.isShowPay) clearInterval(timer);
          if (res == 2) {
            clearInterval(timer);
            state.isShowPay = false;
            router.push({
              path: "/order_detail",
              query: { id: state.orderId }
            });
          }
        });
      }, 3000);
    };

    // 确认订单
    const handleConfirmOrder = () => {
      Dialog.confirm({
        title: "是否确认订单?"
      }).then(() => {
        confirmOrder(state.orderId).then(res => {
          Toast.success("确认成功");
          init();
        });
      });
    };

    // 关闭对话框Dialog
    const close = () => {
      Dialog.close();
    };

    onMounted(() => {
      init();
    });

    return {
      ...toRefs(state),
      orderStatus,
      totalPrice,
      onCopy,
      showPay,
      handleConfirmOrder,
      close
    };
  }
};
</script>

<style lang="scss" scoped>
.mt10 {
  margin-top: 10px;
}
.jc-b {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order {
  background: #f7f8fa;

  .content {
    padding: 50px 0;

    .order-info {
      padding: 10px;
      font-size: 15px;
      .title {
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }

      .desc {
        padding: 8px 0;

        div {
          display: flex;
          align-items: center;
          margin-bottom: 5px;

          .label {
            margin-right: 10px;
          }
        }
      }
    }
  }

  // 支付弹出层标题
  .pay-title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>