<template>
  <div class="upload_drawer">
    <div :class="maskClass" @click="closeByMask"></div>
    <div :class="mainClass" :style="mainStyle" class="main">
      <div class="task_drawer_wrap" id="voodTop">
        <div class="task_dialog_title">PIN Task List</div>
        <div class="son_list">
          <span class="son_list_item" @click="changeRoot" v-if="sonList.length">
            root /</span
          >
          <span
            v-for="(item, index) in sonList"
            :key="index"
            class="son_list_item"
            @click="changeTabSon(item, index)"
          >
            {{ item }}/</span
          >
        </div>
        <div class="table_show" v-if="taskList.length && !loading">
          <el-table
            :data="taskList"
            style="width: 100%"
            row-key="id"
            class="right_task_table table-box"
          >
            <el-table-column prop="name" label="Name" width="260px">
              <template #default="scope">
                <div class="name_span" @click="findSon(scope.row)">
                  <!-- <i
                    class="el-icon-folder-opened"
                    v-if="scope.row.file_type === 1"
                  ></i> -->
                  <el-icon v-if="scope.row.file_type === 1" size="22"
                    ><FolderOpened
                  /></el-icon>
                  <!-- <i
                    class="el-icon-document"
                    v-if="scope.row.file_type === 2"
                  ></i> -->
                  <el-icon v-if="scope.row.file_type === 2" size="22"
                    ><Document
                  /></el-icon>
                  <span style="margin-left: 10px">{{ scope.row.name }}</span>
                  <el-icon v-if="scope.row.file_type === 1" size="22"
                    ><ArrowDown
                  /></el-icon>
                  <!-- <i
                    class="el-icon-arrow-down"
                    v-if="scope.row.file_type === 1"
                  ></i> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="total" label="Size" width="120px">
            </el-table-column>
            <el-table-column prop="mystatus" label="Status" width="220px">
              <template #default="scope">
                <!-- <span style="margin-left: 10px" v-show="scope.row.isSuccess">
                  {{ $t(`vood.success`) }}</span
                >
                <span style="margin-left: 10px" v-show="!scope.row.isSuccess">
                  {{ $t(`vood.failed`) }}</span
                > -->
                <span
                  style="margin-left: 10px; color: #34c034"
                  v-show="scope.row.isSuccess"
                  >{{ scope.row.mystatus }}</span
                >
                <span
                  style="margin-left: 10px; color: red"
                  v-show="!scope.row.isSuccess"
                  >{{ scope.row.mystatus }}</span
                >
                <el-icon color="#34c034" v-show="scope.row.isSuccess"
                  ><CircleCheckFilled
                /></el-icon>
                <el-icon color="orange" v-show="!scope.row.isSuccess"
                  ><WarningFilled
                /></el-icon>
                <!-- <i class="el-icon-success" v-show="scope.row.isSuccess"></i>
                <i class="el-icon-warning" v-show="!scope.row.isSuccess"></i> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table_show file_null" v-if="!taskList.length && !loading">
          <img src="@/assets/myood/notfound.svg" />
          <div class="file_null_text">Not Files Found</div>
        </div>
        <div class="table_show file_null" v-if="loading">
          <img src="@/assets/myood/findFileIng.svg" />
          <div class="find_text">Searching...</div>
        </div>
        <div class="task_load_more" v-if="isNextMarket">
          <!-- <div class="task_load_toTop" id="task_load_toTop" @click="backTop">
            <a href="#voodTop"> <i class="el-icon-top"></i></a>
          </div> -->
          <div class="color-box">
            <div class="task_load_more_btn" @click="loadMore">
              <RippleInk></RippleInk>
              Load More
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { oodTaskList } from "@/utils/api.js";
import { getfilesize, transferTime } from "@/utils/util.js";
import RippleInk from "@/components/rippleInk";
export default {
  components: { RippleInk },
  props: {
    display: {
      type: Boolean,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    mask: {
      type: Boolean,
      default: true,
    },
    maskClosable: {
      type: Boolean,
      default: true,
    },
    // width: {
    //   type: String,
    //   default: "1000px",
    // },
    inner: {
      type: Boolean,
      default: false,
    },
    currentOODItems: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    maskClass: function () {
      return {
        "mask-show": this.mask && this.display,
        "mask-hide": !(this.mask && this.display),
        inner: this.inner,
      };
    },
    mainClass: function () {
      return {
        "main-show": this.display,
        "main-hide": !this.display,
        inner: this.inner,
      };
    },
    mainStyle: function () {
      return {
        width: this.width,
        right: this.display ? "0" : `-${this.width}`,
        borderLeft: this.mask ? "none" : "1px solid #eee",
      };
    },
  },
  watch: {
    currentOODItems: {
      handler(data) {
        this.oodID = data.device_id;
      },
      immediate: true,
      deep: true,
    },
    display: {
      handler(data) {
        if (data) {
          this.initData();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    if (this.inner) {
      let box = this.$el.parentNode;
      box.style.position = "relative";
    }
  },
  data() {
    return {
      getfilesize,
      transferTime,
      currentFolder: "",
      currentScroll: "",
      oodID: "",
      taskList: [],
      statusMap: {},
      strMap: {
        TASK_SUCCESS: "Task Succeeded",
        TASK_CREATE: "Task Creation",
        TASK_START: "Task Start",
        TASK_CANCEL: "Task Cancellation",
        TASK_PULLED: "File Acquired",
        TASK_LCACHED: "File Cached",
        TASK_PULL_LIST: "Get File List",
        TASK_PUSHBUCKET: "Store Data",
        UPDATE_META: "Update Metadata",
        UNKNOWN: "Unknown Error",
        UPDATE_META_FAILED: "Failed to update metadata",
        PULLED_FAILED: "Pull Failed",
        PUSHBUCKET_FAILED: "Storage Failed",
        FAILED: "Task Failed",
        TASK_NOT_ENOUGH_SPACE: "Insufficient Space",
        TASK_PUSHBUCKET_FAILED: "Storage Failed",
        TASK_PULLED_FAILED: "Pull Failed",
        TASK_UPDATE_META_FAILED: "Failed to update metadata",
        TASK_FAILED: "Task Failed",
      },
      sonList: [],
      sonListStr: "",
      pathList: [],
      width: "650px",
      loading: false,
      isNextMarket: "",
      currentPrefix: "",
      currentIndex: 0,
    };
  },

  methods: {
    changeRoot() {
      this.isNextMarket = "";
      this.currentPrefix = "";
      this.initData();
    },
    findSon(item) {
      this.isNextMarket = "";
      this.currentPrefix = "";
      if (item.file_type === 1) {
        this.initData(item);
      }
    },
    changeTabSon(item, index) {
      this.isNextMarket = "";
      this.currentPrefix = "";
      if (this.pathList[index]) {
        let prefix = this.pathList[index] + "/";
        this.initData("", prefix);
      } else {
        this.initData();
      }
    },
    loadMore() {
      if (!this.isNextMarket) {
        return;
      }
      this.initData("", this.currentPrefix, this.isNextMarket);
    },
    async initData(tree, _prefix, next_marker) {
      const that = this;
      if (!next_marker) {
        that.taskList = [];
        that.loading = true;
        this.currentIndex = 0;
      }
      this.isNextMarket = "";
      let prefix = "";
      if (tree) {
        let name = tree.name;
        if (name.indexOf("/") > -1) {
          let arr = name.split("/");
          name = arr[arr.length - 1];
        }
        that.sonList.push(name);
        that.sonListStr = this.sonList.join("/");
        that.pathList.push(tree.path);
        if (tree.parentCid) {
          // prefix = tree.parentCid + "/" + tree.name + "/";
          prefix = tree.path + "/";
        } else {
          prefix = tree.cid + "/";
        }
      }
      if (!tree && !_prefix) {
        that.sonList = [];
        that.sonListStr = "";
        prefix = "";
        that.pathList = [];
      }
      if (_prefix) {
        prefix = _prefix;
      }

      that.statusMap = {
        0: "TASK_SUCCESS",
        1: "TASK_CREATE",
        2: "TASK_START",
        3: "TASK_CANCEL",
        4: "TASK_PULLED",
        5: "TASK_LCACHED",
        6: "TASK_PULL_LIST",
        7: "TASK_PUSHBUCKET",
        8: "UPDATE_META",
        9: "UNKNOWN",
        10: "TASK_FAILED",
        11: "TASK_UPDATE_META_FAILED",
        12: "TASK_PULLED_FAILED",
        13: "TASK_PUSHBUCKET_FAILED",
        14: "TASK_NOT_ENOUGH_SPACE",
      };
      let success = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      if (this.oodID) {
        let data = await oodTaskList(this.oodID, next_marker, prefix);
        that.loading = false;
        let tasks = data.tasks;
        let parent = data.parent;
        let parentCid = parent.cid;
        that.currentPrefix = prefix;
        if (data.truncated) {
          this.isNextMarket = data.next_marker;
        } else {
          this.isNextMarket = "";
        }
        for (let i = 0; i < tasks.length; i++) {
          let name = tasks[i].name;
          if (name.indexOf("/") > -1) {
            let arr = name.split("/");
            name = arr[arr.length - 1];
          }
          let item = tasks[i];
          item.name = name;
          item.id = this.currentIndex + 1;
          this.currentIndex = item.id;
          let str = `${that.statusMap[tasks[i].status]}`;
          item.mystatus = `${this.strMap[str]}`;
          item.create_at = that.transferTime(tasks[i].create_at);
          item.isSuccess = success.indexOf(tasks[i].status) > -1;
          item.parentCid = parentCid;
          if (tasks[i].file_type === 1) {
            item.total = "";
          } else {
            item.total = this.getfilesize(tasks[i].total);
          }
          that.taskList.push(item);
        }
        this.currentScroll = data.next_marker;
      }
    },
    closeByMask() {
      this.showChangeBox = false;
      this.maskClosable && this.$emit("update:display", false);
      this.$emit("closeRightUpload");
    },
    // backTop() {
    //   const that = this;
    //   setTimeout(() => {
    //     that.$router.push("voodDetail");
    //   }, 1);
    // },
  },
};
</script>
<style lang="scss">
.right_task_table {
  .cell {
    // color: #000 !important;
    color: var(--text-color) !important;

    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: center;
    font-size: 14px;
    .name_span {
      display: flex;
      align-items: center;
      :deep {
        .el-icon {
          --color: var(--text-color) !important;
        }
      }
    }
    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  td.el-table__cell {
    border-color: #fff !important;
  }
  .el-table__expand-icon {
    // color: #fff !important;
    color: var(--text-color) !important;
  }
  .el-icon-arrow-right {
    font-size: 18px;
    cursor: pointer;
    font-weight: bold;
  }
  .el-icon-arrow-down {
    margin-left: 6px;
  }
  .el-icon-document,
  .el-icon-folder-opened,
  .el-icon-arrow-down {
    font-size: 22px;
  }
  .el-icon-success {
    color: #34c034;
    font-size: 14px;
  }
  .el-icon-warning {
    font-size: 14px;
    color: red;
  }
}
.son_list {
  .son_list_item {
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
      text-decoration: underline;
    }
  }
}
.table_show {
  animation: test 0.1s ease-in;
}
@keyframes test {
  0% {
    transform: translateX(200px);
    // opacity: 0;
  }
  20% {
    // opacity: 0.3;
    transform: translateX(80px);
  }
  40% {
    transform: translateX(60px);
    // opacity: 0.5;
  }
  60% {
    transform: translateX(40px);
    // opacity: 0.5;
  }
  80% {
    // opacity: 0.8;
    transform: translateX(20px);
  }
  100% {
    transform: translateX(0);
    // opacity: 1;
  }
}
.file_null {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 600px;
  img {
    width: 260px;
    // height: 120px;
  }
  .file_null_text {
    margin-top: -60px;
  }
  .find_text {
    color: var(--text-color);
    margin-top: 12px;
  }
}
.task_load_more {
  display: flex;
  width: 100%;
  height: 50px;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  justify-content: center;
  .color-box {
    // .color-box();
    @include color-box;
  }
  .task_load_more_btn {
    border-radius: 50px;
    width: 240px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    // background: linear-gradient(135deg, #6e8efb, #a777e3);
    background: var(--btn-gradient);
    position: relative;
    z-index: 1;
    overflow: hidden;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
      rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
      rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  }
  // .task_load_more_btn::before {
  //   content: "";
  //   position: absolute;
  //   z-index: -1;
  //   top: 50%;
  //   left: 50%;
  //   width: 1rem;
  //   height: 1rem;
  //   transform: translate3d(-50%, -50%, 0) scale(0, 0);
  //   border-radius: 50%;
  //   background-color: #6a79e8;
  //   transform-origin: center;
  //   transition: ease-in-out 0.5s;
  // }

  // .task_load_more_btn:hover::before {
  //   transform: translate3d(-50%, -50%, 0) scale(25, 15);
  // }
  // .task_load_more_btn:hover {
  //   transform: scale(1.08);
  // }
  .task_load_toTop {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-image: linear-gradient(135deg, #c7cad0 0%, #2117f4 100%);
    box-shadow: rgb(50 50 93 / 25%) 0px 50px 100px -20px,
      rgb(0 0 0 / 30%) 0px 30px 60px -30px,
      rgb(10 37 64 / 35%) 0px -2px 6px 0px inset;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    text-align: center;
    i {
      color: #fff;

      color: var(--text-color);
      font-size: 24px;
      font-weight: bold;
    }
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
<style lang="scss" scoped>
.table-box {
  // min-height: 430px;
  // margin-bottom: 40px;
  background: transparent;
  // font-size: 16px;
  :deep {
    tr {
      background: transparent;
    }
    .el-table__header {
      .cell {
        padding-bottom: 10px;
        color: var(--text-color);
        font-weight: 700;
      }
    }
    --el-table-row-hover-bg-color: transparent;
    .el-table__row {
      &:hover {
        background: transparent;
      }
    }
    .el-table__cell {
      color: var(--text-color);
      // background: var(--card-bg);
      background: transparent;
      .cell {
        color: var(--text-color);
        min-height: 25px;
        line-height: 25px;
      }
    }
  }
}
.upload_drawer {
  .mask-show {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 1;
    transition: opacity 0.5s;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    // background: #273d5b;
    // background: linear-gradient(to right, #5873dc 0%, #4e95e2 100%);
  }
  .mask-hide {
    opacity: 0;
    transition: opacity 0.5s;
  }
  .main {
    position: fixed;
    z-index: 10000;
    top: 0;
    height: 100%;
    // background: #fff;
    // background: rgba(255, 255, 255, 0.5);
    // background: linear-gradient(90deg, #69b8d7 0, #745de6);
    transition: all 0.5s;
    border-radius: 20px 0 0 0;

    border-radius: 20px 0 0 0;
    // background: rgba(88, 88, 188, 0.6);
    // box-shadow: rgb(255 255 255 / 20%) 0px 0px 0px 0.5px inset;
    // backdrop-filter: blur(40px) brightness(80%) saturate(150%);
    background: rgba(203, 203, 213, 0.1019607843);
    box-shadow: inset 0 0 0 0.5px hsl(0deg 0% 100% / 30%);
    -webkit-backdrop-filter: blur(40px);
    backdrop-filter: blur(40px);
    color: #fff;
    box-shadow: rgb(0 0 0 / 25%) 0px 54px 55px, rgb(0 0 0 / 12%) 0px -12px 30px,
      rgb(0 0 0 / 12%) 0px 4px 6px, rgb(0 0 0 / 17%) 0px 12px 13px,
      rgb(0 0 0 / 9%) 0px -3px 5px;
  }
  .main-show {
    opacity: 1;
    // overflow: hidden;
    overflow-y: auto;
    // background: rgba(255, 255, 255, 0.6);
    background: var(--bg-color);
    backdrop-filter: blur(0px);
    // background: linear-gradient(to right, #5873dc 0%, #4e95e2 100%);
    // background: linear-gradient(180deg, #3913b8 0%, #75e0e6 100%);
  }
  .main-hide {
    opacity: 0;
  }

  .inner {
    position: absolute;
  }
}
.task_drawer_wrap {
  padding: 40px 20px 120px 30px;
  overflow-y: auto;
  .task_dialog_title {
    text-align: center;
    font-size: 26px;
    height: 60px;
    line-height: 60px;
    color: var(--text-color);
  }
  .task_drawer_list {
    padding: 20px;
    .task_drawer_item {
      text-align: center;
      height: auto;
      font-size: 12px;
      border-bottom: 1px solid #fff;
      .task_drawer_item_parent {
        display: flex;
        height: 50px;
        line-height: 50px;
      }
      .task_drawer_item_text {
        width: 16%;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .showSon {
          i {
            font-size: 14px;
            color: #fff;
            color: var(--text-color);
            margin-right: 10px;
          }
          .showMore {
            margin-left: 8px;
            font-size: 16px;
          }
        }
      }
      .task_drawer_item_name {
        display: flex;
        width: 20%;
        cursor: pointer;
      }
      .task_drawer_item_type {
        width: 10%;
      }
    }
  }
}
</style>
