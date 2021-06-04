<template>
  <div
    :class="[
      'swiper-card w-11/12 md:w-4/5 lg:w-3/4 max-w-5xl absolute transition duration-500 flex overflow-visible filter blur-sm first:blur-0',
      { 'first:drop-shadow-lightning': confidenceRate > confidenceThreshold },
    ]"
    :style="cardStyle"
  >
    <div
      class="relative max-h-1/2 h-56 sm:h-64 md:h-72 lg:h-80 w-full transform scale-75 transition"
    >
      <img
        :src="match.teamHome.flagUrl"
        class="flag z-20 left-0 rounded-l-xl -mt-3 left-flag-clip"
        :style="homeFlagStyle"
      />
      <img
        :src="match.teamAway.flagUrl"
        class="flag z-10 right-0 rounded-r-xl mt-3 right-flag-clip"
        :style="awayFlagStyle"
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
      return (
        Math.sign(this.deltaX) * Math.min(Math.abs(this.deltaX) * 0.1, 20) +
        Math.sign(this.deltaY) * Math.min(Math.abs(this.deltaY) * 0.02, 10)
      )
    },
    cursor() {
      if (this.moving) return 'grabbing'
      else if (!this.active) return 'grab'
      else return 'default'
    },
    cardStyle() {
      return {
        zIndex: 100 - this.index,
        transform: `translate(${this.deltaX}px, ${this.deltaY}px)
                    rotate(${this.rotation}deg)
                    scale(${(20 - this.index) / 20})
                    translateY(-${15 * this.index}px)`,
        // opacity: (10 - this.index) / 10,
        'transition-property': this.moving ? 'none' : 'all',
        cursor: this.cursor,
        'will-change': 'transform',
      }
    },
    homeFlagStyle() {
      return {
        width: `calc(50% - 25% * ${this.horizontalLean})`,
        filter: `brightness(${1 - this.horizontalLean / 8})`,
        transform: `scale(${1.1 - this.horizontalLean / 5})
                    rotate(${
                      3 *
                      this.confidenceRate *
                      this.confidenceRateY *
                      Math.sign(this.deltaY)
                    }deg)
                    translateX(-${Math.round(
                      10 * this.confidenceRate * this.confidenceRateY
                    )}px)`,
        'z-index': this.horizontalLean > 0 ? 50 : 60,
      }
    },
    awayFlagStyle() {
      return {
        width: `calc(50% + 25% * ${this.horizontalLean})`,
        filter: `brightness(${1 + this.horizontalLean / 8})`,
        transform: `scale(${1.1 + this.horizontalLean / 5})
                    rotate(${
                      -3 *
                      this.confidenceRate *
                      this.confidenceRateY *
                      Math.sign(this.deltaY)
                    }deg)
                    translateX(${Math.round(
                      10 * this.confidenceRate * this.confidenceRateY
                    )}px)`,
        'z-index': this.horizontalLean <= 0 ? 50 : 60,
      }
    },
    choice() {
      let choice = ''
      if (
        Math.abs(this.deltaX) < this.distanceThreshold * 0.5 &&
        Math.abs(this.deltaY) < this.distanceThreshold * 0.5
      )
        choice = ''
      else if (Math.abs(this.deltaY) > Math.abs(this.deltaX) * 1.5)
        choice = 'draw'
      else if (this.deltaX > this.distanceThreshold * 0.5) choice = 'away'
      else if (this.deltaX < -this.distanceThreshold * 0.5) choice = 'home'
      this.$emit('input', choice)
      return choice
    },
    confidenceRateX() {
      return Math.min(Math.abs(this.deltaX) / this.distanceThreshold, 1)
    },
    confidenceRateY() {
      return Math.min(Math.abs(this.deltaY) / this.distanceThreshold, 1)
    },
    confidenceRate() {
      return (
        Math.max(this.confidenceRateX, this.confidenceRateY) *
        Math.abs(this.confidenceRateX - this.confidenceRateY)
      )
    },
    horizontalLean() {
      return (
        Math.sign(this.deltaX) *
        this.confidenceRateX *
        (1 - this.confidenceRateY)
      )
    },
  },

  data() {
    return {
      deltaX: 0,
      deltaY: 0,
      moving: false,
      distanceThreshold: 100,
      confidenceThreshold: 0.5,
    }
  },

  methods: {
    dragCard(e) {
      if (!this.active) return

      this.moving = true
      this.deltaX = e.deltaX
      this.deltaY = e.deltaY

      if (this.confidenceRate > this.confidenceThreshold)
        this.$emit('input', this.choice)
      else this.$emit('input', '')
    },
    dropCard(e) {
      if (!this.active) return

      this.moving = false
      if (this.confidenceRate > this.confidenceThreshold) {
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

<style lang="scss" scoped>
.flag {
  @apply absolute pointer-events-none w-1/2 h-full object-cover;
}

.left-flag-clip {
  clip-path: polygon(0 0, 0 100%, calc(100% - 1rem) 100%, 100% 0);
}

.right-flag-clip {
  clip-path: polygon(1rem 0, 0 100%, 100% 100%, 100% 0);
}

.swiper-card:first-child > div {
  @apply scale-90;
}
</style>
