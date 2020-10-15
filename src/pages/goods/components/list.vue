<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="商品编号" sortable width="120">
      </el-table-column>
      <el-table-column prop="goodsname" label="商品名称" sortable width="130">
      </el-table-column>
      <el-table-column label="商品价格" width="120">
        <template slot-scope="scope">{{scope.row.price|filterPrice}}</template>
      </el-table-column>
      <el-table-column label="市场价格" width="120">
        <template slot-scope="scope">{{scope.row.market_price|filterPrice}}</template>
      </el-table-column>
      <el-table-column label="图片" width="150">
        <template slot-scope="scope">
          <img :src="$imgPre+scope.row.img" alt="">
        </template>
      </el-table-column>
      <el-table-column label="是否新品" width="80">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.isnew == 1"
            >是</el-button
          >
          <el-button v-else type="info">否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否热卖" width="80">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.ishot == 1"
            >是</el-button
          >
          <el-button v-else type="info">否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
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
      list: "goods/list",
      total:'goods/total',
      size:'goods/size'
    }),
  },
  methods: {
    ...mapActions({
      reqList: "goods/reqList",
      reqTotal:'goods/reqTotal',
      changePageAction:'goods/changePageAction'
    }),
    edit(id){
        this.$emit('edit',id)
    },
    del(id) {
        reqPost("/api/goodsdelete", { id: id }).then((res) => {
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
img{
  width: 100px;
  height: 100px;
}
</style>