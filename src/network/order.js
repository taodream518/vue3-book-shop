import { request } from "./request";

// 获取订单列表 { page: 1, status: 2, include: 'goods,user,orderDetail.goods' }
export function getOrderList(params) {
  return request({
    url: `/api/orders`,
    params
  });
}

// 获取订单详情 订单id params = { include: 'user, orderDetails.goods' }
export function getOrder(id, isInclude = true) {
  return request({
    url: `/api/orders/${id}`,
    params: isInclude ? { include: "user,orderDetails.goods" } : {}
  });
}

// 创建订单 params = { address_id: 0 }
export function createOrder(params) {
  return request({
    url: `/api/orders`,
    method: "post",
    params
  });
}

// 订单预览
export function getOrderPreview() {
  return request({
    url: `/api/orders/preview`
  });
}

// 订单支付,获取二维码 订单id
export function getPayOrder(id, params) {
  return request({
    url: `/api/orders/${id}/pay`,
    params
  });
}

// 订单支付状态
export function getPayOrderStatus(id) {
  return request({
    url: `/api/orders/${id}/status`
  });
}

// 确认订单
export function confirmOrder(id) {
  return request({
    url: `/api/orders/${id}/confirm`,
    method: "patch"
  });
}

// 获取物流信息
export function getExpress(id) {
  return request({
    url: `/api/orders/${id}/express`
  });
}