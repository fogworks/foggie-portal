<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-icon svg-external-icon"
  />
  <svg
    v-else
    :class="svgClass"
    :style="{ 'font-size': size + 'px' }"
    aria-hidden="true"
  >
    <use :href="iconName" />
  </svg>
</template>

<script>
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

export default {
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    //图标的font-size，单位是px
    size: {
      type: String,
      default: "",
    },
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass);
    },
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        "-webkit-mask": `url(${this.iconClass}) no-repeat 50% 50%`,
      };
    },
  },
};
</script>

<style scoped>
.svg-icon {
  font-size: inherit;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentcolor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentcolor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
