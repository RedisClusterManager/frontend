<template>
  <div id="app">
    <SideBar v-if="isLogin==true" />
    <Header v-if="isLogin" />
    <div class="layout">
      <transition class="transition" name="slide-fade" mode="out-in" appear>
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import SideBar from '@/components/layout/SideBar.vue'
import auth from '@/utils/auth'

export default {
  name: 'App',
  components: {
    SideBar,
    Header
  },
  data () {
    return {
      isLogin: false,
      isRouterAlive: true
    }
  },
  // 监听器
  watch: {
    $route (to, from) {
      // 监听路由是否变化
      // console.log(999)
      if (to.path === '/') {
        // 跳转到哪个页面
        location.reload()
      }
    }
  },
  created () {
    this.isLogin = auth.isLogin()
    if (this.isLogin === false) this.$router.push('/login')
    else this.$router.push('/home')
  }
}
</script>

<style lang="scss">
@import "@/assets/css/mixin.scss";
@import "@/assets/css/reset.scss";
@import "@/assets/css/element-custom.scss";

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
