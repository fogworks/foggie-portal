<template>
  <div>
    <p class="welcome">Advanced Services</p>
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
            v-model="status"
            size="large"
            active-text="Open"
            inactive-text="Close"
          />
        </div>
      </div>
    </div>
    <el-button @click="next">Next</el-button>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, defineProps, toRefs } from "vue";
const emit = defineEmits(["next"]);
const props = defineProps({
  form: Object,
});
const form = reactive(props.form);
const status = ref(false);
const kitsList = reactive([
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

<style lang="scss" scoped>
.welcome {
  font-weight: 700;
  font-size: 30px;
}
.content {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .item-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 45%;
    max-width: 550px;
    height: 100px;
    margin: 20px 10px;
    margin-bottom: 20px;
    border-radius: 16px;
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
