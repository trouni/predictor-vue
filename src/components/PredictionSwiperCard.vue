<template>
  <div
    :class="[
      'swiper-card w-11/12 md:w-4/5 lg:w-3/4 max-w-5xl absolute transition duration-500 flex overflow-visible filter blur-sm first:blur-0',
      { 'first:drop-shadow-lightning': confidenceRate > 1 },
    ]"
    :style="style"
  >
    <div
      class="relative max-h-1/2 h-56 sm:h-64 md:h-72 lg:h-80 w-full transform scale-75 transition"
    >
      <img
        :src="match.teamHome.flagUrl"
        class="z-20 transform scale-110 absolute left-0 pointer-events-none w-1/2 h-full object-cover rounded-l-xl -mt-2 left-team-clip"
      />
      <img
        :src="match.teamAway.flagUrl"
        class="z-10 transform scale-110 absolute right-0 pointer-events-none w-1/2 h-full object-cover rounded-r-xl mt-2"
      />
      <img
        src="@/assets/lightning.png"
        class="z-20 absolute h-full left-1/2 w-1/12 transform scale-115 -translate-x-1/2 drop-shadow-lightning filter"
      />
    </div>
  </div>
</template>

<script>
import Hammer from 'hammerjs'

export default {
  props: {
    match: Object,
    index: Number,
    active: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    const hammer = new Hammer(this.$el)
    hammer.on('panend', this.dropCard)
    hammer.on('panmove', this.dragCard)
  },

  computed: {
    rotation() {
      return this.deltaX * 0.01 * (this.deltaY * 0.02)
    },
    cursor() {
      if (this.moving) return 'grabbing'
      else if (!this.active) return 'grab'
      else return 'default'
    },
    style() {
      return {
        zIndex: 100 - this.index,
        transform: `translate(${this.deltaX}px, ${this.deltaY}px)
                    rotate(${this.rotation}deg)
                    scale(${(20 - this.index) / 20})
                    translateY(-${15 * this.index}px)`,
        opacity: (10 - this.index) / 10,
        'transition-property': this.moving ? 'none' : 'all',
        cursor: this.cursor,
        'will-change': 'transform',
      }
    },
    choice() {
      let choice = ''
      if (
        Math.abs(this.deltaX) < this.submitThreshold * 0.5 &&
        Math.abs(this.deltaY) < this.submitThreshold * 0.5
      )
        choice = ''
      else if (Math.abs(this.deltaY) > Math.abs(this.deltaX) * 1.5)
        choice = 'draw'
      else if (this.deltaX > this.submitThreshold * 0.5) choice = 'away'
      else if (this.deltaX < -this.submitThreshold * 0.5) choice = 'home'
      this.$emit('input', choice)
      return choice
    },
    confidenceRate() {
      return Math.max(
        Math.abs(this.deltaY) / this.submitThreshold,
        Math.abs(this.deltaX) / this.submitThreshold
      )
    },
  },

  data() {
    return {
      deltaX: 0,
      deltaY: 0,
      moving: false,
      submitThreshold: 100,
    }
  },

  methods: {
    dragCard(e) {
      if (!this.active) return

      this.moving = true
      this.deltaX = e.deltaX
      this.deltaY = e.deltaY

      this.$emit('input', this.choice)
    },
    dropCard(e) {
      if (!this.active) return

      this.moving = false
      if (this.confidenceRate > 1) {
        this.$el.style.opacity = 0
        this.deltaX = Math.abs(e.velocityX + 0.5) * this.deltaX * 10
        this.deltaY = Math.abs(e.velocityY + 0.5) * this.deltaY * 10
        this.$emit('remove', this.choice)
      } else {
        this.deltaX = 0
        this.deltaY = 0
        this.$emit('input', '')
      }
    },
  },
}
</script>

<style lang="scss">
.left-team-clip {
  clip-path: polygon(
    0 0,
    0 100%,
    90% 100%,
    95% 66%,
    90% 71%,
    100% 29%,
    95% 34%,
    101% 0
  );
}

.swiper-card:first-child > div {
  @apply scale-90;
}
</style>
