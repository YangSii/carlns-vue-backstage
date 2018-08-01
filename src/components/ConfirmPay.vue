<template>
  <div class="confirm_pay">
    <HeadTab :numtab="1"/>
    <div class="tobe_confirm">
      <div class="title">
        <span>待确认付款</span>
      </div>
      <div class="table">
        <table>
          <tr v-for="(item, index) in data" :key="index">
            <td><span>{{ index + 1 }}</span></td>
            <td v-if="item.logtab === 2">姓名：{{item.name}}</td>
            <td v-if="item.logtab === 1">企业名称：{{item.name}}</td>
            <td v-if="item.licenseNumber">车牌号：{{item.licenseNumber}}</td>
            <td v-if="!item.licenseNumber">车架号：{{item.certification}}</td>
            <td>分期金额：￥{{item.businessRisks + item.insuranceRisks + item.transport | fixedTwo}}</td>
            <td>分期期数：{{item.monNubmer}}</td>
            <td>状态：<span style="color:#67a2ff;">{{ item.status | statusFilter }}</span></td>
            <td>时间：{{item.datetime | formateDate}}</td>
            <td>
              <button v-if="AccessData.look === 1"><span @click="checkDetail(item.id, item.logtab)">查看详情</span></button>
              <button v-if="AccessData.del === 1" @click="open7(item.logtab, item.id)">删除</button>
              <!-- <el-dropdown :hide-on-click="true">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="AccessData.look === 1"><span @click="checkDetail(item.id, item.logtab)">查看详情</span></el-dropdown-item>
                  <el-dropdown-item v-if="AccessData.del === 1"><el-button type="text" @click="open7(item.logtab, item.id)">删除</el-button></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
              <button @click="confirm(item.id, item.logtab)">确认付款</button>
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
  name: 'ConfirmPay',
  data () {
    return {
      data: [],
      AccessData: {}
    }
  },
  mounted () {
    this.getDataList()
    this.accessToPermissions()
  },
  methods: {
    checkDetail (id, tab) {
      if (tab === 1) {
        this.$router.push({name: 'ToExamine', query: {id: id, tab: tab}})
      } else {
        this.$router.push({name: 'PerToExamine', query: {id: id, tab: tab}})
      }
    },
    accessToPermissions () {
      // http://192.168.1.110:80/am/getAm?token =abcdef-1231-eqre
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
    open7 (tab, id) {
      this.$confirm('', '确定要删除此项', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.get(url + 'admin/delete', {
          params: {
            token: sessionStorage.getItem('userId'),
            logtab: tab,
            id: id
          }
        }).then(res => {
          if (res.data.msg === 'success') {
            this.getDataList()
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
    // 确认付款
    confirm (id, logtab) {
      this.$confirm('', '确定确认付款', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let that = this
        that.$http.get(url + 'admin/confirmPayment', {
          params: {
            'token': sessionStorage.getItem('userId'),
            'judge': sessionStorage.getItem('judge'),
            'logtab': logtab,
            'id': id
          }
        }).then(res => {
          if (res.data.msg === 'success') {
            this.getDataList()
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消确认付款'
        })
      })
    },
    // 获取数据
    getDataList () {
      let that = this
      that.$http.get(url + 'admin/queryBystatus', {
        params: {
          'token': sessionStorage.getItem('userId'),
          'judge': sessionStorage.getItem('judge'),
          'status': '6'
        }
      }).then(res => {
        // console.log(res.data.data)
        this.data = res.data.data
      })
    }
  },
  components: {
    HeadTab
  },
  filters: {
    formateDate (data) {
      if (!data) return '石彪你又没有存时间！'
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
    },
    // 保留小数点后两位
    fixedTwo (data) {
      if (data.toString().indexOf('.') !== -1) {
        if (data.toString().split('.')[1].length > 2) return data.toFixed(2)
        if (data.toString().split('.')[1].length <= 2) return data
      } else {
        return data
      }
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
.confirm_pay {
  .el-dropdown {
    display: inline;
    background: #fff;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  height: 100%;
  background: #f2f2f2;
  .tobe_confirm {
    padding: 20px 10px 0;
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
