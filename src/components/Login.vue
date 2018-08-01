<template>
  <div class="login">
    <div class="login_box">
      <div class="login_head">欢迎登录</div>
      <div class="login_input">
        <div class="input_msg">
          <div><img src="../assets/user.png" alt=""></div>
          <input type="text" placeholder="请输入您的账号" v-model="user">
        </div>
        <div class="input_msg">
          <div><img src="../assets/password.png" alt=""></div>
          <input type="password" placeholder="请输入您的密码" v-model="password">
        </div>
        <div class="code">
          <input type="text" placeholder="请输入右图的验证码" v-model="codenumber">
          <div class="code_img" @click="getCode">
            <img :src="code" alt="">
          </div>
        </div>
        <button @click="login">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import url from '../assets/Req.js'
export default {
  name: 'Login',
  data () {
    return {
      user: '',
      password: '',
      code: '',
      codenumber: ''
    }
  },
  mounted () {
    this.getCode()
  },
  methods: {
    getCode () {
      var that = this
      that.$http.get(url + 'common/ajaxIdentifyingCode?' + Math.random()).then(res => {
        // console.log(res.data)
        this.code = res.data.data
      })
    },
    login () {
      // this.$router.push('/CompanyHome')
      if (this.user === '') {
        alert('请输入用户名')
      } else if (this.password === '') {
        alert('请输入密码')
      } else if (this.codenumber === '') {
        alert('请输入验证码')
      } else {
        var that = this
        that.$http.get(url + 'admin/login', {
          params: {
            account: this.user,
            password: this.password,
            code: this.codenumber
          }
        }).then(res => {
          // console.log(res.data)
          if (res.data.code === 200) {
            sessionStorage.setItem('judge', res.data.data.test)
            sessionStorage.setItem('userId', res.data.data.id)
            this.$router.push('/HelloWorld')
          } else {
            this.getCode()
            alert(res.data.msg)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-image: url(../assets/bg.png);
  .login_box {
    width: 380px;
    height: 430px;
    box-sizing: border-box;
    padding: 0 36px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 10px;
    background: white;
    box-shadow: 5px 0px 15px 5px rgba(0, 0, 0, 0.16);
    overflow: hidden;
    .login_head {
      font-size: 20px;
      font-family: 'Arial';
      padding: 18px 0 28px 0;
    }
    .login_input {
      .input_msg {
        width: 300px;
        height: 40px;
        border: 1px solid #cecece;
        border-radius: 4px;
        margin-bottom: 20px;
        overflow: hidden;
        div {
          line-height: 47px;
          float: left;
          border-right: 1px solid #cecece;
          width: 40px;
          text-align: center;
          background: #f5f5f5;
        }
        input {
          line-height: 40px;
          float: left;
          border: 0;
          text-indent: 18px;
          outline: none;
          width: 250px;
          height: 40px;
        }
      }
      button {
        cursor: pointer;
        width: 300px;
        height: 40px;
        border-radius: 4px;
        background: #2E92FF;
        color: #fff;
        border: 0;
        outline: none;
        margin: 32px auto 0;
        display: block;
        font-size: 18px;
      }
      .apply {
        display: block;
        cursor: pointer;
        text-align: right;
        padding: 75px 20px 0 0;
      }
    }
  }
  .code {
    overflow: hidden;
    input {
      border: 1px solid #cecece;
      height: 40px;
      outline: none;
      width: 180px;
      text-indent: 10px;
      border-radius: 4px;
      float: left;
    }
    .code_img {
      width: 110px;
      height: 40px;
      border: 1px solid #cecece;
      border-radius: 4px;
      float: left;
      margin-left: 10px;
      overflow: hidden;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
