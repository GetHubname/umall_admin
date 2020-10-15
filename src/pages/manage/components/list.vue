<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="用户编号" sortable width="130">
      </el-table-column>
      <el-table-column prop="username" label="用户名" sortable width="180">
      </el-table-column>
      <el-table-column prop="rolename" label="所属角色">
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
          <el-button type="success" @click="edit(scope.row.uid)">编辑</el-button>
          <del-btn @confirm="del(scope.row.uid)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="size"
    @current-change="changePage"
    >
    </el-pagination>
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
    return {
    };
  },
  computed: {
    ...mapGetters({
      list: "manage/list",
      total:'manage/total',
      size:'manage/size'
    }),
  },
  methods: {
    ...mapActions({
      reqManageList: "manage/reqList",
      reqTotal:'manage/reqTotal',
      changePageAction:'manage/changePage'
    }),
    edit(id){
        this.$emit('edit',id)
    },
    del(uid) {
        reqPost("/api/userdelete", { uid: uid }).then((res) => {
            if(res.data.code==200){
                successAlert(res.data.msg)
                this.reqManageList();
                this.reqTotal()
            }else{
                warningAlert(res.data.msg)
            }
        });
    },
    changePage(e){
        this.changePageAction(e)
        
    }
  },
  mounted() {
    this.reqManageList();
    this.reqTotal()
  },
};
</script>
<style scoped>
</style>