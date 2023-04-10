<template>
  <div class="container">
    <header>
      <LayoutHeader></LayoutHeader>
    </header>
    <main>
      <component
        v-for="(item, index) in stepList.tabs"
        v-show="active === index"
        :is="item.com"
        @next="next"
        @pre="pre"
      ></component>
    </main>
  </div>
</template>

<script setup>
import LayoutHeader from "@/components/layout/layoutHeader";
import Welcome from "./_modules/welcome.vue";
import DeviceDiscovery from "./_modules/deviceDiscovery.vue";
import AdminAccount from "./_modules/adminAccount.vue";
import { ref, markRaw, reactive, onMounted } from "vue";
const active = ref(0);
const stepList = reactive({
  tabs: [
    {
      name: "Welcome",
      com: markRaw(Welcome),
    },
    {
      name: "DeviceDiscovery",
      com: markRaw(DeviceDiscovery),
    },
    {
      name: "AdminAccount",
      com: markRaw(AdminAccount),
    },
  ],
});
const next = () => {
  active.value = ++active.value;
  console.log(active.value);
};
const pre = () => {
  if (active.value === 1) {
    active.value = 0;
  } else {
    active.value = --active.value;
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1200px;
  padding: 0 40px;
  margin: 0 auto;
  box-sizing: border-box;
  main {
    z-index: 1;
  }
}
.top-between {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}
</style>
