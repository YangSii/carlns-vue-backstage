<template>
  <div class="to_examine">
    <div class="enter_choose">
      <div class="basic_msg">
        <div class="basic_m">
          <div class="tit">基本信息</div>
          <div class="w" id="writeMsg">
            <div class="r" v-if="!isPerson">
              <span><i>*</i> 企业名称：</span><input type="text" placeholder="请输入企业名称" v-model="Data.enterpriseName" disabled>
            </div>
            <div class="r" v-if="isPerson">
              <span><i>*</i> 姓名：</span><input type="text" placeholder="请输入姓名" v-model="Data.userName" disabled>
            </div>
            <div class="r" v-if="!isPerson">
              <span><i>*</i> 法人姓名：</span><input type="text" placeholder="请输入法人姓名" v-model="Data.personName" disabled>
            </div>
            <div class="r">
              <span><i>*</i> 联系方式：</span><input @keyup="numKeyUp" type="text" placeholder="请输入联系方式" v-model="Data.pPhone" disabled>
            </div>
            <div class="r" v-if="Data.pCertification">
              <span>车辆合格证：</span><input type="text" placeholder="请输入你的合格证/车牌号" v-model="Data.pCertification" disabled>
            </div>
            <div class="r" v-if="Data.pLicenseNumber">
              <span>车牌号：</span><input type="text" placeholder="请输入你的合格证/车牌号" v-model="Data.pLicenseNumber" disabled>
            </div>
          </div>
        </div>
      </div>
      <div class="basic_msg" style="margin-top: 20px;">
        <div class="basic_m">
          <div class="tit">车辆投保</div>
          <div class="w" id="bussiness">
            <div class="r">
              <span><i>*</i> 商业险：</span><input @keyup="numKeyUp" type="text" placeholder="请输入商业险金额" v-model="Data.pBusinessRisks" disabled>
            </div>
            <div class="r">
              <span>交强险：</span><input @keyup="numKeyUp" type="text" placeholder="请输入交强险金额" v-model="Data.pInsuranceRisks" disabled>
            </div>
            <div class="r">
              <span>车船税：</span><input @keyup="numKeyUp" type="text" placeholder="请输入车船税金额" v-model="Data.pTransport" disabled>
            </div>
            <div class="r">
              <span>车险年限：</span>
              <input type="button" id="one" value="一年">
              <input type="button" id="three" value="三年">
            </div>
            <div class="r">
              <span>月付期期数：</span>
              <select @change="monthNumber" id="select" v-model="pMonNumber" disabled>
                <option v-for="(data, index) in monArr" :key="index" :value="data">{{data}}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="basic_img">
        <div class="img_in">
          <div class="tit">上传照片</div>
          <div class="w">
            <div class="pic">
              <div>缴费通知单：</div>
              <div class="img" :style="imgChange0"><a :href="url + Data.pNoticeImage" target="_blank"></a></div>
            </div>
            <div class="pic">
              <div>营业执照：</div>
              <div class="img" :style="imgChange1"><a :href="url + Data.pYImage" target="_blank"></a></div>
            </div>
            <div class="pic" v-if="Data.pCertification">
              <div>购车发票：</div>
              <div class="img" :style="imgChange2"><a :href="url + Data.pGImage" target="_blank"></a></div>
            </div>
            <div class="pic" v-if="Data.pLicenseNumber">
              <div>机动车行驶证：</div>
              <div class="img" :style="imgChange3"><a :href="url + Data.pJImage" target="_blank"></a></div>
            </div>
            <div class="pic">
              <div>法人身份证(正)：</div>
              <div class="img" :style="imgChange4"><a :href="url + Data.pFImage" target="_blank"></a></div>
            </div>
            <div class="pic">
              <div>法人身份证(反)：</div>
              <div class="img" :style="imgChange5"><a :href="url + Data.pFimagefan" target="_blank"></a></div>
            </div>
            <div class="pic" v-if="Data.pScheduleImage">
              <div>付款计划表：</div>
              <div class="img"><a :href="url + Data.pScheduleImage" target="_blank">查看付款计划表</a></div>
            </div>
            <div class="pic" v-if="Data.pProofImage">
              <div>付款凭证：</div>
              <div class="img" :style="imgChange6"><a :href="url + Data.pProofImage" target="_blank"></a></div>
            </div>
          </div>
          <!-- 审核不通过弹窗 -->
          <el-button type="text" @click="centerDialogVisible = true" v-show="auding">审核不通过</el-button>
          <button @click="nextPage" v-show="auding">审核通过</button>
          <button @click="back" v-show="!auding">返回</button>
          <el-dialog title="审核不通过" :visible.sync="centerDialogVisible" width="30%" center>
            <p style="line-height: 40px;">审核不通过原因</p>
            <el-checkbox-group v-model="checkboxGroup1">
              <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
            </el-checkbox-group>
            <el-form :model="form" style="margin-top: 20px;">
              <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.beizhu" maxlength="20"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="permissionSubmit">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
    <PayVorcher v-if="uploadPay" @PayVorcher="PayVorcher" :id="this.$route.query.id" :tab="this.$route.query.tab"/>
  </div>
</template>

<script>
// import HeadTab from '../common/HeadTab'
import url from '../../assets/Req.js'
import PayVorcher from '../com/PayVorcher'
export default {
  name: 'ToExamine',
  data () {
    return {
      isPerson: '',
      imgChange0: '',
      imgChange1: '',
      imgChange2: '',
      imgChange3: '',
      imgChange4: '',
      imgChange5: '',
      imgChange6: '',
      Data: {},
      monArr: [12],
      pMonNumber: 24,
      arr: [],
      driving: true,
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
      auding: false,
      url: url
    }
  },
  mounted () {
    if (this.$route.query.tab === 4) {
      this.isShow = true
    }
    this.getData()
    if (this.$route.query.Permiss === 1) {
      this.auding = true
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    permissionSubmit () {
      if (this.checkboxGroup1.length === 0) {
        this.$message({
          type: 'info',
          message: '请填写理由'
        })
      } else {
        var remark = ''
        this.checkboxGroup1.forEach(v => {
          remark += v + ','
        })
        this.centerDialogVisible = false
        this.$http.get(url + 'admin/failurePassAudit', {
          params: {
            token: sessionStorage.getItem('userId'),
            logtab: this.$route.query.tab,
            id: this.$route.query.id,
            remarks: remark,
            remark: this.form.beizhu
          }
        }).then(res => {
          // console.log(res.data)
          if (res.data.code === 200) {
            window.history.go(-1)
          }
        })
      }
    },
    numberChange (data) {
      data.target.parentNode.nextSibling.disabled = false
      data.target.parentNode.style.color = '#000'
      if (data.target.value === '车辆合格证') {
        data.target.parentNode.parentNode.nextElementSibling.children[1].disabled = true
        this.driving = true
        data.target.parentNode.parentNode.nextElementSibling.children[0].style.color = '#ccc'
        this.Data.pLicenseNumber = ''
      } else {
        data.target.parentNode.parentNode.previousElementSibling.children[1].disabled = true
        this.driving = false
        data.target.parentNode.parentNode.previousElementSibling.style.color = '#ccc'
        this.Data.pCertification = ''
      }
    },
    changeColor (index, ele) {
      var write = document.getElementById(ele).children
      for (var i = 0; i < write.length; i++) {
        write[i].children[1].style.borderColor = '#ccc'
      }
      if (index < write.length) {
        write[index].children[1].style.borderColor = 'red'
      }
    },
    PayVorcher (data) {
      this.uploadPay = false
      if (data === 'pass') {
        window.history.go(-1)
      }
    },
    // 审核通过
    nextPage () {
      this.id = this.$route.query.id
      this.tab = this.$route.query.tab
      this.uploadPay = true
    },
    numKeyUp () {},
    yearNumber (e, data) {
      this.Data.pYearsNubmer = data
      if (data === '1') {
        e.target.style.borderColor = 'rgb(46, 146, 255)'
        e.target.nextElementSibling.style.borderColor = '#ccc'
        this.monArr = ['12']
      } else {
        e.target.style.borderColor = 'rgb(46, 146, 255)'
        e.target.previousElementSibling.style.borderColor = '#ccc'
        this.monArr = ['12', '18', '24', '36']
      }
    },
    monthNumber (data) {
      // console.log(data)
      this.Data.pMonNubmer = data.target.value
    },
    getData () {
      let that = this
      that.$http.get(url + 'admin/checkDetails', {
        params: {
          'id': this.$route.query.id,
          'token': sessionStorage.getItem('userId'),
          'logtab': this.$route.query.tab
        }
      }).then(res => {
        // console.log(res.data)
        this.Data = res.data.data
        if (this.Data.pYearsNubmer === 1) {
          document.getElementById('one').style.borderColor = 'rgb(46, 146, 255)'
          document.getElementById('three').style.borderColor = '#ccc'
          this.monArr = [12]
        } else {
          document.getElementById('three').style.borderColor = 'rgb(46, 146, 255)'
          document.getElementById('one').style.borderColor = '#ccc'
          this.monArr = [12, 18, 24, 36]
        }
        this.pMonNumber = res.data.data.pMonNubmer
        this.imgChange0 = {
          'background-image': 'url(' + url + res.data.data.pNoticeImage + ')'
        }
        this.imgChange1 = {
          'background-image': 'url(' + url + res.data.data.pYImage + ')'
        }
        this.imgChange2 = {
          'background-image': 'url(' + url + res.data.data.pGImage + ')'
        }
        this.imgChange3 = {
          'background-image': 'url(' + url + res.data.data.pJImage + ')'
        }
        this.imgChange4 = {
          'background-image': 'url(' + url + res.data.data.pFImage + ')'
        }
        this.imgChange5 = {
          'background-image': 'url(' + url + res.data.data.pFimagefan + ')'
        }
        this.imgChange6 = {
          'background-image': 'url(' + url + res.data.data.pProofImage + ')'
        }
      })
    },
    test (i) {
      if (this.arr.length > 0) {
        this.arr.forEach((v, k) => {
          if (v.id === i) {
            this.arr.splice(k, 1)
          }
        })
      }
    }
  },
  components: {
    PayVorcher
  }
}
</script>

<style lang="less" scoped>
.to_examine {
  background: #fff;
  .enter_choose {
    background: #f2f2f2;
    // padding: 20px;
    font-size: 16px;
    header {
      height: 50px;
      line-height: 50px;
      background: #eaf4ff;
      span {
        border-left: 2px solid #2e92ff;
        padding-left: 20px;
        margin-left: 20px;
      }
    }
    .tit{
      text-align: left;
      width: 1050px;
      margin: 0 auto 42px;
      font-size: 18px;
      height: 22px;
      line-height: 22px;
      border-left: 2px solid #2e92ff;
      padding-left: 13px;
    }
    .basic_msg {
      background: #fff;
      padding: 20px;
      p {
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
      .basic_m {
        width: 100%;
        min-width: 1100px;
        background: #fff;
        padding-top: 25px;
        input:disabled {
          background: #fff;
        }
        .w {
          width: 1050px;
          margin: 0 auto;
          padding-bottom: 30px;
          .r {
            line-height: 30px;
            padding-bottom: 13px;
            span {
              display: inline-block;
              width: 125px;
              text-align: right;
              i {
                color: #e8264e;
              }
            }
            input[type="text"] {
              width: 920px;
              height: 30px;
              border: 0;
              border:1px solid #ccc;
              border-radius: 3px;
              text-indent: 6px;
              &:hover {
                border-color: #bed6ff;
              }
            }
            input[type="button"] {
              width: 80px;
              height: 30px;
              background: #fff;
              border: 0;
              border: 1px solid #ccc;
              border-radius: 4px;
              cursor: pointer;
              outline: none;
              &:first-of-type {
                border: #2E92FF 1px solid;
              }
            }
          }
        }
      }
    }
    .basic_img {
      background: #f2f2f2;
      // padding: 0 20px 20px;
      margin-top: 20px;
      .img_in {
        width: 100%;
        min-width: 1100px;
        background: #fff;
        padding-top: 54px;
        text-align: center;
        padding-bottom: 100px;
        .w {
          width: 1050px;
          margin: 40px auto 0;
          overflow: hidden;
          .pic {
            float: left;
            overflow: hidden;
            margin-bottom: 75px;
            a {
              display: block;
              width: 100%;
              height: 100%;
            }
            div {
              font-size: 14px;
              width: 118px;
              text-align: right;
              float: left;
            }
            .img {
              width: 230px;
              height: 130px;
              border: 1px solid #ccc;
              text-align: center;
              position: relative;
              background-repeat: no-repeat;
              background-position: center center;
              border-radius: 3px;
              background-size: 240px 130px;
              // background-image: url(../../assets/upload.png);
              input {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0;
                cursor: pointer;
              }
            }
          }
        }
        button {
          width: 85px;
          height: 40px;
          border: 0;
          background: #2E92FF;
          color: #fff;
          border-radius: 5px;
          cursor: pointer;
          outline: none;
          &:first-of-type {
            background: #fff;
            border: 1px solid #2E92FF;
            color: #2E92FF;
          }
          &:nth-of-type(2) {
            margin-left: 100px;
          }
        }
      }
    }
  }
}
</style>
