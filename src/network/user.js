import { request } from "./request";

export function register(data) {
  return request({
    url: "/api/auth/register",
    method: "post",
    data
  });
}
export function login(data) {
  return request({
    url: "/api/auth/login",
    method: "post",
    data
  });
}

export function logout() {
  return request({
    url: "/api/auth/logout",
    method: "post"
  });
}

// 获取用户个人信息
export function getUser() {
  return request({
    url: "/api/user",
  });
}
