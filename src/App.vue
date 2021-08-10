<template>
  <v-app>
    <Header v-show="this.$route.meta['showHeader']" :navs="navs" />
    <v-main>
      <router-view />
    </v-main>
    <Login />
    <SnackBar />
    <BottomNavigation
      v-show="this.$route.meta['showNavigation']"
      :navs="navs"
      class="d-flex d-sm-none"
    />
  </v-app>
</template>

<script>
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";

export default {
  name: "App",
  data: () => ({
    navs: Object.freeze([
      {
        path: "/",
        text: "主页",
        icon: "mdi-home"
      },
      {
        path: "/project",
        text: "分析中心",
        icon: "mdi-cloud"
      },
      {
        path: "/about",
        text: "关于我们",
        icon: "mdi-account-supervisor"
      }
    ])
  }),
  components: {
    Login: () => import(/* webpackChunkName: "login" */ "@/components/Login"),
    SnackBar: () =>
      import(/* webpackChunkName: "snackbar" */ "@/components/SnackBar"),
    Header,
    BottomNavigation
  }
};
</script>
<style lang="scss">
@supports (-webkit-touch-callout: none) {
  .v-main {
    margin-top: env(safe-area-inset-top) !important;
    padding-left: env(safe-area-inset-left) !important;
    padding-right: env(safe-area-inset-right) !important;
    margin-bottom: env(safe-area-inset-bottom) !important;
  }
}
</style>
