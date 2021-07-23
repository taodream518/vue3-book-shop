import { request } from "./request";

// 添加购物车
export function addCart(data) {
  return request({
    url: "/api/carts",
    method: "post",
    data
  });
}

// 删除购物车
export function deleteCart(id) {
  return request({
    url: `/api/carts/${id}`,
    method: "delete"
  });
}

// 修改购物车 商品id data={num: 1}
export function modifyCart(id, data) {
  return request({
    url: `/api/carts/${id}`,
    method: "put",
    data
  });
}

// 改变购物车商品状态 data为所有选中的商品id
export function checkedCart(data) {
  return request({
    url: "/api/carts/checked",
    method: "patch",
    data
  });
}

// 获取购物车商品列表 includeGoods数据中是否包含goods商品信息
export function getCartList(includeGoods = false) {
  return request({
    url: includeGoods ? `/api/carts?include=goods` : `/api/carts`
  });
}
