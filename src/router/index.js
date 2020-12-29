import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './router.js'

Vue.use(Router)
const router = new Router({
    linkActiveClass: 'rou-active',
    base: '/o2o/',
    routes,
    scrollBehavior (to, from, savedPosition) {
        // return 期望滚动到哪个的位置
        if(document.getElementById("scro")){
            document.getElementById("scro").scrollTo(0,0)
        }
    }
})

router.beforeEach((to, from, next) => {
    next()
})// 全局守卫，判断权限
export default router