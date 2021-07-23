import { request } from "./request";

// 获取商品详情 商品id
export function getDetail(id) {
  return request({
    url: `/api/goods/${id}`
  });
}
