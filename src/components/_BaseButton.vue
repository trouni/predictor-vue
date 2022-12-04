<template>
  <button
    v-on="$listeners"
    class="primary rounded-sm shadow active:scale-95 transform"
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

.primary {
  @apply bg-red-500 hover:bg-red-400 active:bg-red-600 px-4 md:px-8 py-2;
}

.secondary {
  @apply bg-transparent hover:bg-black/20 active:bg-black/10 text-black border-black border-solid border-2;
}

.small {
  @apply text-sm px-2 md:px-4 py-2;
}
</style>
