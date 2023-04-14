<template>
  <div>
    <div class="content">
      <div class="item-box" v-for="item in kitsList">
        <div class="name">
          {{ item.label }}
        </div>
        <div class="action">
          <!-- <span> Reset </span> -->
          <!-- <span> Open </span>
          <span> Close </span> -->
          <el-switch
            v-model="item.status"
            size="large"
            active-text="Open"
            inactive-text="Close"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, defineProps, toRefs } from "vue";
const emit = defineEmits(["next"]);
const props = defineProps({
  form: Object,
});
const form = reactive(props.form);
const kitsList = reactive([
  {
    label: "ipfs",
    status: true,
  },
  {
    label: "cyfs",
    status: true,
  },
]);
const next = () => {
  emit("next");
};
</script>

<style lang="less" scoped>
.welcome {
  font-weight: 700;
  font-size: 30px;
}
.content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
  .item-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 45%;
    height: 100px;
    margin: 20px 10px;
    margin-bottom: 20px;
    border-radius: 16px;
    background: #f2f6ff;
    box-shadow: var(--box-shadow);
    .name {
      margin: 0 30px;
    }
    .action {
      margin-right: 30px;
      span {
        cursor: pointer;
      }
    }
  }
}
</style>
