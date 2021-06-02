<template>
  <div
    class="bg-white rounded-2xl absolute duration-500 overflow-hidden cursor-grab flex flex-col m-5 border-6 border-white shadow-2xl"
    :style="style"
  >
    <img
      src="https://raw.githubusercontent.com/joielechong/iso-country-flags-svg-collection/master/svg/country-4x3/us.svg"
      class="pointer-events-none w-full h-1/2 object-cover team-home"
    />
    <img
      src="https://raw.githubusercontent.com/joielechong/iso-country-flags-svg-collection/master/svg/country-4x3/cn.svg"
      class="pointer-events-none w-full h-1/2 object-cover team-away"
    />
  </div>
</template>

<script>
import Hammer from 'hammerjs'

export default {
  props: {
    card: Object,
    index: Number,
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
    style() {
      return {
        zIndex: 100 - this.index,
        transform: `translate(${this.deltaX}px, ${this.deltaY}px)
                    rotate(${this.rotation}deg)
                    scale(${(20 - this.index) / 20})
                    translateY(-${15 * this.index}px)`,
        opacity: (10 - this.index) / 10,
        'transition-property': this.moving ? 'none' : 'all',
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
      else if (this.deltaY > Math.abs(this.deltaX)) choice = 'draw'
      else if (this.deltaX > this.submitThreshold * 0.7) choice = 'away'
      else if (this.deltaX < -this.submitThreshold * 0.7) choice = 'home'
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
      this.moving = true
      this.deltaX = e.deltaX
      this.deltaY = e.deltaY

      this.$emit('choice', this.choice)
    },
    dropCard(e) {
      this.moving = false
      if (
        Math.abs(e.deltaY) < this.submitThreshold &&
        Math.abs(e.deltaX) < this.submitThreshold
      ) {
        this.deltaX = 0
        this.deltaY = 0
        this.$emit('choice', '')
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
img.team-home {
  // clip-path: polygon(0 0, 0 100%, 100% calc(100% - 1rem), 100% 0);
}

img.team-away {
  // clip-path: polygon(0 1rem, 0 100%, 100% 100%, 100% 0);
}

.moving {
  cursor: grabbing;
  transition: none;
}
</style>
