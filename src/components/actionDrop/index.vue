<template>
  <div>
    <div class="action-box">
      <slot class="action-btn"> </slot>
      <div class="dropdown">
        <slot name="reference"> </slot>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.action-box {
  position: relative;
  cursor: pointer;
  &:hover {
    .dropdown {
      display: block;
    }
  }
  .dropdown {
    display: none;
    position: absolute;
    top: 26px;
    left: 60px;
    z-index: 99;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 8px 3px;
    &:hover {
      display: block;
    }
  }
}
</style>
