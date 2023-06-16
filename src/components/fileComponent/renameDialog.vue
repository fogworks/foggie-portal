<template>
  <div>
    <el-dialog
      append-to-body
      title="Rename"
      :model-value="renameVisible"
      class="rename-dialog"
      width="600px"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <el-form label-width="100px">
        <el-form-item style="margin-top: 20px" label="Name">
          <el-input disabled :model-value="checkedData[0].name"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 20px" label="New Name">
          <el-input v-model.trim="newName"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">Cancel</el-button>
        <div class="color-box">
          <el-button @click="handleConfirm">
            <RippleInk></RippleInk>
            Rename</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {
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
import { rename_objects } from "@/utils/api.js";
import RippleInk from "@/components/rippleInk";
const { proxy } = getCurrentInstance();
const store = useStore();

const props = defineProps({
  renameVisible: {
    type: Boolean,
    default: false,
  },
});
const { renameVisible, actionType, singleData } = toRefs(props);
const activeName = inject("activeName");
const checkedData = inject("checkedData");

const deviceData = inject("deviceData");
const newName = ref("");
const tokenMap = computed(() => store.getters.tokenMap);
const token = computed(() => {
  if (deviceData.device_type == "space") {
    return deviceData.upload_file_token;
  } else {
    return tokenMap.value[deviceData.device_id];
  }
});
const emits = defineEmits(["update:renameVisible", "reset", "refreshList"]);
const beforeClose = () => {
  emits("update:renameVisible", false);
};
const handleConfirm = () => {
  if (activeName.value == "Image") {
    console.log(imgCheckedData.value, "imgCheckedData");
  } else if (activeName.value == "All") {
    // if (isSingle.value) {
    //   console.log(singleData.value, "singleDatasingleDatasingleData");
    // } else {
    //   console.log(checkedData.value, "checkedDatacheckedDatacheckedData");
    // }
    const targetObject = () => {
      const arr = checkedData.value?.[0]?.fullName.split("/");

      if (checkedData.value?.[0]?.type == "application/x-directory") {
        if (newName.value[newName.value.length - 1] == "/") {
          const newData = newName.value.slice(0, newName.value.length - 1);
          console.log(newData, "newDatanewData");
          arr.splice(arr.length - 2, 1, newData);
        } else {
          arr.splice(arr.length - 2, 1, newName.value);
        }
      } else {
        arr.splice(arr.length - 1, 1, newName.value);
      }
      return arr.join("/");
    };
    rename_objects({
      deviceData,
      sourceObject: checkedData.value[0].fullName,
      targetObject: targetObject(),
      token: token.value,
      fileType: checkedData.value[0].fileType,
    }).then((res) => {
      if (res) {
        proxy.$notify({
          type: "success",
          message: "Rename successful",
          position: "bottom-left",
        });
        emits("refreshList");
        emits("reset");
        emits("update:renameVisible", false);
      }
    });
    // emits("reset");
  }
};
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
.rename-dialog {
  // background-image: var(--dialog-gradient-bg) !important;
  color: #000;

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
