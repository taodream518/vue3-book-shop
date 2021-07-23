<template>
  <div class="collect">
    <nav-bar>
      <template v-slot:default>我的收藏</template>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

export default {
  name: "Collect",
  components: {
    NavBar
  }
};
</script>

<style lang="scss" scoped>
</style>