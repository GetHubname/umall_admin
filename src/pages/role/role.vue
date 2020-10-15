<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <v-list @edit='edit'></v-list>
    <v-add :info="info" ref="add"></v-add>
  </div>
</template>
<script>
//import {reqGet,reqPost} from '../utils/request'
import { mapGetters, mapActions } from "vuex";
import vList from './components/list'
import vAdd from './components/add'
export default {
  props: [],
  components: {
      vList,
      vAdd
  },
  data() {
    return {
        info:{
            isshow:false,
            isAdd:true
        }
    };
  },
  computed: {
    ...mapActions({}),
  },
  methods: {
    ...mapActions({}),
    willAdd(){
        this.info.isshow=true;
        this.info.isAdd=true;
    },
    edit(id){
        this.info.isshow=true;
        this.info.isAdd=false;
        this.$refs.add.look(id)
    }
  },
};
</script>
<style scoped>
</style>