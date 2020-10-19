<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加商品规格' : '修改商品规格'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="规格名称">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>
        <el-form-item label="规格属性" v-for="(item, index) in attrArr"
          :key="index">
          <div class="con">
            <div class="input-wrap">
              <el-input v-model="item.value"></el-input>
            </div>
            <el-button type="primary" @click="addAttr" v-if="index==0">新增商品规格</el-button>
            <el-button type="danger" @click="del(index)" v-else>删除</el-button>
          </div>
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
      isshow: true,
      attrArr: [{ value: "" }, { value: "" }],
      form: {
        specsname: "",
        attrs: '',
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      list: "specs/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "specs/reqList",
      reqTotal:'specs/reqTotal'
    }),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.attrArr=[{ value: "" }, { value: "" }];
      this.form = {
        specsname: "",
        attrs: '',
        status: 1,
      };
    },
    addAttr(){
      this.attrArr.push({ value: "" })
    },
    del(index){
      this.attrArr.splice(index,1)
    },
    checkedData(){
      if(this.form.specsname==''){
        warningAlert("规格名称不能为空");
        return false;
      }
      if(this.attrArr.some(item=>item.value=='')){
        warningAlert('所有的属性值都必填');
        return false
      }
      return true;
    },
    add() {
      this.form.attrs=JSON.stringify(this.attrArr.map(item=>item.value));
      if(!this.checkedData()){
        return
      }
      reqPost("/api/specsadd", this.form).then((res) => {
        console.log(res);
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
      this.form.attrs=JSON.stringify(this.attrArr.map(item=>item.value))
      if(!this.checkedData()){
        return
      }
      reqPost("/api/specsedit", this.form).then((res) => {
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
      reqGet("/api/specsinfo", { id: id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list[0];
          //给form添加id
          this.attrArr=JSON.parse(this.form.attrs).map(item=>({value:item}))
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },
  },
  mounted(){
  }
};
</script>
<style scoped>
.con{
  display: flex;
}
.input-wrap{
  flex:1
}
</style>