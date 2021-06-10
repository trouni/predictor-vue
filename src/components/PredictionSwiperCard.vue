<template>
  <div
    :class="[
      'swiper-card w-full md:w-4/5 lg:w-3/4 max-w-5xl absolute transition duration-500 flex overflow-visible filter blur-sm first:blur-0 contrast-75 first:contrast-100',
    ]"
    :style="cardStyle"
  >
    <div
      class="max-h-1/2 h-56 sm:h-64 md:h-72 lg:h-80 w-full transform scale-75 transition"
    >
      <img
        :src="match.teamHome.flagUrl"
        class="flag z-20 left-0 rounded-l-xl mb-4 left-flag-clip"
        :style="homeFlagStyle"
      />
      <img
        :src="match.teamAway.flagUrl"
        class="flag z-10 right-0 rounded-r-xl mt-4 right-flag-clip"
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
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL })
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
        zIndex: 30 - this.index,
        transform: `translate(${this.deltaX}px, ${this.deltaY}px)
                    rotate(${this.rotation}deg)
                    scale(${(20 - this.index) / 20})`,
        'transition-property': this.moving ? 'none' : 'all',
        display: this.index > 3 ? 'none' : 'unset',
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
      let choice
      if (
        (this.confidenceRateY >= 1 &&
          this.confidenceRateY > this.confidenceRateX) ||
        (Math.abs(this.velocityY) > this.velocityThreshold &&
          this.velocityConfidenceRate >= 1)
      )
        choice = 'draw'
      else if (
        (this.confidenceRateX >= 1 &&
          this.confidenceRateX > this.confidenceRateY) ||
        (Math.abs(this.velocityX) > this.velocityThreshold &&
          this.velocityConfidenceRate >= 1)
      )
        choice = this.deltaX < 0 ? 'home' : 'away'
      else choice = ''
      return choice
    },
    confidenceRateX() {
      return Math.min(Math.abs(this.deltaX) / this.distanceThreshold, 1)
    },
    confidenceRateY() {
      return Math.min(Math.abs(this.deltaY) / this.distanceThreshold, 1)
    },
    velocityConfidenceRate() {
      return Math.min(
        Math.max(
          Math.abs(this.velocityX / this.velocityY),
          Math.abs(this.velocityY / this.velocityX)
        ) / 3,
        1
      )
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
      velocityX: 0,
      velocityY: 0,
      moving: false,
      distanceThreshold: 120,
      velocityThreshold: 2.5,
      confidenceThreshold: 0.5,
    }
  },

  watch: {
    choice(newChoice) {
      this.$emit('input', newChoice)
    },
  },

  methods: {
    resetCard() {
      this.deltaX = 0
      this.deltaY = 0
      this.velocityX = 0
      this.velocityY = 0
      this.$el.style.opacity = 1
    },
    dragCard(e) {
      if (!this.active) return

      this.moving = true
      this.deltaX = e.deltaX
      this.deltaY = e.deltaY
    },
    dropCard(e) {
      this.moving = false
      if (!this.active) return

      this.velocityX = e.velocityX
      this.velocityY = e.velocityY

      if (this.choice) {
        this.$el.style.opacity = 0
        this.$el.style.transform = `translate(${
          Math.abs(e.velocityX + 0.5) * this.deltaX * 10
        }px, ${Math.abs(e.velocityY + 0.5) * this.deltaY * 10}px`
        this.$emit('submit', this.choice)
      } else {
        this.resetCard()
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
