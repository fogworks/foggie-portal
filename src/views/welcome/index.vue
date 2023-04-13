<template>
  <div class="container">
    <header>
      <LayoutHeader></LayoutHeader>
    </header>
    <main>
      <svg-icon
        v-show="active > 0"
        class="back"
        icon-class="portal-back"
        @click="pre"
      ></svg-icon>
      <component
        v-for="(item, index) in stepList.tabs"
        v-show="active === index"
        :is="item.com"
        @next="next"
        v-model:form="form"
      ></component>
    </main>
  </div>
</template>

<script setup>
import LayoutHeader from "@/components/layout/layoutHeader";
import Welcome from "./_modules/welcome.vue";
// import DeviceDiscovery from "./_modules/deviceDiscovery.vue";
import AdminAccount from "./_modules/adminAccount";
import ExternalMember from "./_modules/externalMember";
import AdvancedServices from "./_modules/advancedServices";
import { ref, markRaw, reactive } from "vue";
const active = ref(2);
const stepList = reactive({
  tabs: [
    {
      name: "Welcome",
      com: markRaw(Welcome),
    },
    // {
    //   name: "DeviceDiscovery",
    //   com: markRaw(DeviceDiscovery),
    // },
    {
      name: "AdminAccount",
      com: markRaw(AdminAccount),
    },
    {
      name: "ExternalMember",
      com: markRaw(ExternalMember),
    },
    // {
    //   name: "AdvancedServices",
    //   com: markRaw(AdvancedServices),
    // },
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
const form = reactive({
  account: "",
  password: "",
  checkPass: "",
  kits: [],
});
</script>

<style lang="less" scoped>
.container {
  width: 1200px;
  padding: 0 40px;
  margin: 0 auto;
  box-sizing: border-box;
  main {
    position: relative;
    z-index: 1;
    .back {
      position: absolute;
      left: 20px;
      top: 280px;
      color: #29abff;
      font-size: 30px;
      cursor: pointer;
      transition: all 0.5s;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
.top-between {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}
</style>
