<template>
  <div>
    <el-dialog
      append-to-body
      title="MOVE TO"
      :model-value="visible"
      class="folder-dialog"
      width="600px"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item @click="setPrefix(item, true)">
          <div class="flex items-center">
            <!-- <img class="title-img" src="@/assets/my-files.png" alt="" /> -->
            <svg-icon icon-class="my-files" class="title-img"></svg-icon>
            <div class="title">All Files</div>
          </div>
          <!-- <span>Files</span> -->
        </el-breadcrumb-item>
        <el-breadcrumb-item
          @click="setPrefix(item)"
          v-for="item in breadcrumbList.prefix"
        >
          {{ item }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-table
        class="table-box"
        row-key="key"
        :show-header="false"
        v-loading="tableLoading"
        :data="tableData.data"
        style="width: 100%"
        max-height="500"
        ref="fileTable"
      >
        <el-table-column
          label="Name"
          show-overflow-tooltip
          width="536"
          prop="name"
        >
          <template #default="{ row }">
            <div class="name-link" @click="toDetail(row)">
              <div class="name-img">
                <img src="@/assets/folder.png" alt="" />
              </div>
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">Cancel</el-button>
        <div class="color-box">
          <el-button @click="handleConfirm">
            <RippleInk></RippleInk>
            {{ actionType === "copy" ? "Copy Here" : "Move Here" }}</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  toRefs,
  ref,
  getCurrentInstance,
  reactive,
  watch,
  inject,
  onMounted,
  computed,
} from "vue";
import { useStore } from "vuex";
import { ArrowRight } from "@element-plus/icons-vue";
import { oodFileList } from "@/utils/api.js";
import RippleInk from "@/components/rippleInk";
const { proxy } = getCurrentInstance();
const store = useStore();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  actionType: {
    type: String,
    default: "copy",
  },
});
const { visible, actionType } = toRefs(props);
const activeName = inject("activeName");
const checkedData = inject("checkedData");
const imgCheckedData = inject("imgCheckedData");
const email = computed(() => store.getters.userInfo?.email);
const tokenMap = computed(() => store.getters.tokenMap);
const deviceData = inject("deviceData");
const tableLoading = ref(false);
const tableData = reactive({ data: [] });
let breadcrumbList = reactive({
  prefix: [],
});
const getFileList = function (scroll, prefix) {
  let list_prefix = "";
  if (prefix?.length) {
    list_prefix = prefix.join("/");
  }
  tableLoading.value = true;
  let token = tokenMap.value[deviceData.device_id];
  let type = "foggie";
  oodFileList(email.value, type, token, deviceData, list_prefix)
    .then((res) => {
      if (res && res.content) {
        initFileData(res);
      }
    })
    .finally(() => (tableLoading.value = false));
};

const initFileData = async (data) => {
  tableData.data = [];
  // let commonPrefixesItem = [];
  // let contentItem = [];
  let commonPrefixesItem = data.commonPrefixes?.map((el, i) => {
    return {
      isDir: true,
      name: decodeURIComponent(el),
      key: el,
      idList: [
        {
          name: "IPFS",
          code: "",
        },
        {
          name: "CYFS",
          code: "",
        },
      ],
      date: "-",
      size: "",
      status: "-",
      type: "application/x-directory",
      file_id: "",
      pubkey: "",
      cid: "",
      imgUrl: "",
      // imgUrlLarge: "",
      share: {},
      isSystemImg: false,
      canShare: false,
    };
  });
  tableData.data = [...(commonPrefixesItem || [])];
  tableLoading.value = false;
};
const toDetail = (item) => {
  if (item.type === "application/x-directory") {
    breadcrumbList.prefix = item.name.split("/");
    // emits("currentPrefix", breadcrumbList.prefix);
  }
};
const emits = defineEmits(["update:visible"]);
const beforeClose = () => {
  emits("update:visible", false);
};
const setPrefix = (item, isTop = false) => {
  if (tableLoading.value) return;
  if (isTop) {
    if (!breadcrumbList.prefix.length) return;
    breadcrumbList.prefix = [];
  } else {
    breadcrumbList.prefix = breadcrumbList?.prefix?.filter((el, index) => {
      let targetIndex = 0;
      if (el === item) targetIndex = index;
      return index <= targetIndex;
    });
  }
  // emits("currentPrefix", breadcrumbList.prefix);
};
const handleConfirm = () => {
  if (activeName.value == "Image") {
    console.log(imgCheckedData.value, "imgCheckedData");
    if (actionType == "cpoy") {
    } else {
    }
  } else if (activeName.value == "All") {
    console.log(checkedData.value, "564894984984191984198419841981");
  }
};
onMounted(() => {
  getFileList("", breadcrumbList.prefix);
});
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.table-box {
  min-height: 400px;
  // max-height: 100px;
  margin-bottom: 40px;
  background: transparent;
  font-size: 16px;
  .name-img {
    display: inline-block;
    width: 25px;
    height: 25px;
    margin-right: 8px;
    text-align: center;
    img {
      max-width: 25px;
      max-height: 25px;
    }
  }
  :deep {
    .el-table__header {
      .cell {
        padding-bottom: 10px;
        color: var(--text-color);
        font-weight: 700;
      }
    }
    --el-table-row-hover-bg-color: transparent;
    .el-table__row {
      content-visibility: auto;
      contain-intrinsic-size: 55.2px;
      background: transparent;

      // &:hover {
      //   background: var(--card-bg);
      // }
    }
    .el-table__cell {
      color: var(--text-color);
      background: transparent;
      .cell {
        color: var(--text-color);
        min-height: 25px;
        line-height: 25px;
      }
    }
    .action-btn-column {
      .cell {
        text-align: center;
        overflow: visible;
      }
    }
  }

  .name-link {
    font-weight: 700;
    font-size: 16px;
    color: $light_blue2;
    cursor: pointer;
    // img {
    //   width: 24px;
    //   margin-right: 8px;
    // }
  }
}
.share-content {
  margin-top: 20px;
  color: #000;
  font-size: 20px;
  .title {
    margin-bottom: 30px;
    text-align: center;
    font-weight: 700;
    font-size: 26px;
  }
  .user-info {
    text-align: center;
    // height: 50px;
    line-height: 16px;

    .color-box {
      width: 165px;
      // .color-box();
      @include color-box;

      margin: 0 auto;
      .ripple-ink {
        border-radius: 45px;
      }
      .el-button {
        position: relative;
        font-size: 16px;
        color: var(--text-color);
        border: none;
        border-radius: 45px;
        box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%);
        background: var(--btn-gradient);
      }
    }
  }
}
</style>
<style lang="scss">
.folder-dialog {
  // background-image: var(--dialog-gradient-bg) !important;
  color: #000;
  .el-breadcrumb {
    margin-top: 20px;
    margin-bottom: 20px;
    .el-breadcrumb__item {
      --el-text-color-regular: #000;
      font-size: 20px;
      cursor: pointer;
      .el-breadcrumb__inner {
        color: $light_blue !important;
      }
      &:last-of-type {
        .el-breadcrumb__inner {
          color: var(--text-color) !important;
        }
      }
    }
  }
  .el-loading-mask {
    background: transparent;
    z-index: 1;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-button {
      width: unset;
      font-size: 18px;
      color: #000;
      border: none;
      border-radius: 45px;
      box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%);
      background: #f2f6ff;
    }
    .color-box {
      margin-left: 15px;
      // .color-box();
      @include color-box;

      .ripple-ink {
        border-radius: 45px;
      }
      .el-button {
        position: relative;
        color: var(--text-color);
        background: var(--btn-gradient);
      }
    }
  }
}
</style>
