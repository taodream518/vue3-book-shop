const mutations = {
  // 设置登录状态
  setIsLogin(state, payload) {
    state.user.isLogin = payload;
  },
  // 设置购物车数量
  setCartCount(state, payload) {
    state.cart.count = payload.count;
  }
};

export default mutations;
