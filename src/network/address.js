import { request } from "./request";

// 新建地址
export function addAddress(data) {
  return request({
    url: "/api/address",
    method: "post",
    data
  });
}

// 编辑地址
export function editAddress(id, data) {
  return request({
    url: `/api/address/${id}`,
    method: "put",
    data
  });
}

// 地址详情
export function getAddress(id) {
  return request({
    url: `/api/address/${id}`,
    method: "get"
  });
}

// 删除地址
export function deleteAddress(id) {
  return request({
    url: `/api/address/${id}`,
    method: "delete"
  });
}

// 获取地址列表
export function getAddressList() {
  return request({
    url: "/api/address"
  });
}
