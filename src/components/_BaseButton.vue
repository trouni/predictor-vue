<template>
  <button
    v-on="$listeners"
    class="rounded-sm shadow bg-red-500 hover:bg-red-400 active:bg-red-600 active:scale-95 transform px-8 py-2"
  >
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
  border: none;
  &:disabled {
    cursor: not-allowed;
    background: $color-button-disabled-bg;
  }
}
</style>
