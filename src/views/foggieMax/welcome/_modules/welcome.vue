<template>
  <div>
    <p class="welcome">Welcome</p>
    <img src="@/assets/welcome-asset.png" alt="" />
    <p>
      <HoverButton @next="next"></HoverButton>
    </p>
    <p class="sub-title">Set up your Foggie Max now</p>
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

<style lang="scss" scoped>
.welcome {
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 30px;
  text-align: center;
  color: #000;
}
img {
  display: block;
  margin: 0 auto;
}
.sub-title {
  margin-bottom: 10px;
  font-size: 14px;
  text-align: center;
  color: #000;
}
</style>
