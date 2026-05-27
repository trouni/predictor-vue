<template>
  <div class="app-header">

    <div :class="$slots.default ? 'px-5 pt-5 pb-0' : 'px-5 pt-5 pb-4'">
      <!-- Page / competition title -->
      <h1 v-if="title" class="text-white font-bold leading-tight truncate" style="font-size: 1.35rem; letter-spacing: -0.01em">
        {{ title }}
      </h1>
    </div>

    <!-- Sub-header slot: leaderboard tabs, competition context, etc. -->
    <div v-if="$slots.default">
      <slot />
    </div>

    <!-- Hairline separator -->
    <div style="height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)" />

  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
    },
    // Kept for backwards-compat with route meta — no longer rendered
    img: {
      type: String,
      required: false,
    },
  },
}
</script>
