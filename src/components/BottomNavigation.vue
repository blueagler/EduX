<template>
  <v-bottom-navigation app class="bn" dark grow shift>
    <v-btn v-for="nav in navs" :key="nav.name" :to="{ path: nav.path }" plain>
      <span>{{ nav.text }}</span>
      <v-icon>{{ nav.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "BottomNavigation",
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
  }
};
</script>

<style lang="scss">
.bn {
  backdrop-filter: saturate(180%) blur(20px);
  background: #000000ba !important;
}

@supports (-webkit-touch-callout: none) {
  .v-bottom-navigation {
    height: calc(env(safe-area-inset-bottom) + 56px) !important;
    padding-bottom: env(safe-area-inset-bottom) !important;
    padding-left: env(safe-area-inset-left) !important;
    padding-right: env(safe-area-inset-right) !important;

    .v-btn {
      background-color: transparent !important;
      height: 100% !important;
    }
  }
}
</style>
