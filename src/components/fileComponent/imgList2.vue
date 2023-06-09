<template>
  <div class="img-content">
    <div v-for="(item, index) in imgData" class="img-box">
      <p>
        <el-checkbox
          v-model="item.checkAll"
          @change="(val) => handleCheckAllChange(val, item)"
        ></el-checkbox>
        {{ item.time }}
      </p>
      <div class="img-item-box">
        <el-checkbox-group
          :key="'itembox' + index"
          v-model="imgCheckedData.value"
          @change="(val) => handleCheckedItemsChange(val, item)"
        >
          <div
            :key="'item' + index"
            :class="['img-item']"
            v-for="(img, index) in item.list"
          >
            <div>
              <el-checkbox
                :class="[
                  'mask-checkbox',
                  itemChecked(img.id, item.dateId) ? 'itemChecked' : '',
                ]"
                 :key="'check' + index"
                :label="img.id"
              ></el-checkbox>
            </div>
          </div>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import ActionDrop from "@/components/actionDrop";
import {
  toRefs,
  ref,
  reactive,
  nextTick,
  watch,
  onMounted,
  computed,
} from "vue";
import useCheckItem from "./hooks/useCheckItem";
import { Download, Delete, CopyDocument, Rank } from "@element-plus/icons-vue";
// const { imgCheckedData } = useCheckItem();
const imgCheckedData = reactive({
  value: [],
});
// const scrollContainer = ref(null);
// const imgContentRef = ref(null);
// const props = defineProps({
//   imgCheckedData: {
//     type: Object,
//     default:()=>{}
//   }
// })
// const {imgCheckedData}=toRefs(props)
const emits = defineEmits(["update:checkedData", "update:folderVisible"]);
const vInWindow = {
  mounted: (el) => {
    isInViewPort(el);
  },
};
function isInViewPort(el) {
  const viewPortHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  const offsetTop = el.offsetTop;
  const scrollTop = document.documentElement.scrollTop;
  const top = offsetTop - scrollTop;
  const isIn = top <= viewPortHeight;
  console.log(top, "top");
  if (isIn) {
    el.style.display = "block";
  } else {
    el.style.display = "none";
  }
}
const resetChecked = () => {
  imgCheckedData.value = [];
  refCheckAll();
};
const state = reactive({
  imgData: [
    {
      time: "2023-6-2",
      dateId: "xx",
      list: [
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 1,
        },
        {
          url: "https://img2.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
          id: 2,
        },
      ],
    },
  ],
});
const { imgData } = toRefs(state);
const refCheckAll = () => {
  imgData.value.forEach((el) => {
    el.checkAll = false;
  });
};
const isChecking = computed(() => {
  if (imgCheckedData.value.length) {
    return true;
  } else {
    return false;
  }
});
const itemChecked = (id, pid) => {
  if (imgCheckedData.value?.indexOf(id) > -1) {
    return true;
  } else {
    return false;
  }
};
const handleCheckAllChange = (val, item) => {
  console.log(Date.now());
  imgCheckedData.value = val ? item.list.map((el) => el.id) : [];
  console.log(imgCheckedData.value.length, "imgCheckedData.value");
  console.log(Date.now());
  nextTick(() => {
    console.log(Date.now());
  });
};
const handleCheckedItemsChange = (val, item) => {
  const checkedCount = val.length;
  item.checkAll = checkedCount === item.list.length;
  console.log(checkedCount, "checkedCount");
};
const handleCommand = ({ flag, data, pid }) => {
  if (flag == "download") {
  } else if (flag == "delete") {
    imgCheckedData.value[pid] = imgCheckedData.value[pid].filter(
      (el) => el.dateId == pid
    );
  } else if (flag == "move") {
    imgCheckedData.value[pid] = imgCheckedData.value[pid].filter(
      (el) => el.dateId == pid
    );
    emits("update:folderVisible", true);
  }
};
// watch(
//   imgCheckedData,
//   (val) => {
//     emits("update:checkedData", val.value);
//   },
//   {
//     immediate: true,
//     deep: true,
//   }
// );
onMounted(() => {
  // nextTick(() => {
  //   refCheckAll();
  // });
  // scrollContainer.value = imgContentRef.value;
});
defineExpose({ resetChecked });
</script>

<style lang="scss" scoped>
.img-content {
  height: 1000px;
  padding-bottom: 100px;
  overflow-y: auto;
  .img-box {
    p {
      position: sticky;
      top: 0;
      z-index: 2;
      background-color: var(--bg-color);
      text-align: left;
    }
  }
  .img-item-box {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 10px;
    :deep {
      .el-checkbox-group {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
      }
    }
    .img-item {
      position: relative;
      width: 128px;
      height: 128px;
      margin: 0 10px 10px 0;
      .mask {
        display: none;
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 30px;
        background-image: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.3) 0%,
          rgba(0, 0, 0, 0) 100%
        );
        .mask-checkbox {
          display: none;
        }
        .itemChecked {
          display: block;
        }
        &.isChecking {
          display: block;
          height: 100%;
          cursor: pointer;
          :deep {
            .el-checkbox {
              width: 100%;
              height: 100%;
            }
          }
        }

        :deep {
          .el-checkbox {
            position: absolute;
            left: 0;
          }
          .el-checkbox__input {
            position: absolute;
            left: 5px;
            top: 10px;
          }
          .el-checkbox__label {
            display: none;
          }
        }
      }
      .action-popover {
        display: none;

        min-width: unset !important;
        width: 100% !important;
        position: absolute;
        top: 0;
        z-index: 9;
        .more-box {
          position: absolute;
          top: 0;
          left: 80%;
          height: 20px;
          width: 20px;
          margin-top: 6px;
          border-radius: 4px;
          background-color: #fff;
          svg {
            margin-top: 1px;
            font-size: 18px;
            color: $light_blue;
          }
        }
        .more-dropdown {
          z-index: 999;
          .delete-item {
            color: #ff3353 !important;
          }
          display: block;
          background-color: var(--bg-color);
          list-style: none;
          border-radius: 16px;
          box-shadow: var(--box-shadow);
          li {
            .el-button {
              // background-color: transparent;
              background-color: #fff;
              color: #000;
              width: 100%;
              height: 30px;
              border: none;
              border-radius: 0;
              font-size: 16px;
              &:hover {
                background-color: rgb(219, 219, 219);
              }
            }
          }
        }
      }
      &:hover {
        .mask {
          display: block;
          .mask-checkbox {
            display: block;
          }
        }
        .action-popover {
          display: block;
        }
      }
    }
    .action-popover {
      overflow: visible;
      width: unset !important;
      :deep {
        .dropdown {
        }
      }
    }
    :deep {
      .el-image {
        width: 128px;
        height: 128px;
        img {
          // object-fit: cover;
          // vertical-align: middle;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.more-list {
  .el-dropdown-menu__item {
    justify-content: flex-start !important;
  }
}
</style>
