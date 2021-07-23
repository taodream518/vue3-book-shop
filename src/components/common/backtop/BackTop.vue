<template>
  <div class="back-top" @click="backtop"></div>
</template>

<script>
export default {
  name: "BackTop",
  setup(props, { emit }) {
    return {
      backtop: () => {
        emit("bTop");
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.back-top {
  width: 31px;
  height: 31px;
  position: fixed;
  bottom: 70px;
  right: 15px;
  z-index: 20;
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(100, 100, 100, 0.4);
  background: #fcfcfc url("~assets/images/up.png") no-repeat center center;
}
</style>