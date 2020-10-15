<template>
  <div class="login">
      <div class="box">
          <h3>登录</h3>
          <div class="line">
              <el-input v-model="form.username" placeholder="请输入账号" clearable></el-input>
          </div>
          <div class="line">
              <el-input v-model="form.password" placeholder="请输入密码" clearable show-password></el-input>
          </div>
          <div class="line">
              <el-button type="primary" @click="login">登录</el-button>
          </div>
      </div>
  </div>
</template>
<script>
//import {reqGet,reqPost} from '../utils/request'
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from '../../utils/alter';
import { reqPost } from '../../utils/request';
export default {
  props: [],
  components: {},
  data() {
    return {
      form:{
        username:"",
        password:""
      }
    };
  },
  computed: {
    ...mapActions({
      userInfo:"userInfo"
    }),
  },
  methods: {
    ...mapActions({
      changeUserInfoAction:'changeUserInfoAction'
    }),
    login(){
      reqPost('/api/userlogin',this.form).then(res=>{
        if(res.data.code==200){
          successAlert(res.data.msg)
          this.changeUserInfoAction(res.data.list);
          this.$router.push('/')
        }else{
          warningAlert(res.data.msg)
        }
      })
    }
  },
};
</script>
<style scoped>
.login{
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to right,#553443,#303D60);
    position: relative;
}
.box{
    width: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    padding: 30px;
    text-align: center;
    border-radius: 10px;
    box-sizing: border-box;
}
.line{
    margin-top: 20px;
}
</style>