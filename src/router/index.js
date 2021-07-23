import { createRouter, createWebHashHistory } from "vue-router";
import { Notify } from "vant";
import store from "../store";
import routes from "./routes";

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.isAuth && store.state.user.isLogin === false) {
    Notify("您尚未登录，请先登录！");
    next("/login");
  } else {
    next();
  }
  document.title = "欢迎来到" + to.meta.title;
});

export default router;
