<template>
  <div class="header">
    <el-button class="header__logout" @click="logout">Log Out</el-button>
    <p class="header__user">Hello, {{username}}</p>
  </div>
</template>

<script>
import auth from '@/utils/auth.js'
export default {
  name: 'Header',
  data: function () {
    return {
      username: ''
    }
  },
  created () {
    this.username = auth.getUser().name
  },
  methods: {
    logout () {
      auth.removeUser()
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 40px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  flex-shrink: 0;
  background-color: rgba(230, 173, 59, 1);
  &__user {
    font-size: 15px;
    padding: 0 20px;
    color: white;
  }
  &__logout {
    font-size: 15px;
    background: inherit;
    border: inherit;
    height: inherit;
    padding: 0 20px;
    border-radius: 0;
    color: white;
  }
  &__logout:hover {
    background-color: #fff;
    border-radius: 0;
    color: #000;
  }
  &__logout:focus {
background-color: #fff;
    border-radius: 0;
    color: #000;
  }
}
</style>
