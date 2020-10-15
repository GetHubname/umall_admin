import {reqGet,reqPost} from '../../utils/request'
const state={
    list:[]
}
const mutations={
    changeList(state,data){
        state.list=data
    }
}
const actions={
    reqList(context){
        reqGet('/api/secklist').then(res=>{
            let list=res.data.list?res.data.list:[]
            context.commit('changeList',list)
        })
    }
}
const getters={
    list(state){
        return state.list
    }
}
export default {
    state,
    mutations,
    actions,
    getters,
    namespaced:true
}
