<template>
  <div class="mx-4 mt-8 flex flex-col items-center text-center">
    <div
      class="w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-5"
      style="
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.18),
          rgba(255, 255, 255, 0.06)
        );
        border: 1px solid rgba(255, 255, 255, 0.15);
      "
    >
      <BaseIcon :name="icon" class="fa-2x text-white/50" />
    </div>
    <p class="text-white font-bold text-lg mb-1">{{ title }}</p>
    <p class="text-white/50 text-sm max-w-xs leading-relaxed">{{ subtitle }}</p>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',

  props: {
    icon: {
      type: String,
      default: 'circle-exclamation',
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
  },
}
</script>
