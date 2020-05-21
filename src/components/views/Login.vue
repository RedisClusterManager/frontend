<template>
  <div class="login">
    <div class="ms-login">
      <div class="ms-title">Redis Cluster Manage</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="param.username" placeholder="username">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            prefix-icon="el-icon-lock"
            v-model="param.password"
            @keyup.enter.native="submit()"
          >
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="success" @click="toSignUp()">Sign up</el-button>
          <el-button type="primary" @click="submit()">Log in</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import auth from '@/utils/auth.js'
export default {
  name: 'Login',
  data: function () {
    return {
      isSignUp: false,
      param: {
        username: 'admin',
        password: '123123'
      },
      rules: {
        username: [
          { required: true, message: 'Please enter username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please enter password', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async submit () {
      if (this.param.username) {
        this.$message.success('Successfully log in')
        await auth.setUser(this.param.password, this.param.username)
        this.$router.push('/')
      } else {
        this.$message.error('Please check your username or password')
        return false
      }
    },
    toSignUp () {
      this.$router.push('/register')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/mixin.scss';
.login {
  @include linear-gradient(to bottom, rgba(47, 96, 181, 1) 0%,  rgba(150, 211, 243, 1) 100%);
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 100%;
}

.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(34, 34, 34, 0.8);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 120px;
    height: 36px;
    margin: 10px 12px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
