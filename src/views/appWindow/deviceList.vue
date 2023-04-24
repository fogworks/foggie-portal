<template>
  <div class="right-content">
    <el-input
      class="search-input"
      :prefix-icon="Search"
      type="text"
      placeholder="Name Or DID"
      clearable
      v-model="keyWord"
    ></el-input>
    <ul class="list-ul">
      <li
        v-for="item in list"
        :class="[
          'item',
          !item.device_type ? 'foggie' : '',
          isActive(item.device_id) ? 'active' : '',
        ]"
        @click="clickItem(item)"
      >
        <svg-icon
          v-show="isActive(item.device_id)"
          @click.stop="cancelItem(item)"
          icon-class="cancel"
          class="cancel"
        ></svg-icon>
        <div>
          {{ item.device_type ? "Name:" : "IP:" }}
          {{ item.device_name || item.dedicatedip }}
        </div>
        <div>
          DID:
          {{ handleID(item.device_id) }}
          <svg-icon
            icon-class="copy"
            class="copy-icon"
            @click.stop="copyLink(item.device_id)"
          ></svg-icon>
        </div>
        <template v-if="!item.device_type && item.product_custom.length">
          <div>CPU: {{ item.product_custom[0].field_value }}</div>
          <div>Memory: {{ item.product_custom[1].field_value }}</div>
          <div>Disk Type: {{ item.product_custom[2].field_value }}</div>
          <div>Disk Size: {{ item.product_custom[3].field_value }}</div>
          <div>Bandwidth: {{ item.product_custom[4].field_value }}</div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref, reactive, toRefs, watch, toRaw } from "vue";
import { useStore } from "vuex";
import { Search } from "@element-plus/icons-vue";
const store = useStore();
const props = defineProps({
  totalActiveDevice: {
    type: Object,
    default: { data: [] },
  },
});
const { totalActiveDevice } = toRefs(props);
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
    str.substring(0, 6) + "..." + str.substring(str.length - 6, str.length)
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
  height: 100%;
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
  // height: 43px;
  padding: 5px;
  margin-bottom: 15px;
  background: linear-gradient(rgb(255, 255, 255) 0%, rgb(217, 223, 255) 100%);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:first-child {
      font-weight: 500;
      width: 180px;
    }
    svg {
      cursor: pointer;
      &:hover {
        color: #29abff;
      }
    }
  }
  &:hover {
    // transform: translateX(-10px);
  }
  // &.foggie:hover {
  //   height: 152px;
  // }
  &.active {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    color: #fff;
    background: linear-gradient(
      209.21deg,
      #093891 13.57%,
      rgb(54, 135, 216) 98.38%
    );
    // color: #fff;
    // background: linear-gradient(93deg, #6794e9 0%, #837ecd 100%);
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
}
</style>
