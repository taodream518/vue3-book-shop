<template>
  <div class="register">
    <nav-bar>
      <template v-slot:default>用户注册</template>
    </nav-bar>

    <div class="content">
      <van-image class="logo" lazy-load :src="require('assets/images/logo.jpg')" />

      <van-form @submit="onSubmit">
        <van-field
          v-model="name"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="password_confirmation"
          type="password"
          name="确认密码"
          label="确认密码"
          placeholder="确认密码"
          :rules="[{ required: true, message: '请填写确认密码' }]"
        />
        <van-field
          v-model="email"
          name="邮箱"
          label="邮箱"
          placeholder="邮箱"
          :rules="[{ required: true, message: '请填写电子邮箱' }]"
        />
        <div style="margin: 16px;">
          <div class="link" @click="$router.push('/login')">已有账号?去登录</div>
          <van-button round block type="success" native-type="submit">注册</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { ref, toRefs, reactive } from "vue";
import { useRouter } from "vue-router";
import { register } from "network/user";

import { Notify, Toast } from "vant";

export default {
  name: "Login",
  components: {
    NavBar
  },
  setup() {
    const router = useRouter();
    const userInfo = reactive({
      name: "",
      password: "",
      password_confirmation: "",
      email: ""
    });

    const onSubmit = () => {
      // 1.先验证
      if (userInfo.password != userInfo.password_confirmation) {
        Notify({ type: "warning", message: "两次密码不一致" });
        return;
      }
      // 2.再提交给服务器
      register(userInfo).then(res => {
        if (res.status == 201) {
          Toast.success("注册成功");
          setTimeout(() => {
            router.push({ path: "/login" });
          }, 1000);
        }
      });

      // 3.清空信息
      userInfo.password = "";
      userInfo.password_confirmation = "";
    };

    return {
      ...toRefs(userInfo),
      onSubmit
    };
  }
};
</script>

<style lang="scss" scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  bottom: 50px;
  .content {
    width: 92%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .logo {
      width: 180px;
      height: 180px;
      padding: 10px;
    }
    .link {
      float: left;
      font-size: 14px;
      margin-bottom: 15px;
      color: #42b983;
    }
  }
}
</style>