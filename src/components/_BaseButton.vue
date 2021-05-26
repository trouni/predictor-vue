<template>
  <button v-on="$listeners">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@import '@/styles';

button {
  @extend %typography-small;
  padding: $size-button-padding;
  color: $color-button-text;
  cursor: pointer;
  background: $red;
  border: none;
  &:disabled {
    cursor: not-allowed;
    background: $color-button-disabled-bg;
  }
}
</style>
