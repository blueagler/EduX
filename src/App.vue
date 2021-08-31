<template>
  <v-app class="sb">
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
import { mapMutations } from "vuex";

export default {
  name: "App",
  methods: {
    ...mapMutations({
      setVideoList: "yoloface/SET_VIDEO_LIST",
    }),
  },
  mounted() {
    if (localStorage.getItem("videoList")) {
      this.setVideoList(JSON.parse(localStorage.getItem("videoList")));
    }
  },
  data: () => ({
    navs: Object.freeze([
      {
        path: "/",
        text: "主页",
        icon: "mdi-home",
      },
      {
        path: "/project",
        text: "分析中心",
        icon: "mdi-cloud",
      },
      {
        path: "/about",
        text: "关于我们",
        icon: "mdi-account-supervisor",
      },
    ]),
  }),
  components: {
    Login: () => import(/* webpackChunkName: "login" */ "@/components/Login"),
    SnackBar: () =>
      import(/* webpackChunkName: "snackbar" */ "@/components/SnackBar"),
    Header,
    BottomNavigation,
  },
};
</script>
<style lang="scss">
::-webkit-scrollbar {
  display: none;
}
</style>
