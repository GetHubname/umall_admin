import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'

//开发环境下使用
Vue.prototype.$imgPre="http://localhost:3000"
const baseUrl = '/api';
// 打包
// Vue.prototype.$imgPre=""
// let baseUrl = "";

//响应拦截：服务端响应组件，每次都要做的事，return内容是组件收到的真正的数据
axios.interceptors.response.use(res=>{
  console.group("=====本次请求路径是:"+res.config.url)
  console.log(res);
  console.groupEnd()

  return res;
})
export const reqGet = (requrl, params) => {
  if(params){
    return axios({
      method: 'get',
      url: baseUrl + requrl,
      params
    })
  }else{
    return axios({
      method: 'get',
      url: baseUrl + requrl,
    })
  }
}
export const reqPost = (requrl, data) => {
  if(data){
    return axios({
      method: 'post',
      url: baseUrl + requrl,
      data:qs.stringify(data)
    })
  }else{
    return axios({
      method: 'post',
      url: baseUrl + requrl,
    })
  }
}
//上传文件
export const reqFile = (requrl, params) => {
  let data=new FormData();
  for(let i in params){
    data.append(i,params[i])
  }
  return axios({
    method: 'post',
    url: baseUrl + requrl,
    data:data
  })
}
