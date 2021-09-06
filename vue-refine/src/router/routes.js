import vue from 'vue'
import vueRouter from 'vue-router'

vue.use(vueRouter)

var routes = [
    {
        path: '/pageB/:tableName',
        component: () => import("@/components/PageB.vue"),
        name: 'pageB',
        // true로 설정하면 데이터를 props로도 받습니다.
        props: true
    }
]

export default new vueRouter({
    mode: 'history',
    base: '/',
    routes: routes
})