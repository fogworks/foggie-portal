<template>
  <div class="balloon-box">
    <div class="balloon">
      <div class="balloon-top"></div>
      <div class="balloon-bottom"></div>
      <div class="balloon-left"></div>
      <div class="balloon-right"></div>
      <div class="balloon-tie"></div>
      <div class="balloon-string"></div>
      <div class="balloon-highlight">
        <div class="highlight-circle"></div>
        <div class="highlight-cover"></div>
      </div>
      <!-- <div class="balloon-text">The payment has not been completed</div> -->
      <div class="balloon-text">{{ $t('order.balloon_info') }}</div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  },
};
</script>
<style lang="scss">
.balloon-box {
  position: absolute;
  top: -130px;
  right: -40px;
  width: 120px;
  height: 120px;
  .balloon {
    position: absolute;
    top: 5%;
    left: 9%;
    width: 80%;
    height: 85%;
    transform: rotate(5deg);
  }
  .balloon-top {
      position: absolute;
      width: 98%;
      height: 83%;
      background: #ff5656;
      border-radius: 50%;
      transform: rotate(-5deg);
  }

  .balloon-bottom {
      position: absolute;
      top: 43%;
      left: 2%;
      width: 100%;
      height: 75%;
      background: #ff5656;
      -webkit-clip-path: polygon(90% 0, 0 15%, 66% 83%);
      clip-path: polygon(90% 0, 0 15%, 66% 83%);
  }

  .balloon-left {
    position: absolute;
    top: 50%;
    left: 32%;
    width: 10%;
    height: 70%;
    background: #ff5656;
    border-radius: 50%;
    transform: rotate(-52deg);
  }

  .balloon-right {
    position: absolute;
    top: 42%;
    right: 14%;
    width: 10%;
    height: 68%;
    background: #ff5656;
    border-radius: 50%;
    transform: rotate(26deg);
  }

  .balloon-tie {
      position: absolute;
      top: 101%;
      left: 63%;
      width: 5%;
      height: 8%;
      background: #ff5656;
      -webkit-clip-path: polygon(51% 9%, 0% 100%, 100% 100%);
      clip-path: polygon(51% 9%, 0% 100%, 100% 100%);
      transform: rotate(-16deg);
  }

  .balloon-highlight {
      position: absolute;
      width: 100%;
      height: 100%;
  }

  .highlight-circle {
      position: absolute;
      left: 4%;
      top: 3%;
      width: 85%;
      height: 75%;
      background: #fe7b7b;
      border-radius: 50%;
  }

  .highlight-cover {
      position: absolute;
      left: 6%;
      top: 4%;
      width: 90%;
      height: 83%;
      background: #ff5656;
      border-radius: 50%;
  }

  .balloon-string {
      position: absolute;
      top: 109%;
      left: 62%;
      width: 5px;
      height: 40px;
      border-radius: 50%;
      border-right: 2px solid red;
  }
  .balloon-text {    
    position: absolute;
    top: 30px;
    width: 100px;
    height: 100px;
    font-size: 12px;
    color: #fff;
    z-index: 1;
    transform: rotate(-5deg);
  }
}
</style>
