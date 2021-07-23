<template>
  <div class="about">
    <nav-bar>
      <template v-slot:default>关于我们</template>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

export default {
  name: "About",
  components: {
    NavBar
  }
};
</script>

<style lang="scss" scoped>
</style>