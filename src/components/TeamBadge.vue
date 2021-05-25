<template>
  <div
    class="shadow-inner-lg rounded-full h-20 w-20 flex items-center justify-center overflow-hidden bg-contain"
    :style="`background-image: url(${flag});`"
  >
    <p class="text-glow text-4xl">{{ score }}</p>
  </div>
</template>

<script>
export default {
  props: {
    flag: String,
    score: Number,
  },
}
</script>

<style lang="scss">
.shadow-inner-lg {
  box-shadow: inset 4px 6px 4px rgba(0, 0, 0, 0.33);
}
.text-glow {
  text-shadow: -0.07em -0.07em 0.04em #fffc, 0 -0.07em 0.04em #fffc,
    0.07em -0.07em 0.04em #fffc, 0.07em 0 0.04em #fffc,
    0.07em 0.07em 0.04em #fffc, 0 0.07em 0.04em #fffc,
    -0.07em 0.07em 0.04em #fffc, -0.07em 0 0.04em #fffc;
}
</style>
