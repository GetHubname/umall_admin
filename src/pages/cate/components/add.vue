<template>
  <div class="add">
    <el-dialog
      :title="info.isAdd ? '添加商品分类' : '修改商品分类'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="上级分类">
          <el-select
            v-model="form.pid"
            placeholder="请选择"
            @change="changeType()"
          >
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="form.catename"></el-input>
        </el-form-item>
        <el-form-item label="图片" v-if="form.pid != 0">
          <!-- <div class="my-upload">
            <h3>+</h3>
            <img :src="imgUrl" class="img" alt="" />
            <input v-if="info.isshow" type="file" class="my-input" @change="getFile"/>
          </div> -->
          <!-- element-ui上传图片 -->
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="getFile2"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
import { reqGet, reqPost, reqFile } from "../../../utils/request";
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alter";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      isshow: true,
      imgUrl: "",
      form: {
        pid: 0,
        catename: "",
        img: null,
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      list: "cate/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqList",
    }),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.form = {
        pid: 0,
        catename: "",
        img: null,
        status: 1,
      };
      this.imgUrl = "";
    },
    getFile(e) {
      let file = e.target.files[0];
      let imgExtArr = [".jpg", ".png", ".jpeg", ".gif"];
      let extname = file.name.slice(file.name.lastIndexOf("."));
      if (!imgExtArr.some((item) => item == extname)) {
        warningAlert("文件格式不正确");
        return;
      }
      this.imgUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
    getFile2(e) {
      let file = e.raw;

      
      //URL.createObjectURL() 可以通过文件生成一个地址
      this.imgUrl = URL.createObjectURL(file);

      //将文件保存在form.img
      this.form.img = file;
    },
    add() {
        
      reqFile("/api/cateadd", {
        pid: this.form.pid,
        catename: this.form.catename,
        img: this.form.img,
        status: this.form.status,
      }).then((res) => {
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
      reqFile("/api/cateedit", this.form).then((res) => {
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
      reqGet("/api/cateinfo", { id: id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          //给form添加id
          this.form.id = id;
          this.imgUrl = this.$imgPre + this.form.img;
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
};
</script>
<style lang='stylus' scoped>
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
/* element-ui */
.add >>> .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>