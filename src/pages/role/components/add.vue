<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加角色' : '修改角色'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>
        <el-form-item label="角色权限">
          <el-tree
            ref="tree"
            :data="menuList"
            show-checkbox
            node-key="id"
            :props="{ children: 'children', label: 'title' }"
          >
          </el-tree>
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
import { successAlert, warningAlert } from "../../../utils/alter";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      isshow: true,
      form: {
        rolename:"",
        menus:'[]',
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      menuList: "menu/list",
    }),
  },
  methods: {
    ...mapActions({
      reqMenuList: "menu/reqList",
      reqRoleList: "role/reqList",
    }),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.$refs.tree.setCheckedKeys([]);
      this.form = {
        rolename:"",
        menus:'[]',
        status: 1,
      };
    },
    add() {
      this.form.menus=JSON.stringify(this.$refs.tree.getCheckedKeys());
      console.log(this.form)
      reqPost("/api/roleadd", this.form).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          //成功
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.reqRoleList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      this.form.menus=JSON.stringify(this.$refs.tree.getCheckedKeys())
      reqPost("/api/roleedit", {
        id: this.form.id,
        rolename: this.form.rolename,
        menus: this.form.menus,
        status: this.form.status,
      }).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.reqRoleList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    look(id) {
      reqGet("/api/roleinfo", { id: id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          //给form添加id
          this.form.id = id;
          this.$refs.tree.setCheckedKeys(JSON.parse(this.form.menus))
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
    if(this.menuList.length==0){
      this.reqMenuList();
    }
  }
};
</script>
<style scoped>
</style>