<template>
  <div class="page_change">
    <div class="page"  v-show="show">
      <div class="pagelist">
        <span class="jump" v-show="current_page>1" @click="prevPage">上一页</span>
        <span v-show="current_page>5" class="jump" @click="jumpPage(1)">1</span>
        <span class="ellipsis"  v-show="efont">...</span>
        <span class="jump" v-for="num in indexs" :key="num" :class="{bgprimary:current_page==num}" @click="jumpPage(num)">{{num}}</span>
        <span class="ellipsis"  v-show="efont&&current_page<pages-4">...</span>

        <span class="jump" @click="nextPage">下一页</span>
        <span v-show="current_page<pages-1" class="jump" @click="jumpPage(pages)">{{pages}}</span>

        <span class="jumppoint">跳转到：</span>
        <span class="jumpinp"><input type="number" v-model="changePage"></span>
        <span class="jump gobtn" @click="jumpPage(changePage)">GO</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageChange',
  data () {
    return {
      current_page: 1, // 当前页
      pages: 0, // 总页数
      changePage: '', // 跳转页
      nowIndex: 0
    }
  },
  mounted () {
  },
  watch: {
    pageNumber () {
      // console.log(this.pageNumber)
      this.pages = Math.ceil(this.pageNumber / 6)
      this.current_page = 1
    }
  },
  computed: {
    show () {
      return this.pages && this.pages !== 1
    },
    efont () {
      if (this.pages <= 6) return false
      return this.current_page > 6
    },
    indexs () {
      var left = 1
      var right = this.pages
      var ar = []
      if (this.pages >= 3) {
        if (this.current_page > 3 && this.current_page < this.pages) {
          left = Number(this.current_page) - 1
          right = Number(this.current_page)
        } else {
          if (this.current_page <= 3) {
            left = 1
            right = 3
          } else {
            right = this.pages
            left = this.pages - 2
          }
        }
      }
      while (left <= right) {
        ar.push(left)
        left++
      }
      return ar
    }
  },
  methods: {
    jumpPage (id) {
      if (id <= this.pages && id > 0) {
        this.current_page = id
        this.$emit('prev', this.current_page)
      }
    },
    prevPage () {
      this.current_page--
      this.$emit('prev', this.current_page)
    },
    nextPage () {
      if (this.current_page < this.pages) {
        this.current_page++
        this.$emit('prev', this.current_page)
      }
    }
  },
  props: {
    pageNumber: {
      type: Number,
      default () {
        return 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page_change {
  .page {
    font-weight: 400;
    height: 50px;
    text-align: center;
    color: #888;
    margin: 0 auto 0;
    background: #f2f2f2;
  }
  .pagelist {
    font-size: 0;
    background: #fff;
    height: 50px;
    line-height: 50px;
  }
  .pagelist span {
    font-size: 12px;
  }
  .pagelist .jump {
    border: 1px solid #ccc;
    padding: 2px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 5px;
  }
  .pagelist .bgprimary {
    cursor: default;
    color: #fff;
    background: #337ab7;
    border-color: #337ab7;
  }
  .jumpinp input {
    width: 40px;
    height: 26px;
    font-size: 13px;
    border: 1px solid #ccc;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    text-align: center;
  }
  .ellipsis {
    padding: 0px 8px;
  }
  .jumppoint {
    margin-left: 10px;
  }
  .pagelist .gobtn {}
  .bgprimary {
    cursor: default;
    color: #fff;
    background: #337ab7;
    border-color: #337ab7;
  }
}
</style>
