<template>
  <div class="finished">
    <HeadTab :numtab="2"/>
    <div class="tobe_confirm">
      <div class="title">
        <span>已分期</span>
      </div>
      <div class="table">
        <table>
          <tr v-for="(item, index) in data" :key="index">
            <td><span>{{ index + 1 }}</span></td>
            <td v-if="item.logtab === 2">姓名：{{item.name}}</td>
            <td v-if="item.logtab === 1">企业名称：{{item.name}}</td>
            <td v-if="item.licenseNumber">车牌号：{{ item.licenseNumber }}</td>
            <td v-if="!item.licenseNumber">车架号：{{ item.certification }}</td>
            <td>分期金额：￥{{ item.businessRisks + item.insuranceRisks + item.transport }}</td>
            <td>分期期数：{{ item.monNubmer }}</td>
            <td>状态：<span style="color:#67a2ff;">{{ item.status | statusFilter }}</span></td>
            <td>时间：{{ item.datetime | formateDate }}</td>
            <td>
              <button v-if="AccessData.look === 1"><span @click="checkDetail(item.id, item.logtab)">查看详情</span></button>
              <button v-if="AccessData.del === 1" @click="open7(item.logtab, item.id)">删除</button>
              <button @click="tuibao(item.id, item.logtab)">退保</button>
              <!-- <el-dropdown :hide-on-click="true">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="AccessData.look === 1"><span @click="checkDetail(item.id, item.logtab)">查看详情</span></el-dropdown-item>
                  <el-dropdown-item v-if="AccessData.del === 1"><el-button type="text" @click="open7(item.logtab, item.id)">删除</el-button></el-dropdown-item>
                  <el-dropdown-item><el-button type="text" @click="tuibao(item.id, item.logtab)">退保</el-button></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="upload" v-if="isCheck" id="check" @click="close($event)">
      <div class="uploadbox">
        <header>查看详情</header>
        <div class="see">
          <div class="li" v-for="(item, index) in checkDetailData" :key="index">
            <div class="tit">{{ item.title }}</div>
            <div class="con" v-if="item.title !== '分期计划表：'">
              <span>{{ item.data }}</span>
            </div>
            <div class="img" v-if="item.title === '分期计划表：'">
              <span v-if="!item.data">无</span>
              <img v-if="item.data" :src="'http://192.168.1.110' + item.data" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeadTab from './com/HeadTab'
import url from '../assets/Req.js'
export default {
  name: 'Finished',
  data () {
    return {
      data: [],
      isCheck: false,
      checkDetailData: [],
      AccessData: {}
    }
  },
  mounted () {
    this.getDataList()
    this.accessToPermissions()
  },
  methods: {
    tuibao (id, tab) {
      this.$confirm('', '确定要退保吗', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.get(url + 'admin/adminupdateStatus', {
          params: {
            token: sessionStorage.getItem('userId'),
            id: id,
            logtab: tab,
            status: 4
          }
        }).then(res => {
          if (res.data.msg === 'success') {
            this.getDataList()
            this.$message({
              type: 'success',
              message: '退保成功!'
            })
          } else {
            this.$message({
              type: 'info',
              message: res.data.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退保'
        })
      })
    },
    checkDetail (id, tab) {
      if (tab === 1) {
        this.$router.push({name: 'ToExamine', query: {id: id, tab: tab}})
      } else {
        this.$router.push({name: 'PerToExamine', query: {id: id, tab: tab}})
      }
    },
    accessToPermissions () {
      this.$http.get(url + 'am/getAm', {
        params: {
          token: sessionStorage.getItem('userId')
        }
      }).then(res => {
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
    close (e) {
      if (e.target === document.getElementById('check')) {
        this.isCheck = false
      }
    },
    confirm (id, logtab) {
      let that = this
      that.$http.get(url + 'admin/checkDetails', {
        params: {
          'token': sessionStorage.getItem('userId'),
          'judge': sessionStorage.getItem('judge'),
          'logtab': logtab,
          'id': id
        }
      }).then(res => {
        this.isCheck = true
        if (logtab === 1) {
          this.checkDetailData = [
            {'title': '企业名称：', 'data': res.data.data.enterpriseName},
            {'title': '车牌号：', 'data': res.data.data.pLicenseNumber},
            {'title': '分期期数：', 'data': res.data.data.pMonNubmer},
            {'title': '分期金额：', 'data': '￥' + (res.data.data.pBusinessRisks + res.data.data.pInsuranceRisks)},
            {'title': '分期计划表：', 'data': res.data.data.pScheduleImage}
          ]
          if (res.data.data.pCertification) {
            this.checkDetailData[1].data = res.data.data.pCertification
            this.checkDetailData[1].title = '车架号：'
          }
        } else {
          this.checkDetailData = [
            {'title': '姓名：', 'data': res.data.data.userName},
            {'title': '手机号：', 'data': res.data.data.phone},
            {'title': '车牌号：', 'data': res.data.data.licenseNumber},
            {'title': '分期期数：', 'data': res.data.data.monNubmer},
            {'title': '分期金额：', 'data': '￥' + (res.data.data.businessRisks + res.data.data.insuranceRisks)}
          ]
          if (res.data.data.certification) {
            this.checkDetailData[2].data = res.data.data.certification
            this.checkDetailData[2].title = '车架号：'
          }
        }
      })
    },
    getDataList () {
      let that = this
      that.$http.get(url + 'admin/queryBystatus', {
        params: {
          'token': sessionStorage.getItem('userId'),
          'judge': sessionStorage.getItem('judge'),
          'status': '3'
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
      if (!data) return '存时间！'
      let date = new Date(data)
      return date.getFullYear() + '.' + addZero(date.getMonth() + 1) + '.' + addZero(date.getDate())
    },
    statusFilter (data) {
      if (data === 1) return '审核中'
      if (data === 2) return '待分期'
      if (data === 3) return '已分期'
      if (data === 4) return '退保中'
      if (data === 5) return '已退保'
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
.finished {
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
    // height: 100%;
    padding: 20px 10px 0;
    padding-top: 20px;
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
  .upload {
    position: fixed;
    font-size: 16px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    top: 0;
    left: 0;
    cursor: pointer;
    .uploadbox {
      width: 900px;
      margin: 100px auto 0;
      background: #fff;
      min-height: 300px;
      cursor: default;
      button {
        cursor: pointer;
        width: 100px;
        height: 30px;
        background: #00a2ff;
        color: #fff;
        border: 0;
        font-size: 16px;
        border-radius: 4px;
        outline: none;
        margin: 10px 20px;
      }
      .see {
        max-height: 500px;
        min-height: 300px;
        overflow-y: scroll;
        padding: 20px 0 0;
      }
      header {
        line-height: 40px;
        background: #2e92ff;
        padding-left: 40px;
        font-weight: bold;
        color: #fff;
      }
      .li {
        overflow: hidden;
        line-height: 40px;
        .tit {
          float: left;
          width: 140px;
          text-align: right;
          padding-right: 20px;
        }
        .con {
          float: left;
          width: 570px;
          height: 30px;
          line-height: 30px;
          border: 1px solid #ccc;
          margin: 8px 18px;
          text-indent: 20px;
          border-radius: 3px;
        }
        .img {
          float: left;
          width: 570px;
          margin: 8px 18px;
          img {
            width: 570px;
          }
        }
      }
    }
  }
}
</style>
