<template>
  <div class="channel">
    <HeadTab :numtab="3"/>
    <div class="tobe_confirm">
      <el-tabs v-model="activeName2" type="card" @tab-click="dataChange">
        <el-tab-pane label="待审核" name="first"></el-tab-pane>
        <el-tab-pane label="已通过" name="second"></el-tab-pane>
        <el-tab-pane label="未通过" name="third"></el-tab-pane>
      </el-tabs>
      <!-- <div class="tab">
        <button @click="dataChange(1)">待审核</button>
        <button @click="dataChange(2)">已通过</button>
        <button @click="dataChange(3)">未通过</button>
      </div> -->
      <div class="title">
        <span v-if="num === 1">待审核</span>
        <span v-if="num === 2">已通过</span>
        <span v-if="num === 3">未通过</span>
      </div>
      <div class="table">
        <table>
          <tr v-for="(item, index) in data" :key="index">
            <td><span>{{ index + 1 }}</span></td>
            <td>企业：{{item.enterpriseName}}</td>
            <td>负责人姓名：{{item.headName}}</td>
            <td>经营地址：{{item.address}}</td>
            <td>联系方式：{{item.phone}}</td>
            <td v-if="num === 2">费率：<span style="color:#67a2ff;">{{ item.rate }}%</span></td>
            <td>时间：{{item.createTime | formateDate }}</td>
            <td>
              <button v-if="AccessData.look === 1"><span @click="$router.push({name: 'Detail', query: {id: item.id, num: num}})">查看详情</span></button>
              <button v-if="AccessData.del === 1" @click="open7(item.id)">删除</button>
              <!-- <el-dropdown :hide-on-click="true">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="AccessData.look === 1"><span @click="$router.push({name: 'Detail', query: {id: item.id, num: num}})">查看详情</span></el-dropdown-item>
                  <el-dropdown-item v-if="AccessData.del === 1"><el-button type="text" @click="open7(item.id)">删除</el-button></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
              <button v-if="num === 1" v-show="AccessData.audiTing === 1" @click="$router.push({name: 'Detail', query: {id: item.id, num: num}})">审核</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import HeadTab from './com/HeadTab'
import url from '../assets/Req.js'
export default {
  name: 'Channel',
  data () {
    return {
      data: [],
      num: 1,
      AccessData: {},
      activeName2: 'first'
    }
  },
  mounted () {
    this.getDataList(1)
    this.accessToPermissions()
  },
  methods: {
    accessToPermissions () {
      this.$http.get(url + 'am/getAm', {
        params: {
          token: sessionStorage.getItem('userId')
        }
      }).then(res => {
        // console.log(res.data)
        this.AccessData = res.data.data
      })
    },
    // 删除
    open7 (id) {
      this.$confirm('', '确定要删除此项', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.get(url + 'channel/delete', {
          params: {
            token: sessionStorage.getItem('userId'),
            id: id
          }
        }).then(res => {
          if (res.data.msg === 'success') {
            this.getDataList(this.num)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    dataChange (tab, event) {
      this.num = Number(tab.index) + 1
      this.getDataList(Number(tab.index) + 1)
    },
    getDataList (data) {
      let that = this
      that.$http.get(url + 'channel/getListBystatus', {
        params: {
          'token': sessionStorage.getItem('userId'),
          'status': data
        }
      }).then(res => {
        // console.log(res.data)
        this.data = res.data.data
      })
    }
  },
  components: {
    HeadTab
  },
  filters: {
    formateDate (data) {
      if (!data) return '没有存时间！'
      let date = new Date(data)
      return date.getFullYear() + '.' + addZero(date.getMonth() + 1) + '.' + addZero(date.getDate())
    },
    statusFilter (data) {
      if (data === 1) return '审核中'
      if (data === 2) return '待分期'
      if (data === 3) return '已分期'
      if (data === 4) return '退保中'
      if (data === 5) return '已退保'
      if (data === 6) return '待确认分期'
      if (data === 7) return '审核未通过'
    }
  }
}
function addZero (num) {
  if (num < 10) {
    return '0' + num
  } else {
    return num
  }
}
</script>

<style lang="less" scoped>
.channel {
  .el-dropdown {
    display: inline;
    background: #fff;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__nav {
    background: #fff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  height: 100%;
  background: #f2f2f2;
  .tobe_confirm {
    padding: 20px 10px 0;
    .tab {
      button {
        outline: none;
        background: #fff;
        border: 0;
        padding: 3px 10px;
        margin: 0 5px 10px;
      }
    }
    .table {
      min-height: 800px;
      background: #fff;
    }
    .title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: #82beff;
      color: #fff;
      font-size: 18px;
      span {
        border-left: 2px solid #fff;
        padding-left: 20px;
        margin-left: 20px;
      }
    }
    table {
      background: #fff;
      width: 100%;
      text-align: center;
      border-collapse: collapse;
      tr {
        line-height: 60px;
        td {
          border-bottom: 1px solid #ccc;
          text-align: left;
          color: #333;
          font-size: 16px;
          &:first-of-type {
            width: 100px;
            text-align: center;
            span {
              display: inline-block;
              width: 30px;
              line-height: 30px;
              background: #f2f8ff;
            }
          }
          button {
            width: 88px;
            height: 28px;
            line-height: 28px;
            border: 0;
            border: 1px solid #a9cdff;
            color: #3c99ff;
            background: #fff;
            font-size: 14px;
            outline: none;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
