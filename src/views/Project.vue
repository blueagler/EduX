<template>
  <div>
    <UploadVideo :open="openUpload" @close="openUpload = false" />
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      class="ma-6 di"
      hide-default-footer
    >
      <template v-slot:header>
        <v-hover>
          <template v-slot:default="{ hover }">
            <v-toolbar
              :class="`elevation-${hover ? 24 : 12}`"
              class="mb-1 float-toolbar"
              dark
            >
              <v-toolbar-title>分析中心</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                class="mx-1"
                clearable
                flat
                hide-details
                label="搜索"
                prepend-inner-icon="mdi-magnify"
                solo-inverted
              ></v-text-field>
              <template v-if="$vuetify.breakpoint.mdAndUp">
                <v-spacer></v-spacer>
                <v-select
                  v-model="sortBy"
                  :items="keys"
                  class="mx-1"
                  flat
                  hide-details
                  label="排序"
                  prepend-inner-icon="mdi-magnify"
                  solo-inverted
                ></v-select>
                <v-spacer></v-spacer>
              </template>
              <v-btn class="ml-2" large outlined @click="openUpload = true">
                <span>上传</span>
                <span class="d-none d-sm-flex">视频</span>
                <v-icon>mdi-video</v-icon>
              </v-btn>
            </v-toolbar>
          </template>
        </v-hover>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.id"
            cols="12"
            lg="3"
            md="4"
            sm="6"
          >
            <v-card :color="bgColor(item)" dark>
              <v-card-title class="subheading font-weight-bold">
                {{ item.name }}
              </v-card-title>

              <v-divider></v-divider>
              <v-list dense flat rounded color="transparent">
                <v-list-item-group>
                  <v-list-item v-for="(key, index) in keys" :key="index">
                    <v-list-item-content>
                      {{ key.label }}:
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      {{ item[key.key.toLowerCase()] }}
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <v-progress-linear
                :value="item['progress']"
                v-if="item['id'] === analysing"
                color="white"
              ></v-progress-linear>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!item.complete"
                  text
                  @click="showReport(item.id)"
                  outlined
                >
                  查看报告
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row align="center" class="bb" justify="center">
          <span class="ml-4 white--text">每页项目</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                class="ml-2"
                color="primary"
                dark
                text
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-2 white--text">
            第 {{ page }} 页, 共 {{ numberOfPages }} 页
          </span>
          <v-btn class="mr-2 bn" dark fab @click="formerPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn class="mr-2 bn" dark fab @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Project",
  data: () => ({
    openUpload: false,
    itemsPerPageArray: [2, 4, 6, 8, 10, 12],
    search: "",
    filter: {},
    page: 1,
    itemsPerPage: 4,
    sortBy: "name",
    keys: [
      { key: "path", label: "路径" },
      { key: "id", label: "ID" },
    ],
  }),
  computed: {
    ...mapGetters({
      items: "yoloface/getVideoList",
      analysing: "yoloface/getAnalysing",
    }),
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
  },
  methods: {
    bgColor(item) {
      if (item["fail"]) {
        return "red";
      } else if (item["id"] === this.analysing) {
        return "blue";
      } else if (item["complete"]) {
        return "success";
      } else {
        return "grey";
      }
    },
    getime(time = +new Date()) {
      var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
      return date.toJSON().substr(0, 19).replace("T", " ");
    },
    showReport(name) {
      this.$router.push(`/report/${name}`);
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
  },
  components: {
    UploadVideo: () =>
      import(/* webpackChunkName: "upload_video" */ "@/components/UploadVideo"),
  },
};
</script>

<style lang="scss" scoped>
.di {
  margin-top: 94px !important;

  .float-toolbar {
    position: fixed;
    top: 76px;
    width: 90%;
    left: 5%;
    z-index: 1;
    border-radius: 5px;
    backdrop-filter: saturate(180%) blur(20px);
    background: #0000007d;
  }

  .bn {
    background: #0000007d !important;
    backdrop-filter: saturate(180%) blur(20px);
  }

  @media (max-width: 600px) {
    & {
      margin-bottom: 86px !important;
    }
    .bb {
      position: fixed;
      left: 0;
      right: 0;
      margin-left: 0;
      margin-right: 0;
      bottom: 68px;
      background: #00000040;
      backdrop-filter: saturate(180%) blur(20px);
      padding: 8px;
    }
  }
}
</style>
