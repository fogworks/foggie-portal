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
          :validate-event="false"
          v-model="imgCheckedData.value[item.dateId]"
          @change="(val) => handleCheckedItemsChange(val, item)"
        >
          <div :class="['img-item']" v-for="(img, index) in item.list">
            <div :class="['mask', isChecking ? 'isChecking' : '']">
              <el-checkbox
                :class="[
                  'mask-checkbox',
                  itemChecked(img.id, item.dateId) ? 'itemChecked' : '',
                ]"
                :key="index"
                :label="img.id"
              ></el-checkbox>
            </div>
            <ActionDrop class="action-popover">
              <div class="more-box">
                <svg-icon icon-class="more"></svg-icon>
              </div>
              <template #reference>
                <ul class="more-dropdown">
                  <li>
                    <el-button
                      @click="
                        handleCommand({
                          flag: 'download',
                          data: img,
                          pid: item.dateId,
                        })
                      "
                    >
                      Download</el-button
                    >
                  </li>
                  <li>
                    <el-button
                      @click="
                        handleCommand({
                          flag: 'move',
                          data: img,
                          pid: item.dateId,
                        })
                      "
                    >
                      Move</el-button
                    >
                  </li>
                  <li>
                    <el-button
                      class="delete-item"
                      @click="
                        handleCommand({
                          flag: 'delete',
                          data: img,
                          pid: item.dateId,
                        })
                      "
                    >
                      Delete</el-button
                    >
                  </li>
                </ul>
              </template>
            </ActionDrop>
            <el-image
              scroll-container=".img-content"
              :preview-teleported="true"
              :teleported="true"
              :hide-on-click-modal="true"
              :initial-index="1"
              :preview-src-list="[img.url]"
              fit="cover"
              :key="img.id"
              :src="img.url"
              lazy
            >
              <template #placeholder>
                <div class="image-placeholder">
                  <svg-icon
                    icon-class="picture"
                    size="30"
                    style="color: #fff"
                  ></svg-icon>
                </div>
              </template>
              <template #error>
                <div class="image-placeholder">
                  <svg-icon
                    icon-class="image-failed"
                    size="30"
                    style="color: #fff"
                  ></svg-icon>
                </div>
              </template>
            </el-image>
          </div>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import ActionDrop from "@/components/actionDrop";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import {
  toRefs,
  ref,
  reactive,
  nextTick,
  watch,
  onMounted,
  computed,
} from "vue";
const imgCheckedData = reactive({
  value: {
    xx: [],
  },
});
const emits = defineEmits([
  "update:checkedData",
  "update:folderVisible",
  "setSingle",
]);
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
          url: "https://img.baidu.com/it/u=3151448756,2510060928&fm=253&fmt=auto&app=138&f=JPEG?w=626&h=500",
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
  return Object.keys(imgCheckedData.value)?.some((key) => {
    if (imgCheckedData.value[key].length) {
      return true;
    } else {
      return false;
    }
  });
});
const itemChecked = (id, pid) => {
  if (imgCheckedData.value?.[pid]?.indexOf(id) > -1) {
    return true;
  } else {
    return false;
  }
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
    // emits('setSingle',imgCheckedData.value[pid].filter(
    //   (el) => el.dateId == pid
    // ))
  } else if (flag == "move") {
    imgCheckedData.value[pid] = imgCheckedData.value[pid].filter(
      (el) => el.dateId == pid
    );
    emits("update:folderVisible", true);
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
  // nextTick(() => {
  //   refCheckAll();
  // });
  // scrollContainer.value = imgContentRef.value;
});
defineExpose({ resetChecked });
</script>

<style lang="scss" scoped>
.img-content {
  height: 800px;
  padding-bottom: 100px;
  overflow-y: auto;
  .img-box {
    p {
      position: sticky;
      top: 0;
      z-index: 999;
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
    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f1f1f1;
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
