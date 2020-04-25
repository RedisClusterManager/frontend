<template>
  <div id="app">
    <SideBar />
    <div class="layout">
      <Header />
      <transition class="transition" name="slide-fade" mode="out-in" appear>
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import Header from "@/layout/Header.vue";
import SideBar from "@/layout/SideBar.vue";
import auth from "@/utils/auth";

export default {
  data() {
    return {
      status: ""
    };
  },
  components: {
    Header,
    SideBar
  },
  created() {
    if (auth.isLogin()) this.$router.push("/appid");
  }
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
@import "@/style/reset.scss";
@import "@/style/element-custom.scss";

$backgroud-color: #f8fafc;

#app {
  background: $backgroud-color;
  min-height: 100vh;
  height: 100%;
  @include slide-transition;
}

.layout {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100vh;
  overflow-x: hidden;
  & > div:last-child {
    padding: 24px;
  }
  // background-color: rgb(34, 34, 34) !important;
}
</style>
