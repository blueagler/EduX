<template>
  <div>
    <v-snackbar
      v-for="(snackbar, index) in snackbars.filter((s) => s.showing)"
      :key="index"
      v-model="snackbar.showing"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      class="sb"
      rounded="pill"
      top
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" icon @click="snackbar.showing = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Snackbar",
  computed: {
    ...mapState({
      snackbars: (state) => state.snackbar.snackbars
    })
  }
};
</script>
<style lang="scss" scoped>
.sb {
  top: calc(env(safe-area-inset-top) - 60px) !important;
  position: fixed;
}
</style>
