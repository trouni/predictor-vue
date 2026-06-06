<template>
  <div
    :class="[
      'flex flex-col py-2 px-3 h-full rounded-full shadow-inner-md',
      backgroundStyle,
      highlightStyle,
      clickableStyle,
      opacityStyle,
    ]"
  >
    <img
      v-if="teamHome.flagUrl && chosen"
      :src="teamHome.flagUrl"
      alt=""
      aria-hidden="true"
      class="absolute top-0 left-0 bottom-0 w-1/2 h-full object-cover pointer-events-none transition-opacity duration-300 opacity-5"
    />
    <img
      v-if="teamAway.flagUrl && chosen"
      :src="teamAway.flagUrl"
      alt=""
      aria-hidden="true"
      class="absolute top-0 right-0 bottom-0 w-1/2 h-full object-cover pointer-events-none transition-opacity duration-300 opacity-5"
    />
    <span class="uppercase text-sm leading-none font-black select-none">
      DRAW
    </span>
  </div>
</template>

<script>
export default {
  props: {
    teamHome: Object,
    teamAway: Object,
    status: {
      type: String,
      default: 'default',
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    greyOut: {
      type: Boolean,
      default: false,
    },
    chosen: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    backgroundStyle() {
      return this.status === 'selected' ? 'draw-selected' : 'bg-gray-500 text-white/50'
    },
    highlightStyle() {
      return this.status === 'selected' ? '' : `border-2 border-prediction-${this.status}`
    },
    opacityStyle() {
      if (this.greyOut) {
        return 'opacity-40'
      } else if (this.clickable) {
        return 'opacity-80'
      } else {
        return 'opacity-100'
      }
    },
    clickableStyle() {
      return this.clickable ? 'cursor-pointer' : 'cursor-default'
    },
  },
}
</script>

<style lang="scss">
.draw-selected {
    box-shadow:
    0 0 0 5px #ffff,
    0 0 14px 5px #fffc;
    background-color: #ffff;
    color: #44637f
}
</style>
