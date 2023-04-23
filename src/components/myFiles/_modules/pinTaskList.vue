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
// import RippleInk from "@/components/rippleInk";
export default {
  components: { RippleInk },
  props: {
    // 是否打开
    display: {
      type: Boolean,
    },
    // 是否显示关闭按钮
    closable: {
      type: Boolean,
      default: true,
    },
    // 是否显示遮罩
    mask: {
      type: Boolean,
      default: true,
    },
    // 是否点击遮罩关闭
    maskClosable: {
      type: Boolean,
      default: true,
    },
    // 宽度(支持百分比)
    // width: {
    //   type: String,
    //   default: "1000px",
    // },
    // 是否在父级元素中打开
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
    //点击头部面包屑
    changeTabSon(item, index) {
      console.log(
        this.pathList[index],
        "changeTabSonchangeTabSonchangeTabSon",
        this.pathList,
        this.sonList
      );
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
      console.log(tree, _prefix, next_marker, "initData");
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
        console.log(that.sonList, that.pathList);
      }
      //回到根目录
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
