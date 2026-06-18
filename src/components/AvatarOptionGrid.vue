<template>
  <div
    class="grid grid-cols-4 gap-3 px-4 pb-10 overflow-y-auto"
    style="max-height: 50vh"
  >
    <button
      v-for="option in options"
      :key="option.value"
      @click="$emit('select', option.value)"
      class="flex flex-col items-center focus:outline-none"
      :class="isSelected(option) ? 'p-1' : ''"
    >
      <div
        class="relative w-full rounded-full overflow-hidden"
        style="background-color: rgba(255, 255, 255, 0.1)"
        :style="
          isSelected(option)
            ? 'padding-bottom: 100%; outline: 2px solid #fa5151; outline-offset: 2px;'
            : 'padding-bottom: 100%'
        "
      >
        <img
          :src="option.src"
          :alt="option.label"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div
          v-if="isSelected(option)"
          class="absolute inset-0 flex items-center justify-center"
          style="background: rgba(250, 81, 81, 0.3)"
        >
          <BaseIcon name="check" class="text-white" style="font-size: 0.7rem" />
        </div>
      </div>
      <span
        class="mt-1.5 text-xs text-center leading-tight"
        style="color: rgba(255, 255, 255, 0.6)"
      >
        {{ option.label }}
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'AvatarOptionGrid',

  props: {
    options: {
      type: Array,
      required: true,
    },
    selected: {
      type: String,
      default: null,
    },
  },

  methods: {
    isSelected(option) {
      return option.value === this.selected
    },
  },
}
</script>
