import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
    meta: {
      needAuth: false,
      showHeader: true,
      showNavigation: true,
      title: "主页",
    },
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: {
      needAuth: false,
      showHeader: true,
      showNavigation: true,
      title: "关于",
    },
  },
  {
    path: "/project",
    name: "Project",
    component: () =>
      import(/* webpackChunkName: "project" */ "../views/Project.vue"),
    meta: {
      needAuth: true,
      showHeader: true,
      showNavigation: true,
      title: "项目管理",
    },
  },
  {
    path: "/report/:name",
    name: "Report",
    component: () =>
      import(/* webpackChunkName: "report" */ "../views/Report.vue"),
    meta: {
      needAuth: true,
      showHeader: true,
      showNavigation: true,
      title: "报告",
    },
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  const isLogin = store.getters["auth/isLogin"];

  function startContinue() {
    store.dispatch("progressBar/startProgressBar");
    next();
  }

  if (!isLogin) {
    if (localStorage.getItem("auth")) {
      store.commit("auth/setUser", JSON.parse(localStorage.getItem("auth")));
      startContinue();
    } else {
      if (to.meta["needAuth"]) {
        store.dispatch("auth/showLogin", { redirect: to.fullPath });
      } else {
        startContinue();
      }
    }
  } else {
    startContinue();
  }
});

router.afterEach(async () => {
  store.dispatch("progressBar/stopProgressBar");
});
export default router;
