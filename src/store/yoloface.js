const { spawn } = require("child_process");
import path from "path";
import config from "../config";
import { genarateId } from "../utils";
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
        timestamp: 0,
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
      state.output += `${value}</br>`;
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
        id: genarateId(10),
        timestamp: new Date().getTime(),
      });
      commit("SET_VIDEO_LIST", videoList);
      if (!getters.getAnalysing) {
        dispatch("startAnalysis");
      }
    },
    async startAnalysis({ commit, getters, dispatch }) {
      let videoList = getters.getVideoList;
      let waitList = videoList.filter(
        (a) => a["complete"] === false && a["fail"] === false
      );
      function success() {
        videoList[videoList.findIndex((el) => el["id"] === waitList[0]["id"])][
          "complete"
        ] = true;
        videoList[videoList.findIndex((el) => el["id"] === waitList[0]["id"])][
          "progress"
        ] = 100;
        commit("SET_VIDEO_LIST", videoList);
        commit("SET_ANALYSING", null);
        if (!getters.getAnalysing && waitList.length > 0) {
          dispatch("startAnalysis");
        }
      }

      function error() {
        videoList[videoList.findIndex((el) => el["id"] === waitList[0]["id"])][
          "fail"
        ] = true;
        commit("SET_VIDEO_LIST", videoList);
        commit("SET_ANALYSING", null);
        if (!getters.getAnalysing && waitList.length > 0) {
          dispatch("startAnalysis");
        }
      }

      if (!getters.getAnalysing && waitList.length > 0) {
        commit("SET_ANALYSING", waitList[0]["id"]);
        let yoloface = spawn(
          `${
            process.platform !== "win32"
              ? "python3"
              : `${path.join(
                  process.cwd(),
                  "/resources/yoloface/venv/Scripts/python.exe"
                )}`
          }`,
          [
            "yoloface.py",
            `--video=${waitList[0]["path"]}`,
            `--filename=${waitList[0]["id"]}`,
          ],
          {
            cwd: `${path.join(process.cwd(), "/resources/yoloface")}`,
          }
        );
        yoloface.stdout.on("data", (data) => {
          if (data.toString().includes("progress:")) {
            videoList[
              videoList.findIndex((el) => el["id"] === waitList[0]["id"])
            ]["progress"] = parseInt(
              data.toString().substring(data.toString().length - 3)
            );
            commit("SET_VIDEO_LIST", videoList);
          }
          config["debug"] && commit("APPEND_OUTPUT", `stdout: ${data}`);
        });
        yoloface.stderr.on("data", (data) => {
          if (!data.toString().includes("cv::dnn")) {
            error();
            config["debug"] && commit("APPEND_OUTPUT", `stderr: ${data}`);
          }
        });
        yoloface.on("close", (code) => {
          if (code === 0) {
            success();
          } else {
            error();
          }
          config["debug"] &&
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
