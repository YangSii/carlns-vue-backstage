<template>
  <div class="ttt">
    <table>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td><div class="i">{{ index + 1 }}</div></td>
          <td v-if="item.logtab === 2">姓名：{{ item.name }}</td>
          <td v-if="item.logtab === 1">企业：{{ item.name }}</td>
          <td v-if="item.licenseNumber">车牌号：{{ item.licenseNumber }}</td>
          <td v-if="!item.licenseNumber">车架号：{{ item.certification }}</td>
          <td>分期金额：
            <span style="color:#82BEFF;">{{ item.businessRisks + item.insuranceRisks + item.transport | fixedTwo}}</span>
          </td>
          <td>分期期数：
            <span style="color:#82BEFF;">{{ item.monNubmer }}</span>
          </td>
          <td>状态：
            <span style="color:#82BEFF;">{{ item.status | statusFilter }}</span>
          </td>
          <td>时间：{{ item.datetime | formateDate }}</td>
          <td>
            <a @click="$emit('tDetail', [item.id, item.logtab])" v-show="item.logtab === 2 && AccessData.look === 1" v-if="pay">查看详情</a>
            <!-- <a v-show="item.logtab === 2" v-if="pay"><el-button v-if="AccessData.del === 1" type="text" @click="open7(item.logtab, item.id)">删除</el-button></a> -->
            <a v-if="pay"><el-button v-if="AccessData.del === 1" type="text" @click="open7(item.logtab, item.id)">删除</el-button></a>
            <a class="opreation" v-if="!pay">
              <button class="f paytable" v-if="AccessData.look === 1"><span @click="checkDetail(item.id, item.logtab)">查看详情</span></button>
              <button class="f paytable" v-if="AccessData.del === 1" @click="open7(item.logtab, item.id)">删除</button>
              <!-- <el-dropdown :hide-on-click="true">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="AccessData.look === 1"><span @click="checkDetail(item.id, item.logtab)">查看详情</span></el-dropdown-item>
                  <el-dropdown-item v-if="AccessData.del === 1"><el-button type="text" @click="open7(item.logtab, item.id)">删除</el-button></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            </a>
            <button class="f paytable" v-if="!pay" @click="pass(item.id, item.logtab)" v-show="AccessData.audiTing === 1">通过审核</button>
            <button class="f paytable" v-if="!pay" @click="noPass(item.id, item.logtab)" v-show="AccessData.audiTing === 1">不通过审核</button>
          </td>
        </tr>
      </tbody>
    </table>
    <el-dialog title="审核不通过" :visible.sync="centerDialogVisible" width="30%" center>
      <p style="line-height: 40px;">审核不通过原因</p>
      <el-checkbox-group v-model="checkboxGroup1">
        <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
      </el-checkbox-group>
      <el-form :model="form" style="margin-top: 20px;">
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.beizhu" maxlength="246"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="notPass">确 定</el-button>
      </span>
    </el-dialog>
    <PayVorcher v-if="uploadPay" @PayVorcher="PayVorcher" :id="id" :tab="tab"/>
  </div>
</template>

<script>
import { Button } from 'mint-ui'
import url from '../../assets/Req.js'
import PayVorcher from './PayVorcher'
export default {
  name: 'ttt',
  data () {
    return {
      centerDialogVisible: false,
      checkboxGroup1: [],
      cities: ['信息不全', '资料有误', '图片模糊'],
      formLabelWidth: '60px',
      form: {
        beizhu: ''
      },
      uploadPay: false,
      id: 0,
      tab: 0,
      AccessData: {}
    }
  },
  mounted () {
    this.accessToPermissions()
  },
  methods: {
    checkDetail (id, tab) {
      if (tab === 1) {
        this.$router.push({name: 'ToExamine', query: {id: id, tab: tab, Permiss: 1}})
      } else {
        this.$router.push({name: 'PerToExamine', query: {id: id, tab: tab, Permiss: 1}})
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
    noPass (id, tab) {
      this.id = id
      this.tab = tab
      this.centerDialogVisible = true
    },
    // 审核不通过
    notPass () {
      if (this.checkboxGroup1.length === 0) {
        this.$message({
          type: 'info',
          message: '请填写理由'
        })
      } else {
        // /admin/failurePassAudit?token=abcdef-1231-eqre&logtab=1&id=59&remarks=
        var remark = ''
        this.checkboxGroup1.forEach(v => {
          remark += v + ','
        })
        this.centerDialogVisible = false
        this.$http.get(url + 'admin/failurePassAudit', {
          params: {
            token: sessionStorage.getItem('userId'),
            logtab: this.tab,
            id: this.id,
            remarks: remark,
            remark: this.form.beizhu
          }
        }).then(res => {
          // console.log(res.data)
          if (res.data.code === 200) {
            this.$emit('notpass')
          }
        })
      }
    },
    PayVorcher () {
      this.uploadPay = false
      this.$emit('refresh', false)
    },
    // 审核通过
    pass (id, tab) {
      this.$confirm('', '确定要通过审核', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        if (tab === 1) {
          this.id = id
          this.tab = tab
          this.uploadPay = true
        } else {
          this.$http.get(url + 'admin/passAudit', {
            params: {
              token: sessionStorage.getItem('userId'),
              logtab: tab,
              id: id
            }
          }).then(res => {
            // console.log(res.data)
            if (res.data.code === 200) {
              this.$emit('refresh', false)
              this.$message({
                type: 'success',
                message: '通过审核成功'
              })
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消通过审核'
        })
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
            this.$emit('refresh')
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
    }
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
    },
    fixedTwo (data) {
      if (data.toString().indexOf('.') !== -1) {
        if (data.toString().split('.')[1].length > 2) return data.toFixed(2)
        if (data.toString().split('.')[1].length <= 2) return data
      } else {
        return data
      }
    }
  },
  components: {
    Button,
    PayVorcher
  },
  props: {
    pay: {
      type: Boolean,
      default () {
        return false
      }
    },
    data: {
      type: Array,
      default () {
        return []
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
.ttt {
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
  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    text-align: left;
    tbody {
      tr {
        height: 50px;
        td {
          border-bottom: #f2f2f2 1px solid;
          &:nth-of-type(1) {
            text-align: center;
            .i {
              display: inline-block;
              width: 30px;
              height: 30px;
              background: #f2f2f2;
              text-align: center;
              line-height: 30px;
            }
          }
          &:nth-of-type(2) {
            max-width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          &:last-of-type {
            text-align: right;
            padding-right: 20px;
            .opreation {
              position: relative;
              width: 80px;
            }
            .f {
              border: 0;
              height: 30px;
              background: #fff;
              border: 1px solid #a9cdff;
              color: #2e92ff;
              outline: none;
              cursor: pointer;
            }
            .paytable {
              padding: 0 2px;
            }
            .pay {
              padding: 0 15px;
              background: #00a2ff;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
