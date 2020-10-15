<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="角色编号" sortable width="130">
      </el-table-column>
      <el-table-column prop="rolename" label="角色名称" sortable width="350">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status == 1"
            >启用</el-button
          >
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="status">
        <template slot-scope="scope">
          <el-button type="success" @click="edit(scope.row.id)">编辑</el-button>
          <del-btn @confirm="del(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { reqGet, reqPost } from "../../../utils/request";
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from '../../../utils/alter';
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "role/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "role/reqList",
    }),
    edit(id){
        this.$emit('edit',id)
    },
    del(id) {
      reqPost('/api/roledelete',{id}).then(res=>{
        if(res.data.code==200){
          successAlert(res.data.msg);
          this.reqList();
        }else{
          warningAlert(res.data.msg);
        }
      })
    },
  },
  mounted() {
    this.reqList();
  },
};
</script>
<style scoped>
</style>