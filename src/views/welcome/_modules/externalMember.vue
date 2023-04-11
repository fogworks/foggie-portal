<template>
  <div>
    <p class="welcome">Recommended Kits</p>
    <div class="content">
      <div class="members">
        <div v-for="item in kitsList">
          {{ item.label }}
        </div>
      </div>
      <el-button @click="next">Next</el-button>
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
    label: "cbs",
  },
  {
    label: "ipfs",
  },
  {
    label: "cyfs",
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
  text-align: center;
}
.content {
  text-align: center;
  .members {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 600px;
    margin: 0 auto;
    > div {
      height: 60px;
      line-height: 60px;
    }
  }
}
</style>
