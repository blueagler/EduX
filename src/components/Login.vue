<template>
  <v-dialog
    :value="showLogin"
    app
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <div class="ls d-flex justify-center align-center">
      <v-card class="px-10 py-6 elevation-5">
        <div class="display-4 my-6">TechX</div>
        <div class="headline my-4">登录以继续</div>
        <v-tabs
          v-model="tab"
          background-color="transparent"
          dark
          grow
          icons-and-text
        >
          <v-tab>
            登录
            <v-icon>mdi-account-key</v-icon>
          </v-tab>
          <v-tab>
            注册
            <v-icon>mdi-account-plus</v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-card class="py-6" flat>
              <v-form @submit.prevent="submit('login')">
                <v-text-field
                  v-model="loginForm.name"
                  :rules="[() => !!loginForm.name || '请输入用户名']"
                  dark
                  label="用户名"
                  outlined
                  prepend-icon="mdi-account"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="loginForm.password"
                  :rules="[() => !!loginForm.password || '请输入密码']"
                  dark
                  label="密码"
                  outlined
                  prepend-icon="mdi-key"
                  required
                  type="password"
                ></v-text-field>
                <v-checkbox
                  v-model="loginForm.remember"
                  dark
                  label="自动登录"
                  required
                ></v-checkbox>
                <v-btn
                  :disabled="submitWait"
                  :loading="submitWait"
                  block
                  class="float-right"
                  color="success"
                  type="submit"
                  x-large
                >
                  登录
                  <v-icon> mdi-login</v-icon>
                </v-btn>
              </v-form>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card class="py-6" flat>
              <v-form @submit.prevent="submit('register')">
                <v-text-field
                  v-model="registerForm.name"
                  :rules="[() => !!registerForm.name || '请输入用户名']"
                  dark
                  label="用户名"
                  outlined
                  prepend-icon="mdi-account"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="registerForm.password"
                  :rules="[() => !!registerForm.password || '请输入密码']"
                  dark
                  label="密码"
                  outlined
                  prepend-icon="mdi-key"
                  required
                  type="password"
                ></v-text-field>
                <v-checkbox
                  v-model="registerForm.remember"
                  dark
                  label="自动登录"
                  required
                ></v-checkbox>
                <v-btn
                  :disabled="submitWait"
                  :loading="submitWait"
                  block
                  class="float-right"
                  color="success"
                  type="submit"
                  x-large
                >
                  注册
                  <v-icon> mdi-login</v-icon>
                </v-btn>
              </v-form>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>
  </v-dialog>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Login",
  computed: {
    ...mapState({
      showLogin: (state) => state.auth.showLogin,
      redirectUrl: (state) => state.auth.loginRedirect
    })
  },
  data: () => ({
    loginForm: {
      name: "",
      password: "",
      remember: false
    },
    registerForm: {
      name: "",
      password: "",
      remember: false
    },
    submitWait: false,
    tab: null
  }),
  methods: {
    ...mapActions({
      login: "auth/login",
      snackbar: "snackbar/setSnackbar"
    }),
    submit(type) {
      if (this.submitWait) return;
      let [json, postAction] = [{}, ""];
      const actions = {
        login: () => ([json, postAction] = [this.loginForm, "User"]),
        register: () => ([json, postAction] = [this.registerForm, "Register"])
      };
      actions[type]();
      this.submitWait = true;
      this.login({
        action: postAction,
        ...json
      })
        .then(() => {
          this.snackbar({
            color: "success",
            text: "登陆成功"
          });
          this.submitWait = false;
          if (this.redirectUrl) {
            this.$router.push(this.redirectUrl);
          }
        })
        .catch((msg) => {
          this.submitWait = false;
          this.snackbar({
            color: "error",
            text: msg
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.ls {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7) !important;

  & > .v-card {
    width: 800px;
    height: 800px;
    max-width: 90%;
    max-height: 90%;
    backdrop-filter: saturate(180%) blur(20px);
    background: #0000009e !important;
    color: #fff !important;
    overflow-y: scroll;

    .v-window {
      background-color: transparent !important;

      .v-card {
        background-color: transparent !important;
      }
    }
  }
}
</style>
