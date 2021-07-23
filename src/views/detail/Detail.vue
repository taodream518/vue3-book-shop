<template>
  <div class="detail">
    <nav-bar>
      <template v-slot:default>商品详情</template>
    </nav-bar>

    <div class="content">
      <!-- 大图 -->
      <van-image class="cover" lazy-load :src="detail.cover_url" />
      <!-- 商品信息 -->
      <van-card
        class="goods-card"
        :thumb="detail.cover_url"
        :desc="detail.description"
        :title="detail.title"
      >
        <template #price>
          <strong style="font-size: 16px; color: #ee0a24">
            <small>￥</small>
            {{detail.price + '.00'}}
          </strong>
        </template>
        <template #tags>
          <van-tag plain type="success" v-if="detail.is_on == 1">新书</van-tag>
          <van-tag plain type="danger" v-if="detail.is_recommend == 1">推荐</van-tag>
        </template>
        <template #num>
          <span>库存：{{detail.stock}}</span>
        </template>
      </van-card>

      <!-- 标签页 -->
      <van-tabs v-model="active" sticky :offset-top="45" swipeable color="#42b983">
        <van-tab title="详情">
          <div class="info" v-html="detail.details"></div>
        </van-tab>
        <van-tab title="评论">
          <div class="comment" v-if="detail.comments.length">
            <div class="comment-item" v-for="(item,index) in detail.comments" :key="index"></div>
          </div>

          <van-empty v-else description="暂无评论" />
        </van-tab>
        <van-tab title="推荐">
          <goods-list :goods="like_goods"></goods-list>
        </van-tab>
      </van-tabs>

      <!-- 底部栏 -->
      <van-action-bar style="z-index: 9">
        <van-action-bar-icon icon="chat-o" text="客服" color="#ee0a24" />
        <van-action-bar-icon
          icon="cart-o"
          text="购物车"
          v-if="$store.state.cart.count"
          :badge="$store.state.cart.count"
          to="/shopcart"
        />
        <van-action-bar-icon icon="cart-o" text="购物车" v-else to="/shopcart" />
        <van-action-bar-icon icon="star" text="已收藏" color="#ff5000" />
        <van-action-bar-button type="warning" text="加入购物车" @click="handleAddToCart" />
        <van-action-bar-button type="danger" text="立即购买" @click="handleToBuy" />
      </van-action-bar>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { ref, toRefs, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { Toast } from "vant";
import { getDetail } from "network/detail";
import { addCart } from "network/cart";

import NavBar from "components/common/navbar/NavBar";
import GoodsList from "components/content/goods/GoodsList";

export default {
  name: "Detail",
  components: {
    NavBar,
    GoodsList
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const id = ref(0);
    const active = ref(0);

    const book = reactive({
      detail: {
        price: 0,
        stock: 0,
        comments: []
      },
      like_goods: []
    });

    onMounted(() => {
      id.value = route.query.id;
      getDetail(id.value).then(res => {
        book.detail = res.goods;
        book.like_goods = res.like_goods;
      });
    });

    // 加入购物车的点击事件
    const handleAddToCart = () => {
      addCart({ goods_id: book.detail.id, num: 1 }).then(res => {
        if (res.status == 201 || res.status == 204) {
          store.dispatch("updateCart"); // 调用vuex更新购物车数量
          setTimeout(() => {
            Toast.success("添加成功");
          });
        }
      });
    };

    // 立即购买的点击事件
    const handleToBuy = () => {
      addCart({ goods_id: book.detail.id, num: 1 }).then(res => {
        if (res.status == 201 || res.status == 204) {
          store.dispatch("updateCart"); // 调用vuex更新购物车数量
          router.push({ path: "/shopcart" });
        }
      });
    };

    return {
      id,
      active,
      handleAddToCart,
      handleToBuy,
      ...toRefs(book)
    };
  }
};
</script>

<style lang="scss">
.detail {
  .content {
    padding: 50px 0;

    .cover {
      width: 100%;
      overflow: hidden;
    }

    .info {
      padding: 10px;
      img {
        max-width: 100% !important;
        height: auto;
      }
    }

    .goods-card {
      border-bottom: 10px solid #f6f6f6;
      border-top: 10px solid #f6f6f6;
      background: #fff;
    }
  }
}
</style>