<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="规格编号" sortable width="130">
      </el-table-column>
      <el-table-column prop="specsname" label="规格名称" sortable width="180">
      </el-table-column>
      <el-table-column label="规格属性">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.attrs" :key="item">{{item}}</el-tag>
        </template>
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
      list: "specs/list",
      total:'specs/total',
      size:'specs/size'
    }),
  },
  methods: {
    ...mapActions({
      reqList: "specs/reqList",
      reqTotal:'specs/reqTotal',
      changePageAction:'specs/changePage'
    }),
    edit(id){
        this.$emit('edit',id)
    },
    del(id) {
        reqPost("/api/specsdelete", { id: id }).then((res) => {
            if(res.data.code==200){
                successAlert(res.data.msg)
                this.reqList();
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
    this.reqList();
    this.reqTotal()
  },
};
</script>
<style scoped>
</style>