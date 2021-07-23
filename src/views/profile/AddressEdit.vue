<template>
  <div class="address-edit">
    <nav-bar>
      <template v-slot:default>{{title}}</template>
    </nav-bar>

    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      :show-delete="type == 'edit'"
      show-set-default
      show-search-result
      :search-result="searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { ref, toRefs, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Toast } from "vant";

import { areaList } from "utils/area";

import {
  addAddress,
  editAddress,
  getAddress,
  deleteAddress
} from "network/address";

export default {
  name: "AdressEdit",
  components: {
    NavBar
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {}
      },
      searchResult: [],
      addressInfo: {},
      type: "add", // 新增or编辑
      addressId: 0,
      title: "" // 标题
    });

    onMounted(() => {
      state.areaList = areaList;

      // 接收路由参数
      state.type = route.query.type;
      state.addressId = route.query.addressId;

      // 如果编辑地址,则请求地址详情接口
      if (state.type == "edit") {
        getAddress(state.addressId).then(res => {
          state.addressInfo = {
            name: res.name,
            tel: res.phone,
            province: res.province,
            city: res.city,
            county: res.county,
            addressDetail: res.address,
            isDefault: !!res.is_default,
            areaCode: ""
          };

          const { province, city, county } = state.addressInfo;
          const { province_list, city_list, county_list } = state.areaList;
          console.log(province_list);

          Object.entries(county_list).forEach(([id, text]) => {
            if (text == county) {
              console.log(id, text); // 350103 台江区
              for (let key in city_list) {
                if (id.substr(0, 4) == key.substr(0, 4)) {
                  console.log(key, city_list[key]); // 350100 福州市
                  for (let key in province_list) {
                    if (id.substr(0, 2) == key.substr(0, 2)) {
                      state.addressInfo.areaCode = id;
                      console.log(key, province_list[key]); // 350000 福建省
                    }
                  }
                }
              }
            }
          });
        });
      }
    });

    // 利用计算属性判断新增/编辑地址类型
    const title = computed(() =>
      state.type == "add" ? "新增地址" : "编辑地址"
    );
    state.title = title;

    // 保存地址
    const onSave = content => {
      // 构造参数
      const params = {
        name: content.name,
        phone: content.tel,
        province: content.province,
        city: content.city,
        county: content.county,
        address: content.addressDetail,
        is_default: content.isDefault ? 1 : 0
      };

      if (state.type == "edit") {
        // 修改地址
        editAddress(state.addressId, params);
      } else if (state.type == "add") {
        // 新增地址
        addAddress(params);
      }

      Toast.success("保存成功");
      setTimeout(() => {
        router.push("/address");
      }, 1000);
    };

    // 删除地址
    const onDelete = () => {
      deleteAddress(state.addressId).then(res => {
        Toast.success("删除成功");
        setTimeout(() => {
          router.push("/address");
        }, 1000);
      });
    };

    return {
      ...toRefs(state),
      onSave,
      onDelete
    };
  }
};
</script>

<style lang="scss">
.address-edit {
  margin-top: 60px;
  .van-button--danger {
    background-color: var(--color-tint);
    border: 1px solid var(--color-tint);
  }
}
</style>