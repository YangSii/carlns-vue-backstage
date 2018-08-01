<template>
  <div class="short_msg_model">
    <HeadTab :numtab="5"/>
    <div class="tobe_confirm">
      <div class="tab">
        <button @click="$router.push('/ShortMsgModel')" style="background:#2e92ff;color: #fff;">短信模板</button>
        <button @click="$router.push('/CooperationAgreement')">更改合作协议</button>
        <button @click="$router.push('/System')">权限分配</button>
      </div>
      <div class="title">
        <span>短信模板</span>
      </div>
      <!-- 短信模板 -->
      <div class="short_message" v-if="shortMessageModel">
        <div class="add"><el-button type="success" @click="dialogFormVisible = true">+ 添加</el-button></div>
        <!-- 添加短信弹框 -->
        <el-dialog title="添加短信模板" :visible.sync="dialogFormVisible" width="520px">
          <el-form :model="form">
            <el-form-item label="短信标题：" :label-width="formLabelWidth">
              <el-input v-model="form.name" auto-complete="off" placeholder="请输入短信标题"></el-input>
              <p>仅为标识，短信不发送标题。</p>
            </el-form-item>
            <el-form-item label="短信内容：" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="form.desc" placeholder="请输入短信内容"></el-input>
              <p>246字以内</p>
            </el-form-item>
            <el-form-item label="类型：" :label-width="formLabelWidth">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="还款短信" value="1"></el-option>
                <el-option label="注册短信" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="sure">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 短信列表 -->
        <el-table :data="tableData" style="width: 90%; margin: 0 auto;">
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="content" label="内容" width="600"></el-table-column>
          <el-table-column prop="status" label="类型"></el-table-column>
          <el-table-column label="">
            <template slot-scope="scope">
              <el-dropdown :hide-on-click="true">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><el-button type="text" @click="edit(scope.row.id)">编辑</el-button></el-dropdown-item>
                  <el-dropdown-item><el-button type="text" @click="open7(scope.row.id)">删除</el-button></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <!-- 编辑短信弹窗 -->
        <el-dialog title="编辑短信模板" :visible.sync="editDialogFormVisible" width="520px">
          <el-form :model="form">
            <el-form-item label="短信标题：" :label-width="formLabelWidth">
              <el-input v-model="form.name" auto-complete="off" placeholder="请输入短信标题"></el-input>
              <p>仅为标识，短信不发送标题。</p>
            </el-form-item>
            <el-form-item label="短信内容：" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="form.desc" placeholder="请输入短信内容" maxlength="246"></el-input>
              <p>246字以内</p>
            </el-form-item>
            <el-form-item label="类型：" :label-width="formLabelWidth">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="还款短信" value="1"></el-option>
                <el-option label="注册短信" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="modify">修 改</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import HeadTab from '../com/HeadTab'
import url from '../../assets/Req.js'
export default {
  name: 'ShortMsgModel',
  data () {
    return {
      // 短信模板
      shortMessageModel: true,
      tableData: [],
      gridData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        desc: ''
      },
      formLabelWidth: '120px',
      editDialogFormVisible: false,
      editId: ''
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 编辑短信模板
    edit (id) {
      this.editDialogFormVisible = true
      this.editId = id
    },
    modify () {
      this.editDialogFormVisible = false
      this.$http.get(url + 'shortmessage/update', {
        params: {
          'token': sessionStorage.getItem('userId'),
          'title': this.form.name,
          'content': this.form.desc,
          'status': this.form.region,
          'id': this.editId
        }
      }).then(res => {
        // console.log(res.data.msg)
        if (res.data.code === 200) {
          this.dialogFormVisible = false
          this.getData()
        } else {
          alert(res.data.msg)
        }
      })
    },
    // 短信模块删除
    open7 (data) {
      this.$confirm('', '确定要删除此项', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.get(url + 'shortmessage/delete', {
          params: {
            'token': sessionStorage.getItem('userId'),
            'id': data
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.getData()
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
    // 添加短信通知
    sure () {
      let that = this
      that.$http.get(url + 'shortmessage/insert', {
        params: {
          'token': sessionStorage.getItem('userId'),
          'title': this.form.name,
          'content': this.form.desc,
          'status': this.form.region
        }
      }).then(res => {
        // console.log(res.data.msg)
        if (res.data.code === 200) {
          this.dialogFormVisible = false
          this.getData()
        } else {
          alert(res.data.msg)
        }
      })
    },
    // 获取数据
    getData () {
      let that = this
      // 获取短信列表
      that.$http.get(url + 'shortmessage/getsm', {
        params: {
          token: sessionStorage.getItem('userId')
        }
      }).then(res => {
        // console.log(res.data)
        this.tableData = res.data.data
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
.short_msg_model {
  height: 100%;
  background: #f2f2f2;
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
    .short_message {
      background: #fff;
      min-height: 800px;
      .el-input, .el-textarea, .el-select {
        width: 280px;
      }
      .el-form-item {
        margin: 0;
        p {
          color: #bbbbbb;
          line-height: 30px;
        }
      }
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
              background-image: url(../../assets/select.png);
              background-repeat: no-repeat;
              background-size: cover;
              top: -1px;
              left: -1px;
            }
          }
        }
      }
    }
  }
}
</style>
