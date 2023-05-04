<template>
  <div>
    <el-dialog
      :model-value="visible"
      class="nft-dialog"
      title=" "
      width="400px"
      top="10%"
      :before-close="beforeClose"
    >
      <img src="@/assets/star1.svg" class="my_reward_star_img" />
      <div class="task_one_lists">
        <div
          v-for="(item, key) in nftList"
          :key="key"
          class="task_one_items task_active_one"
        >
          <div class="task_img_wrap">
            <img src="@/assets/voodBG.jpg" v-if="key % 2 === 0" />
            <img src="@/assets/voodBG2.jpg" v-if="key % 2 === 1" />
          </div>

          <div class="nft_one_texts">
            <span class="nft_one_texts_name">{{ handleVoodId(item) }}</span>
            <div class="task_one_btns" @click="activeNft(item)">NFT Drops</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { Base64 } from "js-base64";
import { ref, toRefs, defineEmits, defineProps, watch } from "vue";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  nftLink: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["update:visible"]);
const beforeClose = () => {
  emits("update:visible", false);
};
const { visible, nftLink } = toRefs(props);
const nftList = ref([]);
const handleVoodId = (str) => {
  return (
    str.substring(0, 10) + "..." + str.substring(str.length - 10, str.length)
  );
};
const activeNft = (item) => {
  let CODE = item && Base64.decode(item);
  let url = `https://drops.fogworks.io/admin/#/signin/${CODE}`;
  window.open(url);
};
watch(
  nftLink,
  (val) => {
    nftList.value = val.split(",");
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.task_one_lists {
  position: relative;
  padding-top: 10px;
  width: 100%;
  max-height: 400px;
  // display: flex;
  display: grid !important;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 40px 0 0 0;
  box-sizing: border-box;
  overflow-y: auto;
  .my_reward_close_img {
    position: absolute;
    left: -58px;
    top: -70px;
  }
  .task_one_items {
    // width: 100%;
    width: 320px !important;
    box-sizing: border-box;
    padding: 10px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 80px;
    cursor: pointer;
    // box-shadow: rgb(0 0 0 / 20%) 0px 18px 50px -10px;
    // box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    //   rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    //   rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    border-radius: 20px;
    &:hover {
      transform: scale(1.02);
    }
    .task_img_wrap {
      width: 50px !important;
      height: 50px;
      border-radius: 50%;
      // background: #fdac51;
      // background: hsl(0deg 0% 100% / 30%);
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 34px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        // height: 40px;
      }
    }

    .nft_one_texts {
      width: calc(100% - 80px);
      color: #fff;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      font-size: 12px;
      // overflow: hidden;
      span {
        line-height: 30px;
        white-space: nowrap;
      }
    }
    .task_one_btns {
      width: 90px;
      height: 30px;
      background: #c8e6ff;
      border-radius: 20px;
      text-align: center;
      line-height: 30px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
      padding: 0 8px;
      color: #000;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  .task_active_one {
    background-image: linear-gradient(180deg, #4238f1 0%, #75e0e6 100%);
    // background-image: linear-gradient(to bottom, #79b9fa 0%, #e8c3f5 100%);
  }
}
</style>
<style lang="scss">
.nft-dialog {
  .el-dialog__body {
    position: relative;
    overflow: visible;
    .my_reward_star_img {
      position: absolute;
      top: -84px;
      left: -60px;
    }
  }
}
</style>
