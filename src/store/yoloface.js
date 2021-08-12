const { spawn } = require("child_process");
import path from "path";

export default {
  namespaced: true,
  state: {
    videoList: [
      {
        name: "CV课堂实测",
        path: "",
        complete: true,
        fail: false,
        progress: 100,
      },
    ],
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
        videoList[
          videoList.findIndex((el) => el["name"] === waitList[0]["name"])
        ]["progress"] = 100;
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
        let yoloface = spawn(
          "python",
          [
            `${path.join(process.cwd(), "/resources/yoloface/yoloface.py")}`,
            `--video=${waitList[0]["path"]}`,
            `--filename=${waitList[0]["name"]}`,
          ],
          {
            cwd: `${path.join(process.cwd(), "/resources/yoloface")}`,
          }
        );
        yoloface.stdout.on("data", (data) => {
          commit("SET_ANALYSING", waitList[0]["name"]);
          if (data.toString().includes("progress:")) {
            const progress = parseInt(
              data.toString().substring(data.toString().length - 2)
            );
            console.log("Progress data", progress);
            videoList[
              videoList.findIndex((el) => el["name"] === waitList[0]["name"])
            ]["progress"] = progress;
            commit("SET_VIDEO_LIST", videoList);
          }
          commit("APPEND_OUTPUT", `stdout: ${data}`);
        });
        yoloface.stderr.on("data", (data) => {
          if (!data.toString().includes("cv::dnn")) {
            error();
            commit("APPEND_OUTPUT", `stderr: ${data}`);
          }
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
