<template>
  <div class="navbar">
    <div class="left" @click="goBack">
      <slot name="left">
        <img src="~assets/images/left.png" />
      </slot>
    </div>
    <div class="center">
      <slot></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "NavBar",

  setup() {
    // 创建路由器
    const router = useRouter();
    // 返回
    const goBack = () => {
      router.go(-1);
    };

    return {
      goBack
    };
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background: var(--color-tint);
  color: #ffffff;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
  height: 45px;
  line-height: 45px;
  text-align: center;

  .left,
  .right {
    width: 60px;
  }

  .left img {
    width: 45px;
    padding: 10px;
  }

  .center {
    flex: 1;
  }
}
</style>