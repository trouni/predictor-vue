<template>
  <div
    :class="[
      'flex flex-col py-2 px-3 h-full rounded-full shadow-inner-md bg-gray-400',
      highlight,
    ]"
  >
    <span class="uppercase text-sm leading-none text-white">DRAW</span>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: 'default',
      required: false,
    },
  },

  computed: {
    highlight() {
      return `border-6 border-badge-${this.status}`
    },
  },
}
</script>
