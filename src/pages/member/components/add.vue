<template>
  <div>
    <el-dialog
      title="会员修改"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="手机号">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <p>留空不修改</p>
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
        <el-button type="primary" @click="update()">修 改</el-button>
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
      form: {
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      list: "member/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "member/reqList",
    }),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.form = {
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      };
    },
    update() {
        if(this.form.password==''){
            warningAlert('密码不能为空')
            return
        }
      reqPost("/api/memberedit", this.form).then((res) => {
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
    look(uid) {
      reqGet("/api/memberinfo", { uid: uid }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.password=''
          //给form添加id
          this.form.uid = uid;
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