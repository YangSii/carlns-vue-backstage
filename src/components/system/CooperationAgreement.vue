<template>
  <div class="cooperation_agreement">
    <HeadTab :numtab="5"/>
    <div class="tobe_confirm">
      <div class="tab">
        <button @click="$router.push('/ShortMsgModel')">短信模板</button>
        <button @click="$router.push('/CooperationAgreement')" style="background:#2e92ff;color: #fff;">更改合作协议</button>
        <button @click="$router.push('/System')">权限分配</button>
      </div>
      <div class="title">
        <span>更改合作协议</span>
      </div>
      <div class="short_message">
        <div class="coop">
          <span>现有<a :href="url + Data.url" target="_blank">《{{ Data.name }}》</a> 最近更改时间：{{ Data.time | formateDate }}</span>
          <el-button type="primary" plain @click="look">查看</el-button>
        </div>
        <div class="upload">
          <p>点击下图中的上传按钮上传新的合作协议：</p>
          <div class="up_pdf" :style="imgchange">
            {{name}}
            <input type="file" @change="uploadFile($event)" accept=".pdf">
          </div>
        </div>
        <div class="btn">
          <el-button type="primary" plain>取消</el-button>
          <span style="padding: 0 100px;"></span>
          <el-button type="primary" @click="changeAgreement">更改</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeadTab from '../com/HeadTab'
import url from '../../assets/Req.js'
export default {
  name: 'CooperationAgreement',
  data () {
    return {
      name: '',
      Data: {},
      url: url,
      imgchange: ''
    }
  },
  mounted () {
    // http://192.168.1.110:80/admin/getByTime
    this.$http.get(url + 'admin/getByTime').then(res => {
      // console.log(res.data)
      this.Data = res.data.data
    })
  },
  methods: {
    look () {
      window.open(this.url + this.Data.url)
    },
    uploadFile (e) {
      this.file = e.target.files[0]
      if (this.file.name.split('.')[1] === 'pdf') {
        var imgSize = this.file.size / 1024
        if (imgSize > 3 * 1024) {
          this.$message({
            type: 'info',
            message: '请上传大小不要超过3M的文件'
          })
        } else {
          this.name = this.file.name
          this.imgchange = {
            'background-image': 'url(/static/img/pdf.png)'
          }
        }
      } else {
        this.$message({
          type: 'info',
          message: '请上传pdf格式的文件'
        })
      }
    },
    changeAgreement () {
      var formData = new FormData()
      formData.append('file', this.file)
      formData.append('token', sessionStorage.getItem('userId'))
      let that = this
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      that.$http.post(url + 'admin/reAgreement', formData, config).then(res => {
        if (res.data.msg === 'success') {
          alert('修改成功')
        }
      })
    }
  },
  components: {
    HeadTab
  },
  filters: {
    formateDate (data) {
      let date = new Date(data)
      return date.getFullYear() + '.' + addZero(date.getMonth() + 1) + '.' + addZero(date.getDate())
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
.cooperation_agreement {
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
      height: 800px;
      padding: 0 20%;
      .coop {
        line-height: 200px;
      }
      .upload {
        p {
          line-height: 80px;
        }
      }
      .btn {
        text-align: center;
        margin-top: 250px;
      }
      .up_pdf {
        width: 240px;
        height: 130px;
        border: 1px solid #ccc;
        margin: 0 auto;
        border-radius: 4px;
        position: relative;
        background-image: url(../../assets/upload_pdf.png);
        background-size: contain;
        background-position: center center;
        input {
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
