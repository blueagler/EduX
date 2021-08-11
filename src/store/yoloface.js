const { spawn } = require("child_process");
import path from "path";

const fs = require("fs");
const progressFile = (name) =>
  `${path.join(process.cwd(), `/resources/yoloface/${name}.txt`)}`;

function throttle(fn, delay) {
  let previous = 0;
  return function () {
    let _this = this;
    let args = arguments;
    let now = new Date();
    if (now - previous > delay) {
      fn.apply(_this, args);
      previous = now;
    }
  };
}

export default {
  namespaced: true,
  state: {
    videoList: [],
    analysing: null,
    output: "",
  },
  mutations: {
    SET_VIDEO_LIST(state, value) {
      state.videoList = value;
      if (JSON.parse(localStorage.getItem("videoList")) !== value) {
        localStorage.setItem("videoList", JSON.stringify(value));
      }
    },
    SET_ANALYSING(state, value) {
      state.analysing = value;
    },
    APPEND_OUTPUT(state, value) {
      state.output += `</br>${value}`;
    },
  },
  actions: {
    async addVideo({ commit, getters, dispatch }, file) {
      let videoList = getters.getVideoList;
      videoList.push({
        name: file.name,
        path: file.path,
        complete: false,
        fail: false,
        progress: 0,
      });
      commit("SET_VIDEO_LIST", videoList);
      dispatch("startAnalysis");
    },
    async startAnalysis({ commit, getters, dispatch }) {
      let videoList = getters.getVideoList;
      let waitList = videoList.filter(
        (a) => a["complete"] === false && a["fail"] === false
      );

      function success() {
        videoList[
          videoList.findIndex((el) => el["name"] === waitList[0]["name"])
        ]["complete"] = true;
        commit("SET_VIDEO_LIST", videoList);
        commit("SET_ANALYSING", null);
        setTimeout(() => {
          dispatch("startAnalysis");
        }, 3000);
      }

      function error() {
        videoList[
          videoList.findIndex((el) => el["name"] === waitList[0]["name"])
        ]["fail"] = true;
        commit("SET_VIDEO_LIST", videoList);
        commit("SET_ANALYSING", null);
        setTimeout(() => {
          dispatch("startAnalysis");
        }, 3000);
      }

      if (!getters.getAnalysing && waitList.length > 0) {
        // console.log(waitList);
        let yoloface = spawn("python", [
          `${path.join(process.cwd(), "/resources/yoloface/yoloface.py")}`,
          `--video=${waitList[0]["path"]}`,
        ]);
        // commit(
        //   "APPEND_OUTPUT",
        //   `${path.join(process.cwd(), "/resources/yoloface/yoloface.py")}`
        // );
        // commit("APPEND_OUTPUT", `--video=${waitList[0]["path"]}`);
        yoloface.stdout.on("data", (data) => {
          throttle(() => {
            commit("SET_ANALYSING", waitList[0]["name"]);
            fs.readFile(
              progressFile(waitList[0]["name"]),
              "utf8",
              function (err, data) {
                if (err) {
                  console.log(err);
                } else {
                  videoList[
                    videoList.findIndex(
                      (el) => el["name"] === waitList[0]["name"]
                    )
                  ]["progress"] = parseFloat(data);
                }
              }
            );
          }, 1000);
          commit("APPEND_OUTPUT", `stdout: ${data}`);
        });
        yoloface.stderr.on("data", (data) => {
          error();
          commit("APPEND_OUTPUT", `stderr: ${data}`);
        });
        yoloface.on("close", (code) => {
          if (code === 0) {
            success();
          } else {
            error();
          }
          commit("APPEND_OUTPUT", `child process exited with code ${code}`);
        });
      }
    },
  },
  getters: {
    getVideoList: (state) => state.videoList,
    getAnalysing: (state) => state.analysing,
    getOutput: (state) => state.output,
  },
};
