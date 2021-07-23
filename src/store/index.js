import { createStore } from "vuex";
import { getItem } from "utils/storage";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const state = {
  user: {
    isLogin: getItem("token") ? true : false
  },
  cart: {
    count: 0
  }
};

export default createStore({
  state,
  getters,
  mutations,
  actions
});
