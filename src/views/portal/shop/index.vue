<template>
  <div class="shop-box" v-if="isShop">
    <div class="card">
      <div class="content">
        <!-- <div class="title">Foggie</div> -->
        <div>
          <svg-icon icon-class="logo-dog"></svg-icon>
        </div>
        <div class="price">$19.9</div>
        <div class="description">
          <div>
            <svg-icon icon-class="yes" size="20"></svg-icon>
            2 CPU 4 Thread Processor
          </div>
          <div>
            <svg-icon icon-class="yes" size="20"></svg-icon>
            4 GB RAM
          </div>
          <div>
            <svg-icon icon-class="yes" size="20"></svg-icon>
            30 mbps Optimized Bandwidth
          </div>
          <div>
            <svg-icon icon-class="yes" size="20"></svg-icon>
            Independent Static IP Address
          </div>
          <div>
            <svg-icon icon-class="yes" size="20"></svg-icon>
            80/130 GB High PerformanceSSD
          </div>
        </div>
      </div>
      <button @click="handleActive('foggie')">Buy now</button>
      <!-- <button disabled>Coming Soon</button> -->
    </div>

    <div class="card">
      <div class="content">
        <div class="title">
          <img src="@/assets/welcome-asset.png" alt="" />
        </div>
        <div class="description">
          <div>
            <svg-icon icon-class="yes" size="20"></svg-icon>
            No Monthly Fees
          </div>
          <div>
            <svg-icon icon-class="yes" size="20"></svg-icon>
            Earn crypto rewards while you sleep
          </div>
          <div>
            <svg-icon icon-class="yes" size="20"></svg-icon>
            Run privacy-first dApps
          </div>
          <div>
            <svg-icon icon-class="yes" size="20"></svg-icon>
            Mint NFTs in bulk with no code
          </div>
          <div>
            <svg-icon icon-class="yes" size="20"></svg-icon>
            Avoid censorship & digital piracy
          </div>
          <div>
            <svg-icon icon-class="yes" size="20"></svg-icon>
            Escape from Big Tech
          </div>
        </div>
      </div>
      <a
        style="width: 90%"
        target="_blank"
        href="https://www.indiegogo.com/projects/foggie-max-the-world-s-first-personal-web3-server#/"
      >
        <button style="width: 100%">Buy now</button>
      </a>
      <!-- <button disabled>Coming Soon</button> -->
    </div>

    <div class="card">
      <div class="content">
        <div class="title">Storage</div>
        <div>
          <svg-icon icon-class="storage"></svg-icon>
        </div>
        <!-- <div class="price">$</div> -->
        <div class="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at
          posuere eros. Interdum et malesuada fames ac ante ipsum primis in
          faucibus.
        </div>
      </div>
      <button @click="handleActive('storage')">Buy now</button>
    </div>

    <div class="card">
      <div class="content">
        <div class="title">NFT</div>
        <div>
          <img style="width: 220px" src="@/assets/nft.png" alt="" />
          <!-- <svg-icon icon-class="logo-dog"></svg-icon> -->
        </div>
        <!-- <div class="price">$68</div> -->
        <div class="description">
          <!-- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at
          posuere eros. Interdum et malesuada fames ac ante ipsum primis in
          faucibus. -->
        </div>
      </div>
      <a
        style="width: 90%"
        target="_blank"
        href="https://opensea.io/collection/foggie-genesis"
      >
        <button style="width: 100%">BUY NOW</button>
      </a>
    </div>
  </div>
  <div class="back" v-if="!isShop" @click="handleActive">
    <svg-icon icon-class="back"></svg-icon>
  </div>
  <Storage
    :balanceCount="balanceCount"
    @getAssets="getUserAssets"
    v-if="!isShop && active === 'storage'"
  ></Storage>
  <Foggie v-if="!isShop && active === 'foggie'"></Foggie>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Storage from "./_modules/storage";
import Foggie from "./_modules/foggie";
import { userAssets } from "@/api/order/orderList.js";
import { useStore } from "vuex";
import usePrivateKey from "@/views/portal/user/_modules/hooks/usePrivateKey";

// import Storage from "@/views/Alltemplate/Storage/Storage";
const isShop = ref(true);
const active = ref("");
const { passwordIsExist, loadUserLoginStatus } = usePrivateKey();

const handleActive = async (val = "") => {
  if (val == "storage") {
    await loadUserLoginStatus();
    if (passwordIsExist.value) {
      isShop.value = !isShop.value;
      active.value = val;
    }
  } else {
    isShop.value = !isShop.value;
    active.value = val;
  }
};
const store = useStore();
const balanceCount = ref(0);
const email = computed(() => store.getters.email);
const getUserAssets = () => {
  userAssets({ email: email.value }).then((res) => {
    if (res.code == 200) {
      balanceCount.value = +res.data[0]?.balance.quantity.slice(
        0,
        res.data[0].balance.quantity.length - 4
      );
    }
  });
};
onMounted(getUserAssets);
</script>

<style lang="scss" scoped>
.shop-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 300px;
  height: 415px;
  min-width: 300px;
  padding: 20px 1px;
  margin: 10px 20px;
  text-align: center;
  position: relative;
  border-radius: 10px;
  background-color: #6b6ecc;
  background: linear-gradient(45deg, #04051dea 0%, #2b566e 100%);
  transition: all 0.3s;
  cursor: default;
  &:hover {
    transform: scale(1.05);
    svg,
    img {
      transform: scale(0.95);
    }
  }
  &:nth-child(2) {
    background: linear-gradient(
      209.21deg,
      rgb(4, 20, 104) 13.57%,
      rgb(73, 18, 229) 98.38%
    );
  }
  &:nth-child(3) {
    background: linear-gradient(
      209.21deg,
      rgb(23, 23, 27) 13.57%,
      rgb(119, 63, 211) 98.38%
    );
  }
  &:nth-child(4) {
    background: linear-gradient(
      209.21deg,
      rgb(153, 40, 52) 13.57%,
      rgb(255, 114, 98) 98.38%
    );
  }
}

.content {
  padding: 20px;
  svg {
    font-size: 100px;
    // color: rgba(255, 255, 255, 0.64);
    color: #fff;
    opacity: 0.64;
    transition: all 0.3s;
  }
  img {
    transition: all 0.3s;
  }
}

.content .price {
  color: white;
  font-weight: 800;
  font-size: 50px;
  text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.42);
}

.content .description {
  color: rgba(255, 255, 255, 0.6);
  margin-top: 25px;
  font-size: 14px;
  text-align: left;
  > div {
    text-align: left;
  }
  svg {
    vertical-align: middle;
    color: $light_blue;
  }
}

.content .title {
  font-weight: 800;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.64);
  margin-top: 10px;
  font-size: 25px;
  letter-spacing: 1px;
  img {
    width: 130px;
  }
}

button {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  border: none;
  outline: none;
  color: rgb(255 255 255);
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.75rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 0.5rem;
  width: 90%;
  text-shadow: 0px 4px 18px #2c3442;
  cursor: pointer;
  &:not(.disabled):hover {
    background: #29abff;
  }
}
.back {
  text-align: left;
  svg {
    font-size: 40px;
    color: #fff;
    cursor: pointer;
    &:hover {
      color: #29abff;
    }
  }
}
</style>
