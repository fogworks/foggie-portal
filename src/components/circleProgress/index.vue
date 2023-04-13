<template>
  <div class="circle">
    <div class="circle_left ab" :style="renderLeftRate"></div>
    <div class="circle_right ab" :style="renderRightRate"></div>
    <div class="circle_text">
      <span class="value">{{ rate }}%</span>
    </div>
  </div>
</template>

<script>
import { ref, toRefs, computed } from "vue";
export default {
  name: "CircleProgress",
  props: {
    rate: Number,
  },
  setup(props) {
    const { rate } = toRefs(props);
    const renderRightRate = computed(() => {
      if (rate.value < 50) {
        return "transform: rotate(" + 3.6 * rate.value + "deg);";
      } else {
        return "transform: rotate(0);border-color: #54c4fd;";
      }
    });
    const renderLeftRate = computed(() => {
      if (rate.value >= 50) {
        return "transform: rotate(" + 3.6 * (rate.value - 50) + "deg);";
      }
    });

    return {
      renderLeftRate,
      renderRightRate,
    };
  },
};
</script>

<style lang="less" scoped>
.circle {
  width: 300px;
  height: 300px;
  position: relative;
  border-radius: 50%;
  margin: 0 auto;
  box-shadow: inset 0 0 0 20px #54c4fd;

  .ab {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  &_left {
    border: 20px solid #a8abb2;
    border-radius: 50%;
    clip: rect(0, 150px, 300px, 0);
  }

  &_right {
    border: 20px solid #a8abb2;
    border-radius: 50%;
    clip: rect(0, 300px, 300px, 150px);
  }

  &_text {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #000;
    font-size: 40px;
    font-weight: 700;

    .name {
      margin-bottom: 4px;
    }
  }
}
</style>
