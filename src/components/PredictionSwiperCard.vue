<template>
  <div
    class="bg-white w-11/12 md:w-4/5 lg:w-3/4 max-w-5xl absolute rounded-2xl duration-500 overflow-hidden flex border-6 border-white shadow-2xl"
    :style="style"
  >
    <div class="relative max-h-1/2 h-56 sm:h-64 md:h-72 lg:h-80 w-full">
      <img
        :src="match.teamHome.flagUrl"
        class="left-team-clip transform scale-110 absolute left-0 pointer-events-none w-1/2 h-full object-cover pr-1"
      />
      <img
        :src="match.teamAway.flagUrl"
        class="right-team-clip transform scale-110 absolute right-0 pointer-events-none w-1/2 h-full object-cover pl-1"
      />
      <img
        src="@/assets/lightning.png"
        class="absolute h-full left-1/2 w-20 transform -translate-x-1/2 drop-shadow-lightning filter"
      />
      <!-- <p
        class="text-glow text-purple absolute top-1/2 left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl lg:text-4xl xl:text-5xl filter drop-shadow-lg -translate-y-1/2 h-10 w-10 flex items-center justify-center font-bold"
      >
        V.
      </p> -->
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
        Math.abs(this.deltaX) < this.submitThreshold * 0.7 &&
        Math.abs(this.deltaY) < this.submitThreshold * 0.7
      )
        choice = ''
      else if (Math.abs(this.deltaY) > Math.abs(this.deltaX) * 1.5)
        choice = 'draw'
      else if (this.deltaX > this.submitThreshold * 0.7) choice = 'away'
      else if (this.deltaX < -this.submitThreshold * 0.7) choice = 'home'
      this.$emit('input', choice)
      return choice
    },
  },

  data() {
    return {
      deltaX: 0,
      deltaY: 0,
      moving: false,
      submitThreshold: 130,
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
      if (
        Math.abs(e.deltaY) < this.submitThreshold &&
        Math.abs(e.deltaX) < this.submitThreshold
      ) {
        this.deltaX = 0
        this.deltaY = 0
        this.$emit('input', '')
      } else {
        this.deltaX = Math.abs(e.velocityX + 0.5) * this.deltaX * 10
        this.deltaY = Math.abs(e.velocityY + 0.5) * this.deltaY * 10
        this.$emit('remove', this.choice)
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
    calc(100% - 2.5rem) 100%,
    calc(100% - 0.5rem) 65%,
    calc(100% - 2.5rem) 71%,
    calc(100% + 1rem) 29%,
    calc(100% - 1rem) 34%,
    calc(100% + 1rem) 0
  );
}

.right-team-clip {
  clip-path: polygon(
    3rem 0,
    100% 0,
    100% 100%,
    -0.5rem 100%,
    1rem 66%,
    -0.5rem 70%,
    2rem 27%,
    1rem 33%
  );
}
</style>
