<template>
  <div class="shop-box" v-if="isShop">
    <div class="card">
      <div class="content">
        <div class="title">Foggie</div>
        <div class="price">$39.99</div>
        <div class="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at
          posuere eros. Interdum et malesuada fames ac ante ipsum primis in
          faucibus.
        </div>
      </div>
      <button>Buy now</button>
    </div>

    <div class="card">
      <div class="content">
        <div class="title">Foggie Pro Max</div>
        <div class="price">$39.99</div>
        <div class="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at
          posuere eros. Interdum et malesuada fames ac ante ipsum primis in
          faucibus.
        </div>
      </div>
      <button>Buy now</button>
    </div>

    <div class="card">
      <div class="content">
        <div class="title">Storage</div>
        <div class="price">$39.99</div>
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
        <div class="price">$39.99</div>
        <div class="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at
          posuere eros. Interdum et malesuada fames ac ante ipsum primis in
          faucibus.
        </div>
      </div>
      <button>Buy now</button>
    </div>
  </div>
  <div class="back" v-if="!isShop" @click="handleActive">
    <svg-icon icon-class="back"></svg-icon>
  </div>
  <Storage v-if="!isShop && active === 'storage'"></Storage>
</template>

<script setup>
import { ref } from "vue";
import Storage from "./_modules/storage";
const isShop = ref(true);
const active = ref("");
const handleActive = (val = "") => {
  isShop.value = !isShop.value;
  active.value = val;
};
</script>

<style lang="scss" scoped>
.shop-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 300px;
  padding: 20px 1px;
  margin: 10px 0;
  text-align: center;
  position: relative;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(33, 150, 243, 0.4),
    0 4px 6px -4px rgba(33, 150, 243, 0.4);
  border-radius: 10px;
  background-color: #6b6ecc;
  background: linear-gradient(45deg, #04051dea 0%, #2b566e 100%);
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
}

.content .price {
  color: white;
  font-weight: 800;
  font-size: 50px;
  text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.42);
}

.content .description {
  color: rgba(255, 255, 255, 0.6);
  margin-top: 10px;
  font-size: 14px;
}

.content .title {
  font-weight: 800;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.64);
  margin-top: 10px;
  font-size: 25px;
  letter-spacing: 1px;
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
