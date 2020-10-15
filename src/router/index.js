import Vue from 'vue'
import Router from 'vue-router'
import store from "../store"
Vue.use(Router)

const login=()=>import('../pages/login/login')
const index=()=>import('../pages/index/index')
const banner=()=>import('../pages/banner/banner')
const cate=()=>import('../pages/cate/cate')
const goods=()=>import('../pages/goods/goods')
const home=()=>import('../pages/home/home')
const manage=()=>import('../pages/manage/manage')
const member=()=>import('../pages/member/member')
const menu=()=>import('../pages/menu/menu')
const role=()=>import('../pages/role/role')
const seckill=()=>import('../pages/seckill/seckill')
const specs=()=>import('../pages/specs/specs')

function checkedEnter(path, next) {
  let menus_url = store.state.userInfo.menus_url;
  if (menus_url.includes(path)) {
    next()
  } else {
    next("/")
  }
}

export let indexRoutes=[
  {
    path:'menu',
    name:'菜单管理',
    component:menu,
    beforeEnter(to, from, next) {
      checkedEnter('/menu', next)
    }
  },
  {
    path:'role',
    name:'角色管理',
    component:role,
    beforeEnter(to, from, next) {
      checkedEnter('/role', next)
    }
  },
  {
    path:'manage',
    name:'管理员管理',
    component:manage,
    beforeEnter(to, from, next) {
      checkedEnter('/manage', next)
    }
  },{
    path:'cate',
    name:'商品分类',
    component:cate,
    beforeEnter(to, from, next) {
      checkedEnter('/cate', next)
    }
  },{
    path:'specs',
    name:'商品规格',
    component:specs,
    beforeEnter(to, from, next) {
      checkedEnter('/specs', next)
    }
  },{
    path:'goods',
    name:'商品管理',
    component:goods,
    beforeEnter(to, from, next) {
      checkedEnter('/goods', next)
    }
  },{
    path:'member',
    name:'会员管理',
    component:member,
    beforeEnter(to, from, next) {
      checkedEnter('/member', next)
    }
  },{
    path:'seckill',
    name:'秒杀活动',
    component:seckill,
    beforeEnter(to, from, next) {
      checkedEnter('/seckill', next)
    }
  }
  ,{
    path:'banner',
    name:'轮播图管理',
    component:banner,
    beforeEnter(to, from, next) {
      checkedEnter('/banner', next)
    }
  }
]

let router=new Router({
  routes: [
    {
      path:'/login',
      component:login
    },
    {
      path:'/',
      component:index,
      children:[
        {
          path:'',
          component:home
        },
        ...indexRoutes
      ]
    }
  ]
})
router.beforeEach((to,from,next)=>{
  if(to.path=='/login'){
    next();
    return;
  }
  if(store.state.userInfo.token){
    next();
    return;
  }
  next('/login');
})
export default router