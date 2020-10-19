<template>
  <div class="add">
    <el-dialog
      :title="info.isAdd ? '添加活动' : '修改活动'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="活动期限">
          <div class="block">
            <el-date-picker
              v-model="time"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']"
              @change="changeTime"
            >
            </el-date-picker>
          </div>
        </el-form-item>
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
          <el-select
            v-model="form.second_cateid"
            placeholder="请选择"
            @change="changeGoods"
          >
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <el-select v-model="form.goodsid" placeholder="请选择">
            <el-option
              v-for="item in secondGoodsList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
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
import { reqGet, reqPost, req2, reqFile } from "../../../utils/request";
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alter";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      time: "",
      secondCateList: [],
      secondGoodsList: [],
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      list: "banner/list",
      cateList: "cate/list",
      goodsList: "goods/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "seckill/reqList",
      reqCateList: "cate/reqList",
      reqGoodsList: "goods/reqList",
    }),

    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.time = "";
      this.secondCateList = [];
      this.secondGoodsList = [];
      this.form = {
        title: "",
        begintime: 0,
        endtime: 0,
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
    },
    getSecondList() {
      reqGet("/api/catelist", { pid: this.form.first_cateid }).then((res) => {
        this.secondCateList = res.data.list;
      });
    },
    changeFirst() {
      this.form.goodsid = "";
      this.form.second_cateid = "";
      this.getSecondList();
    },
    getSecondGoods() {
      reqGet("/api/goodslist", {
        fid: this.form.first_cateid,
        sid: this.form.second_cateid,
      }).then((res) => {
        this.secondGoodsList = res.data.list;
      });
    },
    changeGoods() {
      this.form.goodsid = "";
      this.getSecondGoods();
    },
    changeTime() {
      this.form.begintime = this.time ? Number(this.time[0].getTime()) : 0;
      this.form.endtime = this.time ? Number(this.time[1].getTime()) : 0;
    },
    can() {
      if (this.form.title == "") {
        warningAlert("活动名称不能为空");
        return false;
      }
      if (this.form.begintime == 0 && this.form.endtime == 0) {
        warningAlert("活动期限不能为空");
        return false;
      }
      if (this.form.begintime < new Date().getTime()) {
        warningAlert("活动已过期");
        return false;
      }
      if (this.form.first_cateid == "") {
        warningAlert("一级分类不能为空");
        return false;
      }
      if (this.form.second_cateid == "") {
        warningAlert("二级分类不能为空");
        return false;
      }
      if (this.form.goodsid == "") {
        warningAlert("商品不能为空");
        return false;
      }
      return true;
    },
    add() {
      if (!this.can()) {
        return;
      }
      reqPost("/api/seckadd", this.form).then((res) => {
        if (res.data.code == 200) {
          //成功
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.reqList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      this.form.begintime = Number(this.form.begintime);
      this.form.endtime = Number(this.form.endtime);
      reqPost("/api/seckedit", this.form).then((res) => {
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
      this.time = [];
      reqGet("/api/seckinfo", { id: id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.getSecondList();
          this.getSecondGoods();
          //给form添加id
          this.form.id = id;
          this.time.push(
            new Date(Number(this.form.begintime)),
            new Date(Number(this.form.endtime))
          );

          console.log(this.form, 111111111111);
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
    this.reqGoodsList(true);
  },
};
</script>
<style lang='stylus' scoped></style>