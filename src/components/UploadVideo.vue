<template>
  <v-dialog
    v-model="open"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="bg d-flex justify-center align-center">
      <v-toolbar class="tb t" dark>
        <v-btn dark icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>上传视频</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="upload"> 上传</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card class="tb c"> aaa</v-card>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "UploadVideo",
  methods: {
    upload() {
    }
  },
  props: {
    open: {
      type: Boolean,
      defaults: () => false
    }
  }
};
</script>

<style scoped>
.bg {
  backdrop-filter: saturate(180%) blur(20px);
  background: #0000001c !important;
}

.t {
  top: calc(env(safe-area-inset-top) + 24px);
  position: fixed;
  left: 5%;
}

.c {
  height: 80%;
}

.tb {
  backdrop-filter: saturate(180%) blur(20px);
  background: #0000006b !important;
  border-radius: 5px;
  width: 90%;
}

@supports (-webkit-touch-callout: none) {
  .v-toolbar {
    padding-left: env(safe-area-inset-left) !important;
    padding-right: env(safe-area-inset-right) !important;
  }
}
</style>
