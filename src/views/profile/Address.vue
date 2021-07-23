<template>
  <div class="address">
    <nav-bar>
      <template v-slot:default>地址管理</template>
      <template v-slot:right>
        <span style="font-size: 15px" @click="onAdd">
          <van-icon name="plus" />新增
        </span>
      </template>
    </nav-bar>

    <div class="address-list" v-if="list.length">
      <van-address-list
        default-tag-text="默认"
        v-model="chosenAddressId"
        :list="list"
        @edit="onEdit"
      />
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import { ref, toRefs, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getAddressList } from "network/address";

export default {
  name: "Address",
  components: {
    NavBar
  },
  setup() {
    const router = useRouter();

    const state = reactive({
      chosenAddressId: "1",
      list: []
    });

    onMounted(() => {
      getAddressList().then(res => {
        if (res.data.length == 0) {
          state.list = [];
          return;
        }

        state.list = res.data.map(item => ({
          id: item.id,
          name: item.name,
          tel: item.phone,
          address: `${item.province}${item.city}${item.county}${item.address}`,
          isDefault: !!item.is_default
        }));
      });
    });

    // 新增地址
    const onAdd = () => {
      router.push({ path: "/address_edit", query: { type: "add" } });
    };

    // 编辑地址
    const onEdit = item => {
      router.push({
        path: "/address_edit",
        query: { type: "edit", addressId: item.id }
      });
    };

    return {
      ...toRefs(state),
      onAdd,
      onEdit
    };
  }
};
</script>

<style lang="scss">
.address {
  margin-top: 45px;

  .van-address-list__bottom {
    display: none;
  }
}
</style>