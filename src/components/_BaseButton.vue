<template>
  <button v-on="$listeners" :class="buttonClasses">
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
  @apply bg-red-500 hover:bg-red-400 active:bg-red-600 px-4 md:px-8 py-2 rounded-sm shadow transform active:scale-95;
}

.secondary {
  @apply bg-transparent hover:bg-black/20 active:bg-black/10 rounded-2xl py-3.5 px-5 text-white border-white border-solid border shadow transform active:scale-95;
}

.small {
  @apply text-sm px-2 md:px-4 py-2;
}
</style>

<script>
export default {
  props: {
    secondary: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonClasses() {
      return {
        primary: !this.secondary,
        secondary: this.secondary,
      }
    }
  }
}
</script>
