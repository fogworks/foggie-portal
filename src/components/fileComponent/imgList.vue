<template>
  <div class="img-content">
    <div v-for="item in imgData" class="img-box">
      <p>
        <el-checkbox
          v-model="item.checkAll"
          @change="(val) => handleCheckAllChange(val, item)"
        ></el-checkbox>
        {{ item.time }}
      </p>
      <div class="img-item-box">
        <el-checkbox-group
          v-model="imgCheckedData.value[item.dateId]"
          @change="(val) => handleCheckedItemsChange(val, item)"
        >
          <div :class="['img-item']" v-for="img in item.list">
            <div
              :class="[
                'mask',
                imgCheckedData.value[item.dateId] &&
                imgCheckedData.value[item.dateId].length
                  ? 'isChecking'
                  : '',
              ]"
            >
              <el-checkbox :key="img.id" :label="img.id"></el-checkbox>
              <div class="more-box">
                <el-dropdown popper-class="more-list" @command="handleCommand">
                  <svg-icon icon-class="more"></svg-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        :command="{
                          flag: 'download',
                          data: img,
                          pid: item.dateId,
                        }"
                        :icon="Download"
                        >Download</el-dropdown-item
                      >
                      <el-dropdown-item
                        :command="{
                          flag: 'delete',
                          data: img,
                          pid: item.dateId,
                        }"
                        :icon="Delete"
                      >
                        Delete
                      </el-dropdown-item>
                      <el-dropdown-item
                        :command="{ flag: 'copy', data: img, pid: item.dateId }"
                        :icon="CopyDocument"
                        >Copy</el-dropdown-item
                      >
                      <el-dropdown-item
                        :command="{ flag: 'move', data: img, pid: item.dateId }"
                        :icon="Rank"
                        >Move</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
            <el-image
              :preview-teleported="true"
              :teleported="true"
              :hide-on-click-modal="true"
              :initial-index="1"
              :preview-src-list="[img.url]"
              fit="cover"
              :key="img.id"
              :src="img.url"
              lazy
            />
          </div>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs, ref, reactive, nextTick, watch, onMounted } from "vue";
import useCheckItem from "./hooks/useCheckItem";
import { Download, Delete, CopyDocument, Rank } from "@element-plus/icons-vue";
// const { imgCheckedData } = useCheckItem();
const imgCheckedData = reactive({
  value: {},
});
// const props = defineProps({
//   imgCheckedData: {
//     type: Object,
//     default:()=>{}
//   }
// })
// const {imgCheckedData}=toRefs(props)
const emits = defineEmits(["update:checkedData"]);
const resetChecked = () => {
  imgCheckedData.value = {};
  refCheckAll();
};
const state = reactive({
  imgData: [
    {
      time: "2023-6-2",
      dateId: "xx",
      list: [
        {
          url: "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
          id: 1,
        },
        {
          url: "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
          id: 2,
        },
      ],
    },
    {
      time: "2023-6-3",
      dateId: "zz",
      list: [
        {
          url: "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
          id: 3,
        },
        {
          url: "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
          id: 4,
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
const handleCheckAllChange = (val, item) => {
  imgCheckedData.value[item.dateId] = val ? item.list.map((el) => el.id) : [];
};
const handleCheckedItemsChange = (val, item) => {
  const checkedCount = val.length;
  item.checkAll = checkedCount === item.list.length;
};
const handleCommand = ({ flag, data, pid }) => {
  if (flag == "download") {
  } else if (flag == "delete") {
    imgCheckedData.value[pid] = imgCheckedData.value[pid].filter(
      (el) => el.dateId == pid
    );
  } else if (flag == "copy") {
  } else if (flag == "move") {
    imgCheckedData.value[pid] = imgCheckedData.value[pid].filter(
      (el) => el.dateId == pid
    );
  }
};
watch(
  imgCheckedData,
  (val) => {
    emits("update:checkedData", val.value);
  },
  {
    immediate: true,
    deep: true,
  }
);
onMounted(() => {
  refCheckAll();
});
defineExpose({ resetChecked });
</script>

<style lang="scss" scoped>
.img-content {
  height: 1000px;
  overflow-y: auto;
  .img-box {
    p {
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

        .more-box {
          display: none;
          position: absolute;
          top: 0;
          right: 5px;
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
      }
      &:hover {
        .mask {
          display: block;
          .more-box {
            display: block;
          }
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
