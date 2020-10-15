import { reqGet } from "../../utils/request"

const state={
    list:[],
    total:0,
    page:1,
    size:2
}
const mutations={
    changeList(state,arr){
        state.list=arr
    },
    changeTotal(state,total){
        state.total=total
    },
    changePage(state,page){
        state.page=page
    },
}
const actions={
    reqList(context){
        reqGet('/api/goodslist',{size:context.state.size,page:context.state.page}).then(res=>{
            let list=res.data.list?res.data.list:[];
            if(context.state.page>1&&list.length==0){
                context.commit('changePage',context.state.page-1);
                context.dispatch('reqList');
                return;
            }
            context.commit('changeList',list)
        })
    },
    reqTotal(context){
        reqGet('/api/goodscount').then(res=>{
            context.commit('changeTotal',res.data.list[0].total)
        })
    },
    changePageAction(context,page){
        context.commit('changePage',page);
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