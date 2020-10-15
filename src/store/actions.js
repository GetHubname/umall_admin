import {reqPost} from '../utils/request'
export default {
    changeUserInfoAction(context,info){
        context.commit('changeUserInfo',info)
    }
}