<template>
  <div class="profile">
    <nav-bar>
      <template v-slot:default>个人中心</template>
    </nav-bar>

    <div class="content">
      <van-skeleton title avatar avatar-size="80px" :row="3" :loading="loading">
        <div class="user-info">
          <van-image
            class="avatar"
            width="100"
            height="100"
            lazy-load
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="desc">
            <h6>昵称：{{user.name}}</h6>
            <h6>登录名：{{user.email}}</h6>
            <h6>个性签名：{{user.email}}</h6>
          </div>
        </div>

        <div class="list-menu">
          <van-cell icon="setting-o" title="账号管理" is-link @click="goTo('/setting')" />
          <van-cell icon="location-o" title="地址管理" is-link @click="goTo('/address')" />
          <van-cell icon="star-o" title="我的收藏" is-link @click="goTo('/collect')" />
          <van-cell icon="orders-o" title="我的订单" is-link @click="goTo('/order')" />
          <van-cell icon="phone-o" title="关于我们" is-link @click="goTo('/about')" />
        </div>
      </van-skeleton>
      <div class="btn">
        <van-button round block type="success" @click="toLogout">退出登录</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import { ref, toRefs, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Toast } from "vant";

import { logout, getUser } from "network/user";
import { setItem } from "utils/storage";

export default {
  name: "Profile",
  components: {
    NavBar
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const state = reactive({
      loading: true, // 显示骨架屏状态
      user: {
        name: "",
        email: ""
      }
    });

    onMounted(() => {
      getUser().then(res => {
        state.user = res;
        console.log(state.user);
      });

      setTimeout(() => {
        state.loading = false;
      }, 0);
    });

    // 跳转导航
    const goTo = (path, query) => {
      router.push({ path, query: query || {} });
    };

    // 退出登录事件
    const toLogout = () => {
      logout().then(res => {
        if (res.status == 204) {
          Toast.success("退出成功");
          setItem("token", ""); // 清除token
          store.commit("setIsLogin", false); // 设置登录状态
          setTimeout(() => {
            router.push({ path: "/login" });
          }, 1000);
        }
      });
    };

    return {
      ...toRefs(state),
      goTo,
      toLogout
    };
  }
};
</script>

<style lang="scss" scoped>
.profile {
  margin-top: 60px;
  .content {
    .user-info {
      display: flex;
      margin: 15px;
      background: var(--color-tint);
      color: #fff;
      border-radius: 5px;
      overflow: hidden;
      .avatar {
        margin-right: 10px;
      }
      .desc {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }
    }
    .list-menu {
    }

    .btn{
      margin: 16px;
    }
  }
}
</style>