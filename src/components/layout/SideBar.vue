<template>
  <div class="side-bar">
    <el-menu
      :default-active="$route.path"
      class="el-menu"
      text-color="#94A0B4"
      active-text-color="#fff"
      router>
      <div class="side-bar__title">
        <h1>Redis Cluster Manage</h1>
      </div>
      <el-menu-item index="/home">
        <i class="el-icon-menu"></i>
        <span slot="title">Homepage</span>
      </el-menu-item>
      <el-menu-item index="/appid">
        <i class="el-icon-document"></i>
        <span slot="title">AppId List</span>
      </el-menu-item>
      <el-menu-item index="/job">
        <i class="el-icon-time"></i>
        <span slot="title">Job List</span>
      </el-menu-item>
      <el-menu-item index="/add">
        <i class="el-icon-circle-plus-outline"></i>
        <span slot="title">Add Cluster</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'SideBar'
}
</script>

<style lang="scss">
@import '@/assets/css/mixin.scss';

// @font-face {
//   font-family: titleFont;
//   // src: url('~@/assets/Starbounder-2.otf');
// }

.side-bar {
  float: left;
  width: 240px;
  height: 100vh;

  &__title {
    @include flex-horizon-justify-center;
    height: 80px;
    text-align: center;
    color: #ffffff;
    border-bottom: 1px solid #3a5173
  }
}
</style>
