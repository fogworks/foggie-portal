<template>
  <div>
    <div ref="vantaRef" id="vantaRef" class="loginBox" style="width: 100%; height: 100vh">
      <login />
    </div>
  </div>
</template>


<script setup>
import login from "@/components/login.vue";


</script>


<style lang="scss" scoped>
#vantaRef {
  position: relative;
  background-color: black;
}
.loginBox{
  background: url('@/assets/bg.png') no-repeat;
  background-size: cover;
}

</style>
