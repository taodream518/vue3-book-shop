import { request } from "./request";

// 获取收藏列表
export function getCollectList(params) {
  return request({
    url: `/api/collects`,
    params
  });
}

// 收藏/取消收藏 商品id
export function updateCollect(goods) {
  return request({
    url: `/api/collects/goods/${goods}`,
    method: "post"
  });
}
