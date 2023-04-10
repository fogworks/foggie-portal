<template>
  <div>
    <p class="welcome">Welcome</p>
    <img src="@/assets/welcome-asset.jpg" alt="" />
    <p>
      <HoverButton @click="next()"></HoverButton>
    </p>
  </div>
</template>

<script setup>
import HoverButton from "@/components/hoverButton";
import { defineEmits } from "vue";
const emit = defineEmits(["next"]);
const next = () => {
  emit("next");
};
</script>

<style lang="less" scoped>
.welcome {
  font-weight: 700;
  font-size: 30px;
}
</style>
