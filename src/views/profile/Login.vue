<template>
  <div class="login">
    <nav-bar>
      <template v-slot:default>用户登录</template>
    </nav-bar>

    <div class="content">
      <van-image class="logo" lazy-load :src="require('assets/images/logo.jpg')" />

      <van-form @submit="onSubmit">
        <van-field
          v-model="email"
          name="邮箱"
          label="邮箱"
          placeholder="请填写邮箱"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="请填写密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px;">
          <div class="link" @click="$router.push('/register')">没有账号?去注册</div>
          <van-button round block type="success" native-type="submit">登录</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import { login } from "network/user";
import { setItem } from "utils/storage";
import { Toast } from "vant";
import { ref, toRefs, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "Login",
  components: {
    NavBar
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const userInfo = reactive({
      email: "",
      password: ""
    });

    const onSubmit = () => {
      login(userInfo)
        .then(res => {
          console.log(res);

          // 1.将token存储到本地
          setItem("token", res.access_token);
          // 2.在vuex中设置登录状态
          store.commit("setIsLogin", true);
          // 3.登录成功提示，清空信息并跳转页面
          Toast.success("登录成功");
          userInfo.email = "";
          userInfo.password = "";

          setTimeout(() => {
            router.go(-1);
          }, 1000);
        })
        .catch(err => {
          console.log(err);
        });
    };

    return {
      ...toRefs(userInfo),
      onSubmit
    };
  }
};
</script>

<style lang="scss" scoped>
.login {
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