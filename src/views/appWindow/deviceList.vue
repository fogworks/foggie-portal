<template>
  <div>
    <ul>
      <li v-for="item in deviceList" class="item" @click="clickItem(item)">
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
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref, reactive, toRefs } from "vue";
import { useStore } from "vuex";
const store = useStore();
const props = defineProps({
  deviceList: Array,
});

const emit = defineEmits(["clickItem"]);
const clickItem = (data) => {
  emit("clickItem", data);
};
const { deviceList } = toRefs(props);
// const deviceList = computed(() => store.getters.deviceList);
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
</script>

<style lang="less" scoped>
.item {
  width: 180px;
  padding: 5px;
  margin: 5px 0;
  background-color: var(--bg-color);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:first-child {
      font-weight: 700;
    }
    svg {
      cursor: pointer;
      &:hover {
        color: #29abff;
      }
    }
  }
  &:hover {
    transform: translateX(-10px);
  }
}
</style>
