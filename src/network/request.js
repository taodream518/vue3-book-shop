import axios from "axios";
import { Notify, Toast } from "vant";
import router from "../router";
import { getItem } from "../utils/storage";

export function request(config) {
  const instance = axios.create({
    baseURL: "https://api.shop.eduwork.cn",
    timeout: 5000
  });

  // 请求拦截
  instance.interceptors.request.use(config => {
    // 显示加载状态
    Toast.loading({ message: "加载中...", forbidClick: true });
    // 如果有一个接口需要认证才可以访问，统一在此设置
    const token = getItem("token");
    token && (config.headers.Authorization = `Bearer ${token}`);
    return config;
  });

  // 响应拦截
  instance.interceptors.response.use(
    res => {
      Toast.clear(); // 清空加载状态
      return res.data ? res.data : res;
    },
    err => {
      Toast.clear(); // 清空加载状态
      const { status, errors } = err.response.data;

      switch (status) {
        // 需要授权才可访问，统一跳转到登录
        case 401:
          Toast.fail("请先登录");
          router.push({ path: "/login" });
          break;

        default:
          // 处理错误，显示错误信息
          Notify({
            type: "warning",
            message: errors[Object.keys(errors)[0]][0]
          });
          break;
      }
    }
  );

  return instance(config);
}
