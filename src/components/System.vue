<template>
  <div class="system">
    <HeadTab :numtab="5"/>
    <div class="tobe_confirm">
      <div class="tab">
        <button @click="$router.push('/ShortMsgModel')">短信模板</button>
        <button @click="$router.push('/CooperationAgreement')">更改合作协议</button>
        <button @click="$router.push('/System')" style="background:#2e92ff;color: #fff;">权限分配</button>
      </div>
      <div class="title">
        <span>权限分配</span>
      </div>
      <!-- 权限管理 -->
      <div class="authority" v-if="authorityPermission">
        <div class="add">
          <el-button type="primary" @click="dialogFormVisible = true">添加管理员</el-button>
          <!-- <el-button type="info" plain>删除</el-button> -->
          <!-- <el-button type="primary" style="float:right;">批量设置权限</el-button> -->
        </div>
        <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 90%; margin: 0 auto;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="管理员账号"></el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
          <el-table-column label="添加时间">
            <template slot-scope="scope">{{ scope.row.createTime | formateDate }}</template>
          </el-table-column>
          <el-table-column label="" width="90">
            <template slot-scope="scope">
              <el-dropdown :hide-on-click="true">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><span @click="setting(scope.row.id)">权限设置</span></el-dropdown-item>
                  <el-dropdown-item>重置密码</el-dropdown-item>
                  <el-dropdown-item><el-button type="text" @click="open7(scope.row.id)">删除</el-button></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <!-- <el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
          <el-button @click="toggleSelection()">取消选择</el-button> -->
        </div>
        <!-- 分页 -->
        <!-- <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400"></el-pagination>
        </div> -->
      </div>
      <!-- 个人权限设置 -->
      <div class="permission" v-if="personPermission">
        <p>员工：{{permiss.name}}</p>
        <table>
          <tr>
            <td>通过审核</td>
            <td>查看</td>
            <td>编辑</td>
            <td>删除</td>
            <td>全选</td>
          </tr>
          <tr>
            <td v-for="(item, index) in 5" :key="index">
              <div class="sel">
                <input class="check_box_select" type="checkbox" @change="selectChange($event, index)"/>
                <span class="checkbox">
                  <span class="checkbox_select"></span>
                </span>
              </div>
            </td>
          </tr>
        </table>
        <div class="btn">
          <el-button type="primary" @click="back">返回</el-button>
          <span style="margin: 0 100px;"></span>
          <el-button type="primary" @click="savePermisssion">保存</el-button>
        </div>
      </div>
      <!-- 添加管理员弹框 -->
      <el-dialog title="添加管理员" :visible.sync="dialogFormVisible" width="520px">
        <el-form :model="form">
          <el-form-item label="管理员账号：" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入管理员账号"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" :label-width="formLabelWidth">
            <el-input v-model="form.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="设置密码：" :label-width="formLabelWidth">
            <el-input v-model="form.psd" type="password" auto-complete="off" placeholder="请设置一个密码不少于六位数"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" :label-width="formLabelWidth">
            <el-input v-model="form.confirmpsd" type="password" auto-complete="off" placeholder="请确认密码"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import HeadTab from './com/HeadTab'
import url from '../assets/Req.js'
export default {
  name: 'System',
  data () {
    return {
      // 管理员权限设置
      authorityPermission: true,
      tableData3: [],
      multipleSelection: [],
      currentPage4: 4,
      // 权限管理
      personPermission: false,
      checkAll: false,
      checkedCities: [],
      cities: ['通过审核', '查看', '编辑', '删除'],
      isIndeterminate: true,
      dialogFormVisible: false,
      form: {
        name: '',
        psd: '',
        confirmpsd: '',
        phone: ''
      },
      formLabelWidth: '120px',
      permiss: {},
      permission: {}
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 修改权限
    savePermisssion () {
      this.$http.get(url + 'am/saveAm', {
        params: {
          'token': sessionStorage.getItem('userId'),
          'audiTing': this.permission.audiTing,
          'look': this.permission.look,
          'edit': this.permission.edit,
          'del': this.permission.del,
          'id': this.permiss.id
        }
      }).then(res => {
        // console.log(res.data)
        if (res.data.code === 200) {
          this.personPermission = false
          this.authorityPermission = true
        }
      })
    },
    // 返回
    back () {
      this.personPermission = false
      this.authorityPermission = true
    },
    sure () {
      var myreg1 = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg1.test(this.form.phone)) {
        this.$message({
          type: 'info',
          message: '手机号格式不正确'
        })
      } else {
        if (this.form.psd === this.form.confirmpsd) {
          this.$http.get(url + 'admin/add', {
            params: {
              'token': sessionStorage.getItem('userId'),
              'name': this.form.name,
              'pwd': this.form.psd,
              'test': 2,
              'phone': this.form.phone
            }
          }).then(res => {
            if (res.data.code === 200) {
              this.dialogFormVisible = false
              this.getData()
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
            }
          })
        } else {
          this.$message({
            type: 'info',
            message: '两次密码输入不一致'
          })
        }
      }
    },
    setting (id) {
      // console.log(id)
      this.personPermission = true
      this.authorityPermission = false
      this.$http.get(url + 'am/getAm', {
        params: {
          token: id
        }
      }).then(res => {
        // console.log(res.data.data)
        this.permiss = res.data.data
        if (this.permiss.audiTing === 1) {
          document.getElementsByClassName('checkbox_select')[0].style.display = 'block'
          document.getElementsByClassName('check_box_select')[0].checked = true
        }
        if (this.permiss.look === 1) {
          document.getElementsByClassName('checkbox_select')[1].style.display = 'block'
          document.getElementsByClassName('check_box_select')[1].checked = true
        }
        if (this.permiss.edit === 1) {
          document.getElementsByClassName('checkbox_select')[2].style.display = 'block'
          document.getElementsByClassName('check_box_select')[2].checked = true
        }
        if (this.permiss.del === 1) {
          document.getElementsByClassName('checkbox_select')[3].style.display = 'block'
          document.getElementsByClassName('check_box_select')[3].checked = true
        }
      })
    },
    // 权限管理
    handleCheckAllChange (val) {
      this.checkedCities = val ? this.cities : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    // 选择权限
    selectChange (e, i) {
      if (e.target.checked === true) {
        e.target.nextElementSibling.children[0].style.display = 'block'
        if (i === 0) {
          this.permission.audiTing = 1
        } else if (i === 1) {
          this.permission.look = 1
        } else if (i === 2) {
          this.permission.edit = 1
        } else if (i === 3) {
          this.permission.del = 1
        } else if (i === 4) {
          this.permission.audiTing = 1
          this.permission.look = 1
          this.permission.edit = 1
          this.permission.del = 1
          for (var j = 0; j < 5; j++) {
            document.getElementsByClassName('checkbox_select')[j].style.display = 'block'
            document.getElementsByClassName('check_box_select')[j].checked = true
          }
        }
      } else {
        if (i === 4) {
          this.permission.audiTing = 2
          this.permission.look = 2
          this.permission.edit = 2
          this.permission.del = 2
          for (var l = 0; l < 5; l++) {
            document.getElementsByClassName('checkbox_select')[l].style.display = 'none'
            document.getElementsByClassName('check_box_select')[l].checked = false
          }
        } else {
          if (i === 0) {
            this.permission.audiTing = 2
          } else if (i === 1) {
            this.permission.look = 2
          } else if (i === 2) {
            this.permission.edit = 2
          } else if (i === 3) {
            this.permission.del = 2
          }
          e.target.nextElementSibling.children[0].style.display = 'none'
          document.getElementsByClassName('checkbox_select')[4].style.display = 'none'
          document.getElementsByClassName('check_box_select')[4].checked = false
        }
      }
    },
    // 多选模块
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
    },
    dataChange (data) {
    },
    // 短信模块删除
    open7 (id) {
      this.$confirm('', '确定要删除此项', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // admin/admindelete?token =erqer1234erqewr & id=12
        this.$http.get(url + 'admin/admindelete', {
          params: {
            id: id,
            token: sessionStorage.getItem('userId')
          }
        }).then(res => {
          this.getData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取数据
    getData () {
      let that = this
      that.$http.get(url + 'admin/findAll', {
        params: {
          'token': sessionStorage.getItem('userId')
        }
      }).then(res => {
        this.tableData3 = res.data.data
      })
    }
  },
  components: {
    HeadTab
  },
  filters: {
    formateDate (data) {
      let date = new Date(data)
      return date.getFullYear() + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds())
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
.system {
  height: 100%;
  background: #f2f2f2;
  .el-input, .el-textarea, .el-select {
    width: 280px;
  }
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
    .add {
      width: 96%;
      margin: 0 auto 20px;
      padding-top: 40px;
      border-bottom: 1px solid #ccc;
      height: 60px;
    }
    .authority {
      background: #fff;
      height: 800px;
    }
    .permission {
      background: #fff;
      height: 800px;
      text-align: center;
      p {
        text-align: left;
        line-height: 56px;
        padding-left: 50px;
      }
      table {
        border-collapse: collapse;
        width: 80%;
        margin: 0 auto;
        tr {
          text-align: center;
          &:first-of-type {
            background: #fafafa;
            line-height: 80px;
            font-size: 18px;
            color: #666;
            border-top: #f6f6f6 1px solid;
          }
          border-bottom: #f6f6f6 1px solid;
          line-height: 65px;
          input {
            width: 18px;
            height: 18px;
            opacity: 0;
            cursor: pointer;
            z-index: 999;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            margin: auto;
          }
          .sel {
            height: 65px;
            position: relative;
          }
          .checkbox {
            width: 18px;
            height: 18px;
            border: 1px solid #b5b5b5;
            display: block;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            margin: auto;
            .checkbox_select {
              display: none;
              position: absolute;
              width: 20px;
              height: 20px;
              // border: 1px solid #47c479;
              background-image: url(../assets/select.png);
              background-repeat: no-repeat;
              background-size: cover;
              top: -1px;
              left: -1px;
            }
          }
        }
      }
      .btn {
        margin-top: 100px;
      }
    }
  }
}
</style>
