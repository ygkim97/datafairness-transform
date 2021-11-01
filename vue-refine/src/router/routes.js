import vue from "vue";
import vueRouter from "vue-router";
import store from "@/store/index.js";

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
        component: () => import("@/views/results/ViewResult.vue"),
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

const router = new vueRouter({
  mode: "history",
  base: "/",
  routes: routes
});

router.beforeEach((to, from, next) => {
  store.commit("spinnerOn");
  setTimeout(() => {
    next();
  }, 1);
});
router.afterEach((_) => {
  store.commit("spinnerOff");
});

export default router;
