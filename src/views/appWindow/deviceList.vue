<template>
  <div class="right-content">
    <el-input
      class="search-input"
      :prefix-icon="Search"
      type="text"
      placeholder="Name Or FID"
      clearable
      v-model="keyWord"
    ></el-input>
    <ul class="list-ul">
      <li
        v-for="item in list"
        :class="[
          'item',
          !item.device_type ? 'foggie' : '',
          item.device_type === 'foggie_max' ? 'max' : '',
          isActive(item.device_id) ? 'active' : '',
          deviceData.data.device_id === item.device_id ? 'currentActive' : '',
        ]"
        @click="clickItem(item)"
      >
        <svg-icon
          v-if="isActive(item.device_id) && item.device_type !== 'foggie_max'"
          icon-class="logo-dog"
          class="logo"
        ></svg-icon>

        <svg-icon
          v-else-if="
            !isActive(item.device_id) && item.device_type !== 'foggie_max'
          "
          icon-class="logo-dog-black"
          class="logo"
        ></svg-icon>
        <span class="logo logo-text" v-if="item.device_type == 'foggie_max'"
          >MAX</span
        >
        <svg-icon
          v-show="isActive(item.device_id)"
          @click.stop="cancelItem(item)"
          icon-class="cancel"
          class="cancel"
        ></svg-icon>
        <div>
          <span>
            {{ item.device_type ? "Name:" : "IP:" }}
          </span>
          <span class="top-value-span">
            {{ item.device_name || item.dedicatedip }}
          </span>
        </div>
        <div>
          <span> FID: </span>
          <span class="top-value-span">
            {{ handleID(item.device_id) }}
          </span>
          <svg-icon
            icon-class="copy"
            class="copy-icon"
            @click.stop="copyLink(item.device_id)"
          ></svg-icon>
        </div>
        <div :class="['circle', item.is_active ? 'onlineC' : 'offlineC']"></div>
        <template v-if="!item.device_type && item.product_custom.length">
          <!-- <span class="value-span">
            {{ item.product_custom[0].field_value }} </span
          >-core CPU
          <span class="value-span"
            >{{ item.product_custom[1].field_value }}
          </span>
          GB Memory
          <span class="value-span">
            {{ item.product_custom[3].field_value }}</span
          >
          GB
          <span> {{ item.product_custom[2].field_value }}</span
          >-Disk
          <span class="value-span">
            {{ item.product_custom[4].field_value }}</span
          >MB Bandwidth -->

          <div>
            Due
            <span class="value-span value-span2">{{
              handleTimeStamp(item.expire)
            }}</span>
          </div>
          <div>
            <span class="value-span">500G</span>
            Storage
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {
  computed,
  ref,
  reactive,
  toRefs,
  watch,
  toRaw,
  getCurrentInstance,
} from "vue";
import { useStore } from "vuex";
import { Search } from "@element-plus/icons-vue";
import { handleTimeStamp } from "@/utils/util";
const store = useStore();
const props = defineProps({
  totalActiveDevice: {
    type: Object,
    default: { data: [] },
  },
  deviceData: {
    type: Object,
    default: { data: {} },
  },
});
const { totalActiveDevice, deviceData } = toRefs(props);
const { proxy } = getCurrentInstance();
const emit = defineEmits(["clickItem", "cancelItem"]);
const clickItem = (data) => {
  emit("clickItem", data);
};
const cancelItem = (data) => {
  emit("cancelItem", data);
};
const keyWord = ref("");
const deviceList = computed(() => store.getters["global/deviceList"]);

const copyLink = (text) => {
  var input = document.createElement("input"); // 创建input对象
  input.value = text; // 设置复制内容
  document.body.appendChild(input); // 添加临时实例
  input.select(); // 选择实例内容
  document.execCommand("Copy"); // 执行复制
  document.body.removeChild(input); // 删除临时实例
  // let str = `Copying  ${type} successful!`;
  // this.$message.success(str);
  proxy.$notify({
    message: "Copy succeeded",
    type: "success",
    position: "bottom-left",
  });
};
const handleID = (str) => {
  return (
    str.substring(0, 5) + "..." + str.substring(str.length - 5, str.length)
  );
};
const isActive = (id) => {
  if (totalActiveDevice.value.data.find((el) => el.device_id === id)) {
    return true;
  } else {
    return false;
  }
};
const list = computed(() => {
  if (!keyWord.value) {
    console.log(deviceList.value, "deviceList.value");
    return deviceList.value;
  } else {
    return deviceList.value.filter((el) => {
      return (
        el.device_name?.indexOf(keyWord.value) > -1 ||
        el.dedicatedip?.indexOf(keyWord.value) > -1 ||
        el.device_id?.indexOf(keyWord.value) > -1
      );
    });
  }
});
</script>

<style lang="scss" scoped>
.right-content {
  overflow: hidden;
  height: 100%;
  padding-top: 10px;
}
.search-input {
  padding: 0 10px;
  :deep {
    .el-input__wrapper {
      height: 40px;
    }
  }
}
.list-ul {
  height: calc(100% - 52px);
  overflow-y: auto;
  overflow-x: hidden;

  padding: 0 15px;
  margin-top: 10px;
  &::-webkit-scrollbar {
    // display: none;
    width: 0px;
    height: 0px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    width: 0;
    height: 0;
    border-radius: 5px;

    background: rgba(0, 0, 0, 0.2);
  }
}
.item {
  position: relative;
  overflow: hidden;
  width: 205px;
  height: 135px;
  padding: 25px 8px;
  margin: 0 auto;
  margin-bottom: 15px;
  background: linear-gradient(rgb(255, 255, 255) 0%, rgb(217, 223, 255) 100%);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;

  div {
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #005ea0;
    font-size: 15px;
    // font-weight: 600;
    svg {
      cursor: pointer;
      &:hover {
        color: #29abff;
      }
    }
    span {
      font-weight: 500;
      color: #8b8b8b;
    }
  }
  div:first-of-type {
    width: 180px;
  }
  .top-value-span {
    font-size: 16px;
    font-weight: 600;
    color: #005ea0;
  }
  .value-span {
    font-weight: 500;
    font-size: 18px;
    color: #29abff !important;
  }
  .value-span2 {
    font-size: 16px;
  }

  &.active {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    color: #fff;
    background: linear-gradient(
      209.21deg,
      #093891 13.57%,
      rgb(54, 135, 216) 98.38%
    );
    div {
      color: #fff;
      span {
        color: #fff;
      }
    }
    // color: #fff;
    // background: linear-gradient(93deg, #6794e9 0%, #837ecd 100%);
  }
  &.currentActive {
    transform: translateX(-10px);
  }
  .circle {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
  .onlineC {
    background: #1eb92a;
  }
  .offlineC {
    background: #999;
  }
  .cancel {
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 12px;
    transition: transform 0.5s;
    &:hover {
      transform: rotate(90deg);
    }
  }
  .logo {
    position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 35px;
  }
  .logo-text {
    font-size: 18px;
    font-style: italic;
    font-weight: 700;
  }
}
</style>
