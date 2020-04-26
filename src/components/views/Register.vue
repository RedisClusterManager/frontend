<template>
  <div class="login">
    <div class="ms-login">
      <div class="ms-title">Redis Cluster Manage</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <div class="sub-title"></div>
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="param.username" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            prefix-icon="el-icon-lock"
            v-model="param.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            type="password"
            placeholder="reenter your password"
            prefix-icon="el-icon-unlock"
            v-model="repassword"
            ref="repassword"
            @keyup.enter.native="submit()"
          ></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="toLogIn()">Back</el-button>
          <el-button type="success" @click="register()">Sign up</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import auth from '@/utils/auth.js'
const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please enter username'))
  }
  if (!/^\w+$/.test(value)) {
    callback(new Error('Only characters, digits and _ are supported'))
  }
  if (value.length > 20) {
    callback(new Error('Less than 20 characters'))
  }
  callback()
}
const validatePass1 = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please enter password'))
  }
  if (!/^\w+$/.test(value)) {
    callback(new Error('Only characters, digits and _ are supported'))
  }
  if (value.length < 6 || value.length > 9) {
    callback(
      new Error('Greater than 5 characters and less than 10 characters')
    )
  }
  callback()
}
export default {
  data: function () {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please reenter password'))
      } else if (value !== this.$refs.repassword) {
        callback(new Error('Password different'))
      } else {
        callback()
      }
    }
    return {
      param: {
        username: '',
        password: ''
      },
      repassword: '',
      rules: {
        username: [
          { required: true, validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass1, trigger: 'blur' }
        ],
        repassword: [
          {
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async submit () {
      if (this.param.username) {
        this.$message.success('Successfully log in')
        await auth.setUser('123', '123')
        this.$router.push('/')
      } else {
        this.$message.error('Please check your user name and password')
        return false
      }
    },
    toLogIn () {
        this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixin.scss";
.login {
  @include linear-gradient(
    to bottom,
    rgba(47, 96, 181, 1) 0%,
    rgba(150, 211, 243, 1) 100%
  );
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
