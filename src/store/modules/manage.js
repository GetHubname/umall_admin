import {reqGet,reqPost} from '../../utils/request'
const state={
    list:[],
    total:0,
    page:1,
    size:2
}
const mutations={
    changeList(state,data){
        state.list=data
    },
    changeTotal(state,total){
        state.total=total
    },
    changePage(state,page){
        state.page=page
    }
}
const actions={
    reqList(context){
        reqGet('/api/userlist',{page:context.state.page,size:context.state.size}).then(res=>{
            let list=res.data.list?res.data.list:[];
            if(context.state.page>1&&list.length==0){
                context.commit("changePage",context.state.page-1)
                context.dispatch("reqList")
                return;
            }
            context.commit('changeList',list)
        })
    },
    reqTotal(context){
        reqGet('/api/usercount').then(res=>{
            context.commit('changeTotal',res.data.list[0].total)
        })
    },
    changePage(context,page){
        context.commit('changePage',page)
        context.dispatch('reqList')
    }
}
const getters={
    list(state){
        return state.list
    },
    total(state){
        return state.total
    },
    size(state){
        return state.size
    }
}
export default {
    state,
    mutations,
    actions,
    getters,
    namespaced:true
}
