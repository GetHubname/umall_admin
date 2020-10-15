<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加商品' : '修改商品'"
      :visible.sync="info.isshow"
      @closed="close"
      @opened='opened'
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="一级分类">
          <el-select
            v-model="form.first_cateid"
            placeholder="请选择"
            @change="changeFirst"
          >
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid" placeholder="请选择">
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价格">
          <el-input v-model="form.market_price"></el-input>
        </el-form-item>
        <el-form-item label="图片" v-if="form.pid != 0">
          <div class="my-upload">
            <h3>+</h3>
            <img :src="imgUrl" class="img" alt="" />
            <input
              v-if="info.isshow"
              type="file"
              class="my-input"
              @change="getFile"
            />
          </div>
        </el-form-item>
        <el-form-item label="商品规格">
          <el-select
            v-model="form.specsid"
            placeholder="请选择"
            @change="changeSpecs"
          >
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性">
          <el-select v-model="form.specsattr" placeholder="请选择" multiple>
            <el-option
              v-for="item in goodsAttrList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
        <el-form-item label="商品描述">
          <div v-if="info.isshow" id="editor"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add()" v-if="info.isAdd"
          >添 加</el-button
        >
        <el-button type="primary" @click="update()" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { reqFile, reqGet, reqPost } from "../../../utils/request";
import { mapGetters, mapActions } from "vuex";
import { indexRoutes } from "../../../router/index";
import { successAlert, warningAlert } from "../../../utils/alter";
import E from 'wangeditor'
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      imgUrl: "",
      secondCateList: [],
      goodsAttrList: [],
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端要的是'[]'
        isnew: 1,
        ishot: 1,
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
      specsList: "specs/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "goods/reqList",
      reqSpecsList: "specs/reqList",
      reqCateList: "cate/reqList",
      reqTotal: "goods/reqTotal",
    }),
    opened(){
      this.editor = new E('#editor')
      this.editor.create()
      this.editor.txt.html(this.form.description)
    },
    getSecondList() {
      reqGet("/api/catelist", { pid: this.form.first_cateid }).then((res) => {
        this.secondCateList = res.data.list;
      });
    },
    changeFirst() {
      this.form.second_cateid = "";
      this.getSecondList();
    },
    //商品规格发生改变
    changeSpecs() {
      this.form.specsattr = [];
      this.getAttrsArr();
    },
    getAttrsArr() {
      let obj = this.specsList.find((item) => item.id == this.form.specsid);
      this.goodsAttrList = obj.attrs;
    },
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.imgUrl = "";
      this.secondCateList = [];
      this.goodsAttrList = [];
      this.form = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端要的是'[]'
        isnew: 1,
        ishot: 1,
        status: 1,
      };
    },
    getFile(e) {
      let file = e.target.files[0];
      this.imgUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
    add() {
      this.form.description=this.editor.txt.html();
      let data = {
        ...this.form,
        specsattr: JSON.stringify(this.form.specsattr),
      };
      reqFile("/api/goodsadd", data).then((res) => {
        if (res.data.code == 200) {
          //成功
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.reqList();
          this.reqTotal();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      this.form.description=this.editor.txt.html();
      let data={
        ...this.form,
        specsattr:JSON.stringify(this.form.specsattr)
      }
      reqFile("/api/goodsedit", data).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.reqList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    look(id) {
      reqGet("/api/goodsinfo", { id: id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          //给form添加id
          this.form.id = id;
          //获取二级分类
          this.getSecondList()
          //图片
          this.imgUrl = this.$imgPre + this.form.img;
          //商品属性从字符串转为 []
          this.form.specsattr=JSON.parse(this.form.specsattr)
          //获取商品属性的数组
          this.getAttrsArr()
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    changeType() {
      if (this.form.pid == 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },
  },
  mounted() {
    if (this.cateList.length == 0) {
      this.reqCateList();
    }
    this.reqSpecsList(true);
  },
};
</script>
<style scoped>
.my-upload {
  width: 100px;
  height: 100px;
  border: 1px dashed #333;
  position: relative;
}
.my-upload h3 {
  line-height: 100px;
  text-align: center;
}
.my-upload .my-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}
.my-upload .img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>