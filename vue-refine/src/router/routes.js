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
    name: "noty",
    component: () => import("@/views/default/Noty.vue")
  },
  {
    path: "/",
    redirect: { name: "noty" }
  },
  {
    path: "/dqi/:tableName",
    name: "main",
    text: "메인",
    component: () => import("@/views/dqi/DQIMain.vue"),
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
        component: () => import("@/views/dqi/rules/ViewRule.vue"),
        props: true
      },
      {
        path: "result",
        text: "Result",
        name: "viewResult",
        icon: "mdi-alert-octagon",
        component: () => import("@/views/dqi/results/ViewResult.vue"),
        props: true
      },
      {
        path: "correction",
        text: "Correction",
        name: "viewCorrection",
        component: () => import("@/views/dqi/results/ViewCorrection.vue")
      }
    ]
  },
  {
    path: "/afi/:tableName",
    name: "main",
    text: "메인",
    component: () => import("@/views/afi/AFIMain.vue"),
    meta: {
      useMain: true
    },
    // children: [{
    //   path : "main",
    //   text : "AFI View",
    //   name : 'afiMain',
    //   component: () => import("@/views/afi/data-set.vue"),
    // }]
    // redirect: { name: "viewRule" },
    // children: [~
    //   {
    //     path: "rules",
    //     text: "Rule View",
    //     name: "viewRule",
    //     icon: "mdi-alert-octagon",
    //     component: () => import("@/views/rules/ViewRule.vue"),
    //     props: true
    //   },
    //   {
    //     path: "result",
    //     text: "Result",
    //     name: "viewResult",
    //     icon: "mdi-alert-octagon",
    //     component: () => import("@/views/results/ViewResult.vue"),
    //     props: true
    //   }
    // ]
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
