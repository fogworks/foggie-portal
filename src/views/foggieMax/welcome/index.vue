<template>
  <div class="out-box">
    <div class="container">
      <header>
        <LayoutHeader></LayoutHeader>
      </header>
      <main v-loading="loading">
        <svg-icon
          v-show="active > 0 && preShow"
          class="back"
          icon-class="portal-back"
          @click="pre"
        ></svg-icon>
        <component
          v-for="(item, index) in stepList.tabs"
          v-show="active === index"
          :is="item.com"
          @next="next"
          :hasExternalNetwork="haveNet"
          v-model:preShow="preShow"
        ></component>
      </main>
    </div>
  </div>
</template>

<script setup>
import LayoutHeader from "@/components/layout/layoutHeader";
import Welcome from "./_modules/welcome.vue";
// import DeviceDiscovery from "./_modules/deviceDiscovery.vue";
import ExternalMember from "./_modules/externalMember";
// import AdvancedServices from "./_modules/advancedServices";
import { ref, markRaw, reactive, toRefs } from "vue";
import { get_service_info } from "@/utils/api";
const active = ref(0);
const preShow = ref(false);
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
    // {
    //   name: "AdminAccount",
    //   com: markRaw(AdminAccount),
    // },
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
  preShow.value = true;
};
const pre = () => {
  if (active.value === 1) {
    active.value = 0;
  } else {
    active.value = --active.value;
  }
};
const props = defineProps({
  haveNet: {
    type: Boolean,
    default: false,
  },
});
const haveNet = toRefs(props);
</script>

<style lang="scss" scoped>
.out-box {
  width: 100%;
  height: 100%;
  // background: url("~@/assets/cool-background.png") no-repeat;
  // background-size: cover;
}
.container {
  width: 1200px;
  padding: 0 40px 40px;
  margin: 0 auto;
  box-sizing: border-box;

  main {
    position: relative;
    z-index: 1;
    :deep {
      .el-loading-mask {
        background: transparent;
        z-index: 1;
      }
    }
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
<style>
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>
