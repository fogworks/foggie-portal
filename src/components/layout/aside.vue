<template>
  <div class="aside_menu">
    <el-menu :default-active="store.getters.activeIndex" class="el-menu-vertical-demo" :collapse-transition="false" router
      :collapse="isMobile">
      <div class="logoBox" v-if="!isMobile">
        <svg-icon icon-class="FoggieV" style="font-size: 80px;"></svg-icon>
        <span>FoggieV</span>
      </div>
      <el-menu-item index="Home" :route="{ path: '/Alltemplate/Home' }" @click="menuItemClick('Home')">
        <el-icon>
          <School />
        </el-icon>
        <template #title>Home</template>
      </el-menu-item>

      <el-menu-item index="Orders" :route="{ path: '/Alltemplate/Orders' }" @click="menuItemClick('Orders')">
        <el-icon>
          <Memo />
        </el-icon>
        <template #title>订单</template>
      </el-menu-item>


      <div class="version" v-if="!isMobile" @click="menuItemClick('Storage')">
        <div class="version_vontent">
          <div class="SVG">
            <svg-icon icon-class="gvzymi" size="46"></svg-icon>
          </div>
          <div class="wrapper">
            <el-icon size="20px" color="#d5d7e3">
              <CirclePlusFilled />
            </el-icon>
          </div>
          <div class="fzvTzm">
            <p>Storage</p>
          </div>
        </div>
      </div>

    </el-menu>
  </div>
</template>

<script setup>
import { getPrivateKey } from "@/api/common";
import { useStore } from "vuex";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const store = useStore()
const router = useRouter()
const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});
function menuItemClick(item) {
  store.commit('global/setActiveIndex', item)

  if (item == 'Storage') {
    router.push({ path: '/Alltemplate/Storage' })
  }
}



onMounted(() => {
  let headerRoute = localStorage.getItem("headerRoute") || "Home";
  store.commit('global/setActiveIndex', headerRoute)

});
</script>

<style lang="scss" scoped>
// @import "../../static/style/variables.scss";
@import "@/static/style/variables.scss";


.logoBox {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;

  &>span {
    font-size: 16px;
    font-weight: bold;
    margin-left: -20px;
    font-style: italic;
  }
}

.version {
  background: linear-gradient(rgb(255, 255, 255) 0%, rgb(217, 223, 255) 100%);
  border: none;
  box-shadow: rgb(255 255 255 / 20%) 0px 0px 0px 0.5px inset, rgb(23 0 102 / 20%) 0px 20px 40px, rgb(0 0 0 / 10%) 0px 1px 3px;
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  width: 180px;
  height: 67px;
  padding: 0px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100px;
  transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;

  .version_vontent {
    height: 67px;
    display: grid;
    grid-template-columns: 45px auto;
    padding: 12px;
    justify-items: start;

    .SVG {
      position: absolute;
      width: 45px;
      height: 45px;
      top: 12.5px;
      left: 13px;
      transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
    }

    .wrapper {
      position: relative;
      width: 35px;
      height: 35px;
      background: linear-gradient(200.44deg, rgb(67, 22, 219) 13.57%, rgb(144, 118, 231) 98.38%);
      box-shadow: rgb(182 153 255 / 30%) 0px 10px 20px;
      border-radius: 50%;
      padding: 8px;
      margin: auto;
      top: 2px;
      left: 1px;
    }
  }

  .fzvTzm {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 4px;
    margin: auto auto auto 16px;
    text-align: left;

    &>p:first-child {
      font-style: normal;
      font-size: 14px;
      line-height: 18px;
      margin: 0px;
      font-weight: 600;
      text-transform: uppercase;
      color: black !important;

    }

  }
}

.version:hover {
  transform: translate(-48%, -2px);
  box-shadow: rgb(255 255 255 / 20%) 0px 0px 0px 0.5px inset, rgb(23 0 102 / 30%) 0px 40px 80px, rgb(0 0 0 / 30%) 0px 10px 30px;

  .wrapper {
    background: linear-gradient(200.44deg, rgb(94, 23, 255) 13.57%, rgb(55, 180, 233) 98.38%);
    box-shadow: rgb(182 153 255 / 30%) 0px 10px 20px, rgb(0 0 0 / 30%) 0px 0px 20px inset;
  }

  .SVG {
    transform: rotate(30deg) scale(1.1);
  }
}

.aside_menu {
  height: 100%;
  width: 100%;
  position: relative;
}

.el-menu-vertical-demo {
  min-height: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: #{$sideBarWidth};

  padding: 10px 18px 18px;
}

::v-deep {
  .el-menu-item {
    border-radius: 10px;
  }

  .el-menu-item.is-active {
    background-color: rgb(200, 200, 200);
    font-weight: bold;
  }

  .el-menu-item:not(.is-active):hover {
    text-decoration: none;
    background-color: rgba(0, 0, 0, 0.04);
  }
}
</style>
