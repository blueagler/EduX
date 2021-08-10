<template>
  <v-app-bar app class="ab elevation-24" dark>
    <v-toolbar-title> Edu X -> {{ this.$route.meta.title }}</v-toolbar-title>
    <v-progress-linear
      :active="isProgressBarActive"
      :indeterminate="isProgressBarActive"
      absolute
      bottom
      color="accent"
    ></v-progress-linear>
    <v-spacer></v-spacer>
    <v-btn
      v-for="nav in navs"
      :key="nav.name"
      :to="{ path: nav.path }"
      class="d-none d-sm-flex mr-4 nd"
      text
    >
      <span class="mr-2">{{ nav.text }}</span>
      <v-icon>{{ nav.icon }}</v-icon>
    </v-btn>
    <v-menu v-if="isLogin" bottom offset-y rounded>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" class="mx-2 nd" icon x-large>
          <v-avatar color="blue-grey" size="48">
            <span class="white--text headline">{{ getName.slice(-2) }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-list-item-content class="justify-center">
          <div class="mx-auto text-center pa-2">
            <v-avatar color="blue-grey">
              <span class="white--text headline">{{ getName.slice(-2) }}</span>
            </v-avatar>
            <h3 class="my-2">{{ getName }}</h3>
            <v-divider class="my-3"></v-divider>
            <v-btn class="nd" depressed rounded text @click="logout"> 退出登录</v-btn>
          </div>
        </v-list-item-content>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Header",
  props: {
    navs: {
      type: Array,
      default: () => [
        {
          path: "/",
          text: "主页",
          icon: "mdi-home"
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      logout: "auth/logout"
    })
  },
  computed: {
    ...mapGetters({
      isLogin: "auth/isLogin",
      getName: "auth/getName",
      isProgressBarActive: "progressBar/isProgressBarActive"
    })
  }
};
</script>

<style lang="scss">
.ab {
  backdrop-filter: saturate(180%) blur(20px);
  background: #0000009e !important;
  -webkit-app-region: drag;
}

.nd {
  -webkit-app-region: no-drag
}

@supports (-webkit-touch-callout: none) {
  .v-app-bar {
    padding-top: env(safe-area-inset-top) !important;
    padding-left: env(safe-area-inset-left) !important;
    padding-right: env(safe-area-inset-right) !important;
    height: calc(env(safe-area-inset-top) + 64px) !important;
  }
}
</style>
