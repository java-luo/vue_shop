import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
  {
    path: "/",
    redirect:"/login"
  },
  {
    path: "/login",
    component: ()=>import("../components/Login"),
    meta:{
      "title":"登陆"
    }
  },
  {
    path: "/home",
    component: ()=> import("../components/Home"),
    meta:{
      "title":"Home"
    }
  }

]

const router = new VueRouter({
  routes,
  mode:"history",
})
//路由导航守卫 用来实现权限管理
router.beforeEach((to,from,next)=>{
  document.title=to.meta.title
  if (to.path === "/login") return next()
  let token = window.sessionStorage.getItem("token")
  if (token != null) return next()
  next("/login")

})


export default router
