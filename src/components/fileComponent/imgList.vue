<template>
  <div class="img-content">
    <div v-for="item in imgData" class="img-box">
      <p>{{ item.time }}</p>
      <div class="img-item-box">
        <div class="img-item" v-for="img in item.list">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
  imgData: {
    type: Array,
    default: [
      {
        time: "2023-6-2",
        list: [
          {
            url: "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
            id: 1,
          },
          {
            url: "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
            id: 1,
          },
        ],
      },
    ],
  },
});
const { imgData } = toRefs(props);
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
    .img-item {
      width: 128px;
      height: 128px;
      margin: 0 10px 10px 0;
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
