<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加菜单' : '修改菜单'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select
            v-model="form.pid"
            placeholder="请选择上级菜单"
            @change="changeType()"
          >
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio v-model="form.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="form.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>
        <el-form-item label="菜单图标" v-if="form.type == 1">
          <el-select v-model="form.icon" placeholder="">
            <el-option v-for="item in icons" :key="item" :value="item">
              <i :class="item"></i>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单地址" v-if="form.type == 2">
          <el-select v-model="form.url" placeholder="请选择上级菜单">
            <el-option
              v-for="item in indexRoutes"
              :key="item.path"
              :label="item.name"
              :value="'/' + item.path"
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
import { reqGet, reqPost,req2 } from "../../../utils/request";
import { mapGetters, mapActions } from "vuex";
import { indexRoutes } from "../../../router/index";
import { successAlert, warningAlert } from "../../../utils/alter";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      isshow: true,
      icons: [
        "el-icon-s-tools",
        "el-icon-user",
        "el-icon-camera",
        "el-icon-message-solid",
      ],
      //路由
      indexRoutes: indexRoutes,
      form: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      list: "menu/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "menu/reqList",
    }),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.form = {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      };
    },
    add() {
      if(this.form.title==''){
        warningAlert('菜单名称不能为空');
        return;
      }
      if(this.form.type==1&&this.form.icon==''){
        warningAlert('菜单图标不能为空');
        return;
      }
      if(this.form.type==2&&this.form.url==''){
        warningAlert('菜单地址不能为空');
        return;
      }
      reqPost("/api/menuadd", {
        pid: this.form.pid,
        title: this.form.title,
        icon: this.form.icon,
        type: this.form.type,
        url: this.form.url,
        status: this.form.status,
      }).then((res) => {
        console.log(res);
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
      if(this.form.title==''){
        warningAlert('菜单名称不能为空');
        return;
      }
      if(this.form.type==1&&this.form.icon==''){
        warningAlert('菜单图标不能为空');
        return;
      }
      if(this.form.type==2&&this.form.url==''){
        warningAlert('菜单地址不能为空');
        return;
      }
      reqPost("/api/menuedit", {
        id: this.form.id,
        pid: this.form.pid,
        title: this.form.title,
        icon: this.form.icon,
        type: this.form.type,
        url: this.form.url,
        status: this.form.status,
      }).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.reqList();
        }else {
          warningAlert(res.data.msg);
        }
      });

    },
    look(id) {
      reqGet("/api/menuinfo", { id: id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          //给form添加id
          this.form.id = id;
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
<style scoped>
</style>