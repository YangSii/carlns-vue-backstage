<template>
  <div class="hello">
    <HeadTab :numtab="0"/>
    <div class="usertab">
      <!-- <button v-for="(item, index) in users" :key="index" @click="changeUser(item.id)">{{ item.account }}</button> -->
      <el-tabs v-model="activeName2" type="card" @tab-click="changeUser">
        <el-tab-pane v-for="(item, index) in users" :key="index" :label="item.account" :name="item.id"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="home-table">
      <div class="right r" id="right">
        <div class="title"><span>通知中心</span></div>
        <div class="message">
          <div class="message_t">
            <div class="m_t" v-for="(item, index) in tab" :key="index" :class="{active:index == num}" @click="tabs(index)">{{ item }}</div>
          </div>
          <div class="message_c">
            <div class="mark" v-if="isRead">
              <div class="checkbox">
                <input type="checkbox" id="checkbox" @change="readMessage($event)">
                <img src="../assets/ok.png" alt="">
              </div> 全选
              <a @click="readMark">标记为已读</a>
            </div>
            <div class="figure" v-for="(item, index) in noReadList" :key="index">
              <div class="checkbox" ref="child" v-if="isRead">
                <input type="checkbox" @change="readMessage($event, item.id)">
                <img src="../assets/ok.png" alt="">
              </div>
              <span class="text_show">
                <span style="color:#fe952b;">[{{ item.remarks }}] </span>
                <span>{{ item.content }}</span><br>
                <span>{{ item.createDate | formateDate }}</span>
              </span>
              <a class="delete" @click="delt(item.id)">删除</a>
            </div>
          </div>
          <div class="page">
            <PageChange :pageNumber="length.length" @prev="prev"/>
          </div>
        </div>
      </div>
      <div class="left" id="left">
        <div class="top r">
          <div class="title"><span>正在投保</span></div>
          <TablePart :pay="false" :data="data" @tableDetail="tableDetail" @tDetail="tDetail" @refresh="refresh"  @notpass="notpass" />
          <div class="table_page">
            <PageChange :pageNumber="toubaoLength.length" @prev="prev1"/>
          </div>
        </div>
        <div class="bottom r">
          <div class="title"><span>待客户付款</span></div>
          <TablePart :pay="true" :data="list" @tDetail="tDetail" @refresh="refresh"/>
          <div class="table_page">
            <PageChange :pageNumber="fukuanLength.length" @prev="prev2"/>
          </div>
        </div>
      </div>
      <!-- 分期详情 -->
      <div class="pay_detail" v-if="detailShow" id="close" @click="close($event)">
        <div class="detail_table">
          <div class="head">
            <p>分期详情</p>
            <span v-for="(item, index) in tableData.data" :key="index">
              {{ item.kind }}{{ item.data }}&nbsp;&nbsp;&nbsp;
            </span>
            <div class="h">
              <i>{{ tableData.year | chinese }}年期</i>
            </div>
          </div>
          <div class="stages">
            <ul>
              <li>期数</li>
              <li v-for="(data, index) in ddd" :key="index">{{data.periods}}</li>
            </ul>
            <ul>
              <li>还款时间</li>
              <li v-for="(data, index) in ddd" :key="index">{{data.rtime | formateDate2}}</li>
            </ul>
            <ul>
              <li>还款金额</li>
              <li v-for="(data, index) in ddd" :key="index">{{data.rmoney}}</li>
            </ul>
            <ul>
              <li>还款状态</li>
              <li v-for="(data, index) in ddd" :key="index">{{data.status | statusFilter2}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeadTab from './com/HeadTab'
import TablePart from './com/ttt'
import url from '../assets/Req.js'
import PageChange from './com/PageChange'
export default {
  name: 'HelloWorld',
  data () {
    return {
      num: 0,
      tab: ['未读', '已读'],
      data: [],
      tableData: {},
      detailShow: false,
      detailListShow: false,
      list: [],
      noReadList: [],
      length: [],
      isRead: true,
      readArr: [],
      imgSrc: '',
      toubaoLength: [],
      fukuanLength: [],
      users: [],
      activeName2: '',
      ddd: []
    }
  },
  mounted () {
    this.getUserId()
    window.addEventListener('resize', this.handler)
    if (document.documentElement.clientWidth < 1450) {
      document.getElementById('left').style.width = 980 + 'px'
      // document.getElementById('right').style.width = 300 + 'px'
    } else {
      document.getElementById('right').style.width = 400 + 'px'
      document.getElementById('left').style.width = document.documentElement.clientWidth - 470 + 'px'
    }
  },
  methods: {
    notpass () {
      this.getToubaoData()
    },
    refresh () {
      this.getToubaoData()
    },
    handler () {
      if (document.documentElement.clientWidth < 1450) {
        document.getElementById('left').style.width = 980 + 'px'
        // document.getElementById('right').style.width = 300 + 'px'
      } else {
        document.getElementById('right').style.width = 400 + 'px'
        document.getElementById('left').style.width = document.documentElement.clientWidth - 460 + 'px'
      }
      // console.log(document.documentElement.clientWidth)
    },
    prev (data) {
      this.noReadList = this.length.slice((data - 1) * 6, data * 6)
    },
    prev1 (data) {
      this.data = this.toubaoLength.slice((data - 1) * 6, data * 6)
    },
    prev2 (data) {
      this.list = this.fukuanLength.slice((data - 1) * 6, data * 6)
    },
    tableDetail (id) {
      let that = this
      that.$http.get(url + 'admin/passAudit', {
        params: {
          'token': sessionStorage.getItem('userId'),
          'judge': sessionStorage.getItem('judge'),
          'logtab': id[1],
          'id': id[0]
        }
      }).then(res => {
        // console.log(res.data)
        if (res.data.msg !== 'success') {
          alert(res.data.msg)
        } else {
          this.getToubaoData()
        }
      })
    },
    tDetail (data) {
      // console.log(data)
      this.detailShow = true
      let that = this
      that.$http.get(url + 'personal/getPersonalByid', {
        params: {
          'id': data[0],
          'token': this.token
        }
      }).then(res => {
        // console.log(res.data.data)
        this.tableData = {
          'id': res.data.data.id,
          'year': res.data.data.yearsNubmer,
          'mon': res.data.data.monNubmer,
          'money': res.data.data.businessRisks + res.data.data.insuranceRisks + res.data.data.transport,
          'date': res.data.data.createTime,
          'status': Number(res.data.data.scheduleImage),
          'status1': res.data.data.monNubmer - Number(res.data.data.scheduleImage),
          'data': [
            {'kind': '姓名：', 'data': res.data.data.userName},
            {'kind': '车牌号：', 'data': res.data.data.licenseNumber},
            {'kind': '分期金额：', 'data': res.data.data.businessRisks + res.data.data.insuranceRisks + res.data.data.transport},
            {'kind': '分期期数：', 'data': res.data.data.monNubmer}
          ]
        }
        this.$http.get(url + 'stages/getStageDetails', {
          params: {
            token: sessionStorage.getItem('userId'),
            id: this.tableData.id
          }
        }).then(res => {
          console.log(res.data)
          this.ddd = res.data.data
        })
        if (res.data.data.certification) {
          this.tableData.data[1].data = res.data.data.certification
          this.tableData.data[1].kind = '车架号：'
        } else {
          this.tableData.data[1].data = res.data.data.licenseNumber
          this.tableData.data[1].kind = '车牌号：'
        }
        // console.log(this.tableData)
      })
    },
    changeUser (e, ev) {
      // console.log(e)
      // console.log(ev)
      this.token = e.name
      this.getToubaoData()
    },
    getUserId () {
      let that = this
      that.$http.get(url + 'admin/findUserallByAdminId', {
        params: {
          token: sessionStorage.getItem('userId'),
          judge: sessionStorage.getItem('judge')
        }
      }).then(res => {
        // console.log(res.data)
        this.users = res.data.data
        this.token = res.data.data[0].id
        // console.log(this.token)
        this.getToubaoData()
      })
    },
    // 标记为已读
    readMark () {
      if (this.readArr.length === 0) {
        alert('未选择消息')
      } else {
        let that = this
        that.$http.get(url + 'message/ConvertReadMessage', {
          params: {
            'ids': JSON.stringify(this.readArr),
            'token': this.token
          }
        }).then(res => {
          // console.log(res.data)
          this.getToubaoData()
          for (var i = 0; i < this.$refs.child.length; i++) {
            this.$refs.child[i].children[1].style.display = 'none'
          }
        })
      }
    },
    readMessage (e, id) {
      if (e.target.checked === true) {
        e.target.nextElementSibling.style.display = 'block'
        if (id) {
          this.readArr.push(id)
        }
        if (e.target === document.getElementById('checkbox')) {
          this.readArr = []
          for (var i = 0; i < this.$refs.child.length; i++) {
            this.$refs.child[i].children[1].style.display = 'block'
            this.$refs.child[i].children[0].checked = true
          }
          this.noReadList.forEach(v => {
            this.readArr.push(v.id)
          })
        }
      } else {
        this.readArr.splice(this.readArr.indexOf(id), 1)
        e.target.nextElementSibling.style.display = 'none'
        document.getElementById('checkbox').checked = false
        document.getElementById('checkbox').nextElementSibling.style.display = 'none'
        if (e.target === document.getElementById('checkbox')) {
          this.readArr = []
          for (var j = 0; j < this.$refs.child.length; j++) {
            this.$refs.child[j].children[1].style.display = 'none'
            this.$refs.child[j].children[0].checked = false
          }
        }
      }
    },
    // 删除消息
    delt (id) {
      let that = this
      that.$http.get(url + 'message/deleteMessage', {
        params: {
          'id': id,
          'token': this.token
        }
      }).then(res => {
        // console.log(res.data)
        this.getToubaoData()
      })
    },
    // 关闭弹窗
    close (e) {
      if (e.target === document.getElementById('close')) {
        this.detailShow = false
      }
      if (e.target === document.getElementById('closeList')) {
        this.detailListShow = false
      }
    },
    // 已读未读的切换
    tabs (index) {
      this.num = index
      let that = this
      if (Number(index) === 0) {
        this.isRead = true
      } else {
        this.isRead = false
      }
      that.$http.get(url + 'message/getisReadMessage', {
        params: {
          'isRead': (Number(index) + 1),
          'token': this.token
        }
      }).then(res => {
        this.noReadList = res.data.data.slice(0, 6)
        this.length = res.data.data
      })
    },
    getToubaoData () {
      let that = this
      // 正在投保
      that.$http.get(url + 'common/getList', {
        params: {
          status: '1',
          token: this.token,
          page: '1',
          row: '6'
        }
      }).then(res => {
        // console.log(res.data)
        this.data = res.data.data.slice(0, 6)
        this.toubaoLength = res.data.data
      })
      // 待付款
      that.$http.get(url + 'common/getList', {
        params: {
          status: '2',
          token: this.token,
          page: '1',
          row: '6'
        }
      }).then(res => {
        // console.log(res.data)
        this.list = res.data.data.slice(0, 6)
        this.fukuanLength = res.data.data
      })
      // 未读消息
      that.$http.get(url + 'message/getisReadMessage', {
        params: {
          isRead: 1,
          token: this.token
        }
      }).then(res => {
        // console.log(res.data.data)
        this.noReadList = res.data.data
        this.length = res.data.data
      })
    }
  },
  components: {
    TablePart,
    HeadTab,
    PageChange
  },
  filters: {
    formateDate (data) {
      let date = new Date(data)
      return date.getFullYear() + '.' + addZero(date.getMonth() + 1) + '.' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes())
    },
    formateDate2 (data) {
      let date = new Date(data)
      return date.getFullYear() + '.' + addZero(date.getMonth() + 1) + '.' + addZero(date.getDate())
    },
    chinese (data) {
      if (data === 1) return '一'
      if (data === 3) return '三'
    },
    statusFilter (data) {
      if (data === 1) return '审核中'
      if (data === 2) return '待分期'
      if (data === 3) return '已分期'
      if (data === 4) return '退保中'
      if (data === 5) return '已退保'
    },
    statusFilter2 (data) {
      if (data === 1) return '待还款'
      if (data === 2) return '已还款'
      if (data === 3) return '已逾期'
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
.hello {
  background: #f2f2f2;
  height: 100%;
  .usertab {
    margin-left: 20px;
    width: 80%;
    overflow: hidden;
    button {
      height: 20px;
      width: 100px;
      background: #fff;
      border: 1px solid #eee;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
.home-table {
  padding: 5px 20px 20px;
  min-width: 1450px;
  box-sizing: border-box;
  width: 100%;
  font-size: 14px;
  overflow: hidden;
  margin: 0 auto;
  .r {
    background: #fff;
    .title {
      height: 40px;
      background: #62ACFF;
      color: #fff;
      font-size: 18px;
      line-height: 40px;
      span {
        padding-left: 10px;
        height: 18px;
        border-left: 3px solid #fff;
        margin-left: 20px;
      }
    }
  }
  .right {
    width: 400px;
    min-height: 802px;
    float: left;
    overflow: hidden;
    .message {
      position: relative;
      height: 762px;
      .page {
        position: absolute;
        bottom: 20px;
        // left: 10px;
        width: 100%;
      }
      .message_t {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #f2f2f2;
        .m_t {
          float: left;
          width: 30%;
          line-height: 48px;
          margin: 0 10%;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
          &.active {
            border-bottom: 2px solid #82BEFF;
          }
        }
      }
      .message_c {
        padding: 0 20px;
        height: 590px;
        overflow: hidden;
        a {
          cursor: pointer;
        }
        .checkbox {
          float: left;
          width: 14px;
          height: 14px;
          border: 1px solid #e2e2e2;
          border-radius: 50%;
          margin-top: 12px;
          margin-right: 10px;
          cursor: pointer;
          background: #fff;
          position: relative;
          input {
            position: absolute;
            width: 16px;
            height: 16px;
            top: 0;
            left: 0;
            opacity: 0;
            z-index: 99;
            cursor: pointer;
          }
          img {
            display: none;
            width: 16px;
            height: 16px;
          }
        }
        .mark {
          line-height: 40px;
          a {
            border: 1px solid #62ACFF;
            padding: 2px 4px;
            float: right;
            line-height: 20px;
            margin-top: 3px;
          }
        }
        .figure {
          border-bottom: 1px solid #eee;
          padding-top: 10px;
          overflow: hidden;
          .text_show {
            float: left;
            line-height: 40px;
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .delete {
            float: right;
            line-height: 80px;
            &:hover{
              color: red;
            }
          }
        }
      }
    }
  }
  .left {
    float: left;
    // width: 1120px;
    // width: 75%;
    margin-left: 20px;
    min-height: 620px;
    .top {
      margin-bottom: 20px;
      height: 391px;
      // overflow: hidden;
      position: relative;
      .table_page {
        position: absolute;
        bottom: 0;
        width: 100%;
      }
    }
    .bottom {
      height: 391px;
      position: relative;
      // overflow: hidden;
      .table_page {
        position: absolute;
        bottom: 0;
        width: 100%;
      }
    }
  }
  .pay_detail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background: rgba(0,0,0,0.5);
    cursor: pointer;
    .detail_table {
      width: 770px;
      background: #fff;
      position: absolute;
      cursor: default;
      // border: 1px solid #eeeeee;
      left: 50%;
      margin: 100px 0 0 -385px;
      &.det {
        max-height: 500px;
        min-height: 200px;
        overflow-y: scroll;
        text-align: center;
        span {
          line-height: 200px;
          font-size: 30px;
        }
      }
      img {
        width: 100%;
        display: block;
      }
      .head{
        height: 40px;
        line-height: 40px;
        background: #2e92ff;
        color: #fff;
        p {
          float: left;
          line-height: 40px;
          font-size: 16px;
          padding: 0 30px 0 20px;
        }
        .h {
          float: right;
          font-size: 14px;
          line-height: 40px;
          span {
            margin-right: 20px;
            font-size: 12px;
            line-height: 40px;
            display: inline-block;
          }
          i{
            padding: 0 10px;
            line-height: 22px;
            color: #2e92ff;
            margin-right: 30px;
            background: #fff;
            border-radius: 20px;
          }
        }
      }
      table {
        border-collapse: collapse;
        width: 100%;
        font-size: 16px;
        margin: 20px 0;
        th {
          padding-top: 5px;
          line-height: 40px;
          font-size: 16px;
          td {
            width: 192px;
          }
        }
        tr {
          height: 48px;
          line-height: 48px;
          td:nth-of-type(1) {
            width: 140px;
            text-align: right;
          }
          td:nth-of-type(2) {
            div {
              width: 570px;
              height: 30px;
              line-height: 30px;
              border: 1px solid #ccc;
              margin: 8px 18px;
              text-indent: 20px;
              border-radius: 3px;
            }
          }
        }
      }
      .stages {
        max-height: 600px;
        overflow-y: scroll;
        padding: 20px 0;
        ul {
          float: left;
          width: 25%;
          text-align: center;
          li {
            line-height: 40px;
            font-size: 14px;
            &:first-of-type {
              font-size: 16px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>
