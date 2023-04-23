<template>
  <div
    ref="ripple-ink"
    class="ripple-ink"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <div
      v-for="ink in inkQueue"
      :key="ink.key"
      :style="{
        width: ink.width,
        height: ink.height,
        marginLeft: ink.marginLeft,
        marginTop: ink.marginTop,
      }"
      :class="[
        'ink',
        ink.isHolding ? 'is-holding' : '',
        ink.isDone ? 'is-done' : '',
      ]"
    ></div>
  </div>
</template>

<script>
export default {
  name: "RippleInk",
  data() {
    return {
      inkQueue: [],
    };
  },
  methods: {
    handleMouseDown(e) {
      if (this?.$el) {
        const rect = this.$el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        let max;
        if (rect.width === rect.height) {
          max = rect.width * Math.SQRT2;
        } else {
          max = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
        }
        const size = max * 2 + "px";
        this.inkQueue.push({
          key: Math.random(),
          width: size,
          height: size,
          marginLeft: x - max + "px",
          marginTop: y - max + "px",
          isHolding: false,
          isDone: false,
        });
      }
      // 添加完队列数据后，在下一个事件周期开始动画
      setTimeout(() => {
        this.inkQueue[this.inkQueue.length - 1].isHolding = true;
      });
    },
    handleMouseUp() {
      this.inkQueue[this.inkQueue.length - 1].isDone = true;
      setTimeout(() => {
        this.inkQueue.shift();
      }, 650);
    },
  },
};
</script>

