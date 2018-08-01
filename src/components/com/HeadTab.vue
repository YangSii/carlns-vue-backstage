<template>
  <div class="head_tab">
    <ul>
      <li v-for="(item, index) in tabs" :key="index" :class="{active:index == num}" @click="tab(index)" >{{ item }}</li>
    </ul>
    <!-- <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">全部渠道</el-menu-item>
      <el-menu-item index="2">已付款</el-menu-item>
      <el-menu-item index="3"><a>已分期</a></el-menu-item>
      <el-submenu index="4">
        <template slot="title">渠道申请</template>
        <el-menu-item index="4-1">待审核</el-menu-item>
        <el-menu-item index="4-2">已通过</el-menu-item>
        <el-menu-item index="4-3">未通过</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">系统</template>
        <el-menu-item index="5-1">选项1</el-menu-item>
        <el-menu-item index="5-2">选项2</el-menu-item>
        <el-menu-item index="5-3">选项3</el-menu-item>
      </el-submenu>
    </el-menu> -->
  </div>
</template>

<script>
import url from '../../assets/Req.js'
export default {
  name: 'HeadTab',
  data () {
    return {
      num: 0,
      tabs: ['全部渠道', '已付款', '已分期', '渠道申请', '退保中心'],
      route: ['/HelloWorld', '/ConfirmPay', '/Finished', '/Channel', '/RetreatCenter'],
      AccessData: {},
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  mounted () {
    this.num = this.numtab
    this.accessToPermissions()
    if (!sessionStorage.getItem('userId')) {
      this.$router.push('/')
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
    },
    accessToPermissions () {
      // http://192.168.1.110:80/am/getAm?token =abcdef-1231-eqre
      this.$http.get(url + 'am/getAm', {
        params: {
          token: sessionStorage.getItem('userId')
        }
      }).then(res => {
        this.AccessData = res.data.data
        if (this.AccessData.logtab === 1) {
          this.tabs = ['全部渠道', '已付款', '已分期', '渠道申请', '退保中心', '系统']
          this.route = ['/HelloWorld', '/ConfirmPay', '/Finished', '/Channel', '/RetreatCenter', '/ShortMsgModel']
        }
      })
    },
    tab (index) {
      this.num = index
      this.$router.push(this.route[index])
    }
  },
  props: {
    numtab: {
      type: Number,
      default () {
        return 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.head_tab {
  height: 60px;
  width: 100%;
  background: #fff;
  position: relative;
  ul {
    padding-left: 30px;
    li {
      float: left;
      padding: 0 30px;
      line-height: 58px;
      font-size: 18px;
      color: #333;
      cursor: pointer;
    }
    .active {
      border-bottom:2px solid #2E92FF;
      color: #2E92FF;
    }
  }
}
</style>
