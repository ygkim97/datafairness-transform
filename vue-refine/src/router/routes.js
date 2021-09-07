import vue from 'vue'
import vueRouter from 'vue-router'

vue.use(vueRouter)

var routes = [{
        path : '/:tableName',
        component: () => import("@/views/layout/MainPanel.vue"),
        props: true
    },{
        Name: 'View',
        path: '/view/:tableName',
        component: () => import("@/views/ViewRule.vue"),
        props: true
    }, {
        Name: 'Update',
        path: '/update/:tableName',
        component: () => import("@/views/UpdateRule.vue"),
        props: true
    }]

export default new vueRouter({
    mode: 'history',
    base: '/',
    routes: routes
})