import vue from "vue";
import vueRouter from "vue-router";

vue.use(vueRouter);

let routes = [
  {
    path: "/error",
    name: "error",
    text: "에러메인",
    component: () => import("@/views/error/Error.vue"),
    meta: {
      useMain: false
    },
    redirect: { name: "tableNotFound" },
    children: [
      {
        path: "tableNotFound",
        name: "tableNotFound",
        component: () => import("@/views/error/TableNotFoundError.vue")
      }
    ]
  },
  {
    path: "",
    redirect: { name: "tableNotFound" }
  },
  {
    path: "/",
    redirect: { name: "tableNotFound" }
  },
  {
    path: "/:tableName",
    name: "main",
    text: "메인",
    component: () => import("@/views/Main.vue"),
    meta: {
      useMain: true
    },
    redirect: { name: "viewRule" },
    children: [
      {
        path: "rules",
        text: "Rule View",
        name: "viewRule",
        icon: "mdi-alert-octagon",
        component: () => import("@/views/rules/ViewRule.vue"),
        props: true
      },
      {
        path: "result",
        text: "Result",
        name: "viewResult",
        icon: "mdi-alert-octagon",
        component: () => import("@/views/results/Result.vue"),
        props: true
      }
      // , {
      //     path: '/rule/change',
      //     text: 'Rule Change',
      //     name: 'changeRule',
      //     icon: 'mdi-send',
      //     component: () => import("@/views/rule/change/ChangeRule.vue"),
      //     props: true
      // }
    ]
  }
];

export default new vueRouter({
  mode: "history",
  base: "/",
  routes: routes
});
