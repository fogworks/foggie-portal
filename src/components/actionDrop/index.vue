<template>
  <div>
    <div class="action-box">
      <slot class="action-btn"> </slot>
      <teleport to="body">
        <div class="dropdown">
          <slot name="dropdown"> </slot>
        </div>
      </teleport>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.action-box {
  position: relative;
  &:hover {
    .dropdown {
      display: block;
    }
  }
  .dropdown {
    display: none;
    position: absolute;
    top: 32px;
    left: -55px;
    z-index: 99;
    &:hover {
      display: block;
    }
  }
}
</style>
