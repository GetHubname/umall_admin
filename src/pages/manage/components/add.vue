<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加用户' : '修改用户'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="所属角色">
          <el-select v-model="form.roleid"
          placeholder="请选择上级菜单">
          <el-option label="请选择" disabled value=""></el-option>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
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
import { reqGet, reqPost } from "../../../utils/request";
import { mapGetters, mapActions } from "vuex";
import { indexRoutes } from "../../../router/index";
import { successAlert, warningAlert } from "../../../utils/alter";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      roleList: "role/list",
      manageList: "manage/list",
    }),
  },
  methods: {
    ...mapActions({
      reqManageList: "manage/reqList",
      reqRoleList: "role/reqList",
      reqTotal:'manage/reqTotal'
    }),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.form = {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      };
    },
    add() {
      if(this.form.roleid==''){
        warningAlert("所属角色不能为空");
        return;
      }
      if(this.form.username==''){
        warningAlert("用户名不能为空");
        return;
      }
      if(this.form.password==''){
        warningAlert("密码不能为空");
        return;
      }
      reqPost("/api/useradd", {
        roleid: this.form.roleid,
        username: this.form.username,
        password: this.form.password,
        status: this.form.status,
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          //成功
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.reqManageList();
          this.reqTotal();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      if(this.form.roleid==''){
        warningAlert("所属角色不能为空");
        return;
      }
      if(this.form.username==''){
        warningAlert("用户名不能为空");
        return;
      }
      if(this.form.password==''){
        warningAlert("密码不能为空");
        return;
      }
      reqPost("/api/useredit", {
        uid:this.form.uid,
        roleid: this.form.roleid,
        username: this.form.username,
        password: this.form.password,
        status: this.form.status,
      }).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.reqManageList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    look(uid) {
      reqGet("/api/userinfo", { uid: uid }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          //给form添加id
          this.form.password = '';
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
  mounted(){
    if(this.roleList.length==0){
      this.reqRoleList()
    }
  }
};
</script>
<style scoped>
</style>