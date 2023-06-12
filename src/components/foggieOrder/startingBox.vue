<template>
  <div class="order-starting-box">
    <h2>{{ $t('index.starting_info') }}</h2>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <!-- <span></span> -->
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
.order-starting-box {
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  height: 30px;
  // text-align: center;
  h2 {
    // color: #00EE00;
    color: #fff;
    margin: 0;
    font: .8em;
    // text-transform: uppercase;
    letter-spacing: .1em;
    font-size: 12px;

    display: inline-block;
    margin-right: 40px;
  }
  span {
    display: inline-block;
    vertical-align: middle;
    width: .6em;
    height: .6em;
    margin: .19em;
    // background: #007DB6;
    // background: #9ACD32;
    background: #00FF00;
    border-radius: .6em;
    animation: startingBoxLoading 3s infinite alternate;
  }
  span:nth-of-type(2) {
    // background: #008FB2;
    // background: #66CD00;
    background: #00FF00;
    animation-delay: 0.2s;
    animation-delay: 0.6s;
  }
   span:nth-of-type(3) {
    // background: #009B9E;
    // background: #00CD00;
    background: #00FF00;
    animation-delay: 0.4s;
    animation-delay: 1.2s;
  }
  span:nth-of-type(4) {
    // background: #00A77D;
    // background: #76EE00;
    background: #00FF00;
    animation-delay: 0.6s;
    animation-delay: 1.8s;
  }
  span:nth-of-type(5) {
    // background: #00B247;
    // background: #00EE00;
    background: #00FF00;
    animation-delay: 0.8s;
    animation-delay: 2.4s;
  }
  span:nth-of-type(6) {
    // background: #5AB027;
    // background: #7FFF00;
    background: #00FF00;
    animation-delay: 1.0s;
    animation-delay: 3s;
  }
  // span:nth-of-type(7) {
  //   // background: #A0B61E;
  //   background: #00EE00;
  //   background: #00FF00;
  //   animation-delay: 1.2s;
  // }
}

@keyframes startingBoxLoading {
  0% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}
</style>
