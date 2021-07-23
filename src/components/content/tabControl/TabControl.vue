<template>
  <div class="tab-control">
    <div
      class="tab-control-item"
      v-for="(item, index) in titles"
      :class="{ active: currentIndex == index }"
      :key="index"
      @click="itemClick(index)"
    >
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const currentIndex = ref(0);

    const itemClick = index => {
      currentIndex.value = index;
      emit("tabClick", index);
    };

    return {
      currentIndex,
      itemClick
    };
  }
};
</script>

<style lang="scss" scoped>
.tab-control {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: var(--font-size);
  background: #fff;
  z-index: 10;
  display: flex;
  
  position: sticky;
  top: 44px;

  .tab-control-item {
    flex: 1;
    span {
      padding: 5px;
    }
  }

  .active {
    color: var(--color-tint);
    span {
      border-bottom: 3px solid var(--color-tint);
    }
  }
}
</style>