<template>
  <div
    class="bg-white md:w-3/5 m-3 absolute rounded-2xl duration-500 overflow-hidden flex border-6 border-white shadow-2xl"
    :style="style"
  >
    <img
      :src="match.teamHome.flagUrl"
      class="pointer-events-none w-40 h-40 object-cover mr-2"
    />
    <img
      :src="match.teamAway.flagUrl"
      class="pointer-events-none w-40 h-40 object-cover"
    />
    <p
      class="absolute top-1/2 left-1/2 text-sm shadow-lg border bg-white rounded transform -translate-x-1/2 -translate-y-1/2 rounded-full h-10 w-10 flex items-center justify-center font-light"
      >VS</p
    >
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
