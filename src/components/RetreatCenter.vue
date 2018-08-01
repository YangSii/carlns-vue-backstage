<template>
  <div class="retreat_center">
    <HeadTab :numtab="4"/>
    <div class="tobe_confirm">
      <el-tabs v-model="activeName2" type="card" @tab-click="dataChange">
        <el-tab-pane label="退保中" name="first"></el-tab-pane>
        <el-tab-pane label="已退保" name="second"></el-tab-pane>
      </el-tabs>
      <div class="title">
        <span v-if="num === 4">退保中</span>
        <span v-if="num === 5">已退保</span>
      </div>
      <div class="table">
        <table>
          <tr v-for="(item, index) in data" :key="index">
            <td><span>{{ index + 1 }}</span></td>
            <td v-if="item.logtab === 1">企业名称：{{item.name}}</td>
            <td v-if="item.logtab === 2">姓名：{{item.name}}</td>
            <td>联系方式：{{item.phone}}</td>
            <td>分期金额：{{item.insuranceRisks + item.businessRisks + item.transport}}</td>
            <td>分期期数：{{item.monNubmer}}</td>
            <td>状态：<span style="color: #2e92ff;">{{item.status | statusFilter }}</span></td>
            <td>时间：{{item.datetime | formateDate }}</td>
            <td>
              <button v-if="AccessData.look === 1"><span @click="$router.push({name: 'Detail', query: {id: item.id, num: num, tab: item.logtab}})">查看详情</span></button>
              <button v-if="AccessData.del === 1" @click="open7(item.id, item.logtab)">删除</button>
              <!-- <el-dropdown :hide-on-click="true">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="AccessData.look === 1"><span @click="$router.push({name: 'Detail', query: {id: item.id, num: num, tab: item.logtab}})">查看详情</span></el-dropdown-item>
                  <el-dropdown-item v-if="AccessData.del === 1"><el-button type="text" @click="open7(item.id, item.logtab)">删除</el-button></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
              <button v-if="num === 4" v-show="AccessData.audiTing === 1" @click="confirmTui(item.id, item.logtab)">确认退保</button>
              <button v-if="num === 4" v-show="AccessData.audiTing === 1" @click="cancelTui(item.id, item.logtab)">取消退保</button>
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
  name: 'RetreatCenter',
  data () {
    return {
      data: [],
      num: 4,
      AccessData: {},
      activeName2: 'first'
    }
  },
  mounted () {
    this.getDataList(4)
    this.accessToPermissions()
  },
  methods: {
    // 确认退保
    confirmTui (id, tab) {
      this.$confirm('', '确定要退保吗', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // /admin/confirmationRefund?token=abcdef-1231-eqre&logtab=1&id=60
        this.$http.get(url + 'admin/confirmationRefund', {
          params: {
            token: sessionStorage.getItem('userId'),
            id: id,
            logtab: tab
          }
        }).then(res => {
          if (res.data.msg === 'success') {
            this.getDataList(this.num)
            this.$message({
              type: 'success',
              message: '已退保'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消确认退保'
        })
      })
    },
    // 取消退保
    cancelTui (id, tab) {
      this.$confirm('', '确定要取消退保吗', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // /admin/cancellationRefund?token=abcdef-1231-eqre&logtab=1&id=60
        this.$http.get(url + 'admin/cancellationRefund', {
          params: {
            token: sessionStorage.getItem('userId'),
            id: id,
            logtab: tab
          }
        }).then(res => {
          if (res.data.msg === 'success') {
            this.getDataList(this.num)
            this.$message({
              type: 'success',
              message: '已取消退保'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
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
    open7 (id, tab) {
      this.$confirm('', '确定要删除此项', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.get(url + 'admin/delete', {
          params: {
            token: sessionStorage.getItem('userId'),
            id: id,
            logtab: tab
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
      this.num = Number(tab.index) + 4
      this.getDataList(Number(tab.index) + 4)
    },
    getDataList (data) {
      let that = this
      // admin/queryBystatus?token=abcdef-1231-eqre&status=4&judge=2
      that.$http.get(url + 'admin/queryBystatus', {
        params: {
          'token': sessionStorage.getItem('userId'),
          'judge': sessionStorage.getItem('judge'),
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
.retreat_center {
  .el-dropdown {
    display: inline;
    background: #fff;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-tabs {
    // background: #fff;
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
