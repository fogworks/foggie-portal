<template>
  <teleport :to="isInsertBody">
    <div class="dialogDetail" v-if="isShow" @click="closeClickModal ? closeDialog() : ''">
      <div class="dialog_box" v-if="isBox" @click.stop="" :style="{
          width: width,
          minHeight: height,
        }">
        <div class="closeDialog" @click="closeDialog">
          <el-icon color="#fff">
            <CloseBold />
          </el-icon>
        </div>

        <slot></slot>
      </div>

      <slot v-if="!isBox"></slot>

    </div>
  </teleport>
</template>

<script>
export default {
  data() {
    return {
      isShow: this.modelValue,
    };
  },
  emits: ["update:modelValue"],
  watch: {
    modelValue: {
      handler(val) {
        this.isShow = val;
      },
      immediate: true,
    },
  },
  props: {
    /* dialog 显示隐藏 */
    modelValue: {
      type: Boolean,
      default: true,
    },
    /* 是否可以通过点击 modal 关闭 dialog */
    closeClickModal: {
      type: Boolean,
      default: true,
    },
    /* dialog 宽度 */
    width: {
      type: String,
      default: "400px",
    },
    /* dialog 宽度 */
    height: {
      type: String,
      default: "500px",
    },
    /* 是否需要 Box */
    isBox: {
      type: Boolean,
      default: true,
    },
    /* 是否需要 Box */
    isInsertBody: {
      type: String,
      default: 'body',
    }
  },
  methods: {
    /* 关闭Dialog */
    closeDialog() {
      this.isShow = false;
      this.$emit("update:modelValue", this.isShow);
    },
  },
  mounted() {
    console.log(this.isShow);
  },
};
</script>

<style lang="scss" scoped>
.dialogDetail {
  display: flex;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px) saturate(100%);
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  z-index: 10;
  padding: 0px 20px;
  animation: 1s ease 0s 1 normal forwards running bDTdTe;

  .dialog_box {
    background: rgba(50, 61, 109, 0.5);
    box-shadow: rgb(255 255 255 / 20%) 0px 0px 0px 0.5px inset;
    backdrop-filter: blur(40px);
    border-radius: 20px;
    padding: 30px;
    opacity: 0;
    animation: 1s cubic-bezier(0.075, 0.82, 0.165, 1) 0s 1 normal forwards running jkLqKc;
  }

  .closeDialog {
    position: absolute;
    display: grid;
    width: 36px;
    height: 36px;
    right: -18px;
    top: -18px;
    -webkit-box-pack: center;
    place-content: center;
    background: linear-gradient(360deg,
        rgba(99, 106, 150, 0.4) 0%,
        rgba(182, 186, 214, 0.5) 100%);
    box-sizing: border-box;
    box-shadow: rgb(0 0 0 / 15%) 0px 20px 40px,
      rgb(255 255 255 / 30%) 0px 0px 0px 0.5px inset;
    backdrop-filter: blur(40px);
    border-radius: 30px;
    cursor: pointer;
  }
}
</style>
