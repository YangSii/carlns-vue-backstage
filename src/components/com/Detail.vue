<template>
  <div class="detail">
    <div class="basic_text" v-if="$route.query.tab === 1 || $route.query.num === 2 || $route.query.num === 3 || $route.query.num === 1">
      <p class="remark" v-if="Data.remarks" v-show="$route.query.num === 3">
        <img src="../../assets/warn.png" alt="">
        <span>{{ Data.remarks }}</span>
      </p>
      <div class="tit"><span>基本信息</span></div>
      <div class="row">
        <div class="left"><i>*</i>企业名称：</div>
        <div class="right"><input type="text" v-model="Data.enterpriseName" disabled></div>
      </div>
      <div class="row">
        <div class="left"><i>*</i>负责人姓名：</div>
        <div class="right" v-if="Data.headName"><input type="text" v-model="Data.headName" disabled></div>
        <div class="right" v-if="Data.personName"><input type="text" v-model="Data.personName" disabled></div>
      </div>
      <div class="row">
        <div class="left"><i>*</i>联系方式：</div>
        <div class="right" v-if="Data.phone"><input type="text" v-model="Data.phone" disabled></div>
        <div class="right" v-if="Data.pPhone"><input type="text" v-model="Data.pPhone" disabled></div>
      </div>
      <div class="row" v-if="Data.address">
        <div class="left"><i>*</i>经营地址：</div>
        <div class="right"><input type="text" v-model="Data.address" disabled></div>
      </div>
      <div class="row" v-if="Data.rate">
        <div class="left"><i>*</i>费率：</div>
        <div class="right"><input type="text" v-model="rate" onkeyup="value = value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"></div>
      </div>
      <div class="row" v-if="Data.pCertification">
        <div class="left"><i>*</i>车架号：</div>
        <div class="right"><input type="text" v-model="Data.pCertification" disabled></div>
      </div>
      <div class="row" v-if="Data.pLicenseNumber">
        <div class="left"><i>*</i>车牌号：</div>
        <div class="right"><input type="text" v-model="Data.pLicenseNumber" disabled></div>
      </div>
    </div>
    <div class="basic_text" v-if="$route.query.tab === 1 || $route.query.num === 2 || $route.query.num === 3 || $route.query.num === 1">
      <div class="tit"><span>图片信息</span></div>
      <div class="pic_msg">
        <div class="pic_ele">
          <div class="pic_txt">营业执照：</div>
          <a class="pic_pic" :href="url + Data.yImage" target="_blank" v-if="Data.yImage">
            <img v-if="Data.yImage" class="pic_img" :src="url + Data.yImage" alt="">
            <img v-if="!Data.yImage" class="bg_img" src="../../assets/bg_pic.png" alt="">
          </a>
          <a class="pic_pic" :href="url + Data.pYImage" target="_blank" v-if="Data.pYImage">
            <img v-if="Data.pYImage" class="pic_img" :src="url + Data.pYImage" alt="">
            <img v-if="!Data.pYImage" class="bg_img" src="../../assets/bg_pic.png" alt="">
          </a>
        </div>
        <div class="pic_ele" v-if="Data.hImage || Data.pHImage">
          <div class="pic_txt">代理商合作协议： </div>
          <div class="pic_pic">
            <a v-if="Data.hImage" :href="url + Data.hImage" target="_blank" style="line-height: 80px;">查看详情</a>
            <a v-if="Data.pHImage" :href="url + Data.pHImage" target="_blank" style="line-height: 80px;">查看详情</a>
            <!-- <img v-if="Data.hImage" class="pic_img" :src="url + Data.hImage" alt="">
            <img class="bg_img" src="../../assets/bg_pic.png" alt=""> -->
          </div>
        </div>
        <div class="pic_ele">
          <div class="pic_txt">法人身份证正面：</div>
          <a class="pic_pic" :href="url + Data.sImage" target="_blank" v-if="Data.sImage">
            <img v-if="Data.sImage" class="pic_img" :src="url + Data.sImage" alt="">
            <img v-if="!Data.sImage" class="bg_img" src="../../assets/bg_pic.png" alt="">
          </a>
          <a class="pic_pic" :href="url + Data.pFImage" target="_blank" v-if="Data.pFImage">
            <img v-if="Data.pFImage" class="pic_img" :src="url + Data.pFImage" alt="">
            <img v-if="!Data.pFImage" class="bg_img" src="../../assets/bg_pic.png" alt="">
          </a>
        </div>
        <div class="pic_ele">
          <div class="pic_txt">法人身份证反面：</div>
          <a class="pic_pic" :href="url + Data.sImagefan" target="_blank" v-if="Data.sImagefan">
            <img v-if="Data.sImagefan" class="pic_img" :src="url + Data.sImagefan" alt="">
            <img v-if="!Data.sImagefan" class="bg_img" src="../../assets/bg_pic.png" alt="">
          </a>
          <a class="pic_pic" :href="url + Data.pFimagefan" target="_blank" v-if="Data.pFimagefan">
            <img v-if="Data.pFimagefan" class="pic_img" :src="url + Data.pFimagefan" alt="">
            <img v-if="!Data.pFimagefan" class="bg_img" src="../../assets/bg_pic.png" alt="">
          </a>
        </div>
      </div>
    </div>
    <div class="basic_text" v-if="$route.query.tab === 2">
      <div class="tit"><span>基本信息</span></div>
      <div class="row">
        <div class="left"><i>*</i>姓名：</div>
        <div class="right"><input type="text" v-model="Data.userName" disabled></div>
      </div>
      <div class="row">
        <div class="left"><i>*</i>联系方式：</div>
        <div class="right"><input type="text" v-model="Data.phone" disabled></div>
      </div>
      <div class="row">
        <div class="left"><i>*</i>身份证：</div>
        <div class="right"><input type="text" v-model="Data.cardId" disabled></div>
      </div>
      <div class="row" v-if="Data.licenseNumber">
        <div class="left"><i>*</i>车牌号：</div>
        <div class="right"><input type="text" v-model="Data.licenseNumber" disabled></div>
      </div>
      <div class="row" v-if="Data.certification">
        <div class="left"><i>*</i>车架号：</div>
        <div class="right"><input type="text" v-model="Data.certification" disabled></div>
      </div>
      <!-- <div class="row">
        <div class="left"><i>*</i>费率：</div>
        <div class="right"><input type="text" v-model="Data.rate" disabled></div>
      </div> -->
    </div>
    <div class="basic_text" v-if="$route.query.tab === 2">
      <div class="tit"><span>图片信息</span></div>
      <div class="pic_msg">
        <div class="pic_ele">
          <div class="pic_txt">缴费通知：</div>
          <a class="pic_pic" :href="url + Data.noticeImage" target="_blank">
            <img v-if="Data.noticeImage" class="pic_img" :src="url + Data.noticeImage" alt="">
            <img v-if="!Data.noticeImage" class="bg_img" src="../../assets/bg_pic.png" alt="">
          </a>
        </div>
        <div class="pic_ele" v-if="Data.certification">
          <div class="pic_txt">购车发票：</div>
          <a class="pic_pic" :href="url + Data.purchaseImage" target="_blank">
            <img v-if="Data.purchaseImage" class="pic_img" :src="url + Data.purchaseImage" alt="">
            <img v-if="!Data.purchaseImage" class="bg_img" src="../../assets/bg_pic.png" alt="">
          </a>
        </div>
        <div class="pic_ele" v-if="Data.licenseNumber">
          <div class="pic_txt">机动车行驶证：</div>
          <a class="pic_pic" :href="url + Data.jImage" target="_blank">
            <img v-if="Data.jImage" class="pic_img" :src="url + Data.jImage" alt="">
            <img v-if="!Data.jImage" class="bg_img" src="../../assets/bg_pic.png" alt="">
          </a>
        </div>
        <div class="pic_ele">
          <div class="pic_txt">法人身份证正面：</div>
          <a class="pic_pic" :href="url + Data.sImage" target="_blank">
            <img v-if="Data.sImage" class="pic_img" :src="url + Data.sImage" alt="">
            <img v-if="!Data.sImage" class="bg_img" src="../../assets/bg_pic.png" alt="">
          </a>
        </div>
        <div class="pic_ele">
          <div class="pic_txt">法人身份证反面：</div>
          <a class="pic_pic" :href="url + Data.sImagefan" target="_blank">
            <img v-if="Data.sImagefan" class="pic_img" :src="url + Data.sImagefan" alt="">
            <img v-if="!Data.sImagefan" class="bg_img" src="../../assets/bg_pic.png" alt="">
          </a>
        </div>
      </div>
    </div>
    <el-button type="primary" @click="back">返回</el-button>
    <el-button type="primary" @click="rateChange" v-if="$route.query.num === 2">修改费率</el-button>
    <el-button type="danger" @click="centerDialogVisible = true" v-if="shenhe">审核不通过</el-button>
    <el-button type="primary" @click="centerDialog = true" v-if="shenhe">审核通过</el-button>
    <el-button type="danger" v-if="tuibao" @click="confirmTui">确认退保</el-button>
    <el-button type="primary" v-if="tuibao" @click="cancelTui">取消退保</el-button>
    <el-dialog title="审核不通过" :visible.sync="centerDialogVisible" width="30%" center>
      <p style="line-height: 40px;">审核不通过原因</p>
      <el-checkbox-group v-model="checkboxGroup1" style="padding-left: 40px">
        <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
      </el-checkbox-group>
      <el-form :model="form" style="margin-top: 20px;">
        <el-form-item label="备注" :label-width="formLabelWidth1">
          <el-input type="textarea" v-model="form.beizhu" maxlength="246"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="permissionSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="审核通过" :visible.sync="centerDialog" width="30%" center>
      <el-form :model="form" style="margin-top: 20px;">
        <el-form-item label="默认费率：" :label-width="formLabelWidth">
          <el-input v-text="'8.5%'"></el-input>
        </el-form-item>
        <el-form-item label="修改费率：" :label-width="formLabelWidth">
          <el-input v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialog = false">取 消</el-button>
        <el-button type="primary" @click="nextPage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import url from '../../assets/Req.js'
export default {
  name: 'Detail',
  data () {
    return {
      picture: '../../assets/bg_pic.png',
      Data: {},
      url: url,
      centerDialogVisible: false,
      centerDialog: false,
      checkboxGroup1: [],
      cities: ['信息不全', '资料有误', '图片模糊'],
      formLabelWidth: '90px',
      formLabelWidth1: '40px',
      form: {
        beizhu: '',
        desc: ''
      },
      shenhe: false,
      tuibao: false,
      rate: ''
    }
  },
  mounted () {
    if (this.$route.query.num === 1) {
      this.shenhe = true
    }
    if (this.$route.query.num === 4) {
      this.tuibao = true
    }
    if (this.$route.query.num === 5 || this.$route.query.num === 4) {
      this.getDataToubao()
    } else {
      this.getData()
    }
  },
  methods: {
    rateChange () {
      // channel/updateRate?token=e1234134eqwer&id=9402d243-85a4-413c-9934-bc9d22717e07&rate=9.8
      this.$http.get(url + 'channel/updateRate', {
        params: {
          'token': sessionStorage.getItem('userId'),
          'id': this.$route.query.id,
          'rate': this.rate
        }
      }).then(res => {
        // console.log(res.data)
        if (res.data.code === 200) {
          window.history.go(-1)
        }
      })
    },
    // 确认退保
    confirmTui () {
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
            id: this.$route.query.id,
            logtab: this.$route.query.tab
          }
        }).then(res => {
          if (res.data.msg === 'success') {
            window.history.go(-1)
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
    cancelTui () {
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
            id: this.$route.query.id,
            logtab: this.$route.query.tab
          }
        }).then(res => {
          if (res.data.msg === 'success') {
            window.history.go(-1)
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
    nextPage () {
      if (!this.form.desc) {
        this.form.desc = 0.08
      }
      this.$http.get(url + 'channel/examinationApproval', {
        params: {
          'token': sessionStorage.getItem('userId'),
          'channelName': this.Data.enterpriseName,
          'phone': this.Data.phone,
          'channelid': this.Data.id,
          'rate': Number(this.form.desc)
        }
      }).then(res => {
        // console.log(res.data)
        if (res.data.code === 200) {
          window.history.go(-1)
        }
      })
    },
    permissionSubmit () {
      var remark = ''
      this.checkboxGroup1.forEach(v => {
        remark += v + ','
      })
      this.centerDialogVisible = false
      // http://192.168.1.110:80/channel/failurePassAudit?token=abcdef-1231-eqre&account=图片不清晰 查询不到&phone=13061903645&channelName=太阳企业
      this.$http.get(url + 'channel/failurePassAudit', {
        params: {
          'token': sessionStorage.getItem('userId'),
          'account': remark + this.form.beizhu,
          'phone': this.Data.phone,
          'channelName': this.Data.enterpriseName,
          'channelid': this.Data.id
        }
      }).then(res => {
        // console.log(res.data)
        if (res.data.code === 200) {
          window.history.go(-1)
        }
      })
    },
    back () {
      window.history.go(-1)
    },
    getData () {
      // http://192.168.1.110:80/channel/findById?token=abcdef-1231-eqre&id=31593caf-72a7-4f21-a380-114502ee31aa
      this.$http.get(url + 'channel/findById', {
        params: {
          'id': this.$route.query.id,
          'token': sessionStorage.getItem('userId')
        }
      }).then(res => {
        // console.log(res.data)
        this.Data = res.data.data
        this.rate = res.data.data.rate
      })
    },
    getDataToubao () {
      // admin/checkDetails?token=abcdef-1231-eqre&logtab=1&id=60
      this.$http.get(url + 'admin/checkDetails', {
        params: {
          'id': this.$route.query.id,
          'token': sessionStorage.getItem('userId'),
          'logtab': this.$route.query.tab
        }
      }).then(res => {
        // console.log(res.data)
        this.Data = res.data.data
      })
    }
  },
  components: {},
  filters: {}
}
</script>

<style lang="less" scoped>
.detail {
  background: #fff;
  height: 100%;
  text-align: center;
  .el-dialog__header {
    background: #2e92ff;
  }
  .remark {
    text-align: center;
    img {
      width: 18px;
    }
    span {
      line-height: 18px;
      font-size: 18px;
      color: #ffa067;
    }
  }
  .basic_text {
    text-align: left;
    width: 1230px;
    margin: 0 auto;
    padding-top: 45px;
    .tit {
      line-height: 100px;
      span {
        line-height: 20px;
        border-left: 4px solid #2e92ff;
        padding-left: 13px;
      }
    }
    .row {
      overflow: hidden;
      margin-bottom: 15px;
      .left {
        width: 130px;
        line-height: 30px;
        text-align: right;
        float: left;
        i {
          color: #ff0000;
          font-style: normal;
          padding-right: 10px;
        }
      }
      .right {
        width: 917px;
        height: 30px;
        border: 1px solid #ccc;
        border-radius: 2px;
        float: left;
        input {
          border: 0;
          padding-left: 10px;
          line-height: 30px;
          height: 30px;
          width: 80%;
          &:disabled {
            background: #fff;
          }
        }
      }
    }
    .pic_msg {
      overflow: hidden;
      .pic_ele {
        overflow: hidden;
        float: left;
        margin-bottom: 80px;
        .pic_txt {
          width: 140px;
          text-align: right;
          float: left;
        }
        .pic_pic {
          width: 240px;
          height: 128px;
          border: 1px solid #dadada;
          border-radius: 2px;
          text-align: center;
          float: left;
          .pic_img {
            width: 100%;
            height: 100%;
          }
          .bg_img {
            width: 50%;
            padding-top: 20px;
          }
        }
      }
    }
  }
  button {
    margin-bottom: 50px;
  }
}
</style>
