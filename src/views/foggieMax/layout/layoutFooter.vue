<template>
  <div class="lay-footer">
    <div class="foot-left">Copyright © 2023 Fog Works, Inc.</div>
    <div class="foot-right">
      <a href="https://foggie.fogworks.io/#/paymentPolicy_EN">Payment Policy</a>
      <a href="https://foggie.fogworks.io/#/privacyPolicy_EN">Privacy Policy</a>
      <a href="https://foggie.fogworks.io/#/termsConditions_EN">Terms and Conditions</a>
      <a href="https://twitter.com/fogworksinc/">
        <svg-icon icon-class="twitter"></svg-icon>
        <!-- <img src="@/assets/twitter.png" alt="" /> -->
      </a>
      <a href="https://discord.gg/fogworks">
        <svg-icon icon-class="discord"></svg-icon>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.lay-footer {
  display: flex;
  box-sizing: border-box;
  border-top: 1px solid rgb(153 153 153);
  padding: 56px 0;
  color: var(--text-color);
  font-weight: 700;
  height: 144px;
  // overflow: hidden;
  //   transform-origin: left top;
  //   clip-path: polygon(0px 31px round,40px 0px round,1120px 0,100% 100%,0 100%);
  //   background: linear-gradient(rgba(19, 12, 62, 0.8) 0%, rgb(30, 19, 87) 28%);
  .foot-left {
    flex: 1;
    font-size: 22px;
    text-align: left;
  }
  .foot-right {
    display: flex;
    align-items: center;
    font-size: 18px;
    a {
      display: inline-block;
      color: var(--text-color);
      transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
      &:hover{
        transform: scale(1.1);
      }
      & + a {
        margin-left: 16px;
      }
      svg{
        font-size: 24px;
        color: var(--text-color);
      }
      img {
        width: 32px;
      }
    }
  }
}
</style>
