<template>
  <transition name="fade-blur">
    <div
      v-if="showTutorial && isTouchDevice"
      @click="hideTutorial"
      @touchstart="hideTutorial"
      class="fixed md:absolute w-full h-full bg-black/70 z-[60] top-0 left-0 pb-20 backdrop-blur-[2px]"
    >
      <AnimatedArrow
        v-if="arrows.left"
        left
        class="left-0 text-lg absolute top-1/2 md:top-[40%] -translate-y-full z-50"
        :text="arrows.left"
        color="white"
      />
      <AnimatedArrow
        v-if="arrows.right"
        right
        class="right-0 text-lg absolute top-1/2 md:top-[40%] translate-y-1/2 z-50"
        :text="arrows.right"
        color="white"
      />
      <AnimatedArrow
        v-if="arrows.up"
        up
        class="left-1/2 text-lg absolute top-10 translate-y-full -translate-x-1/2 z-50"
        :text="arrows.up"
        color="white"
      />
      <AnimatedArrow
        v-if="arrows.down"
        down
        class="left-1/2 text-lg absolute bottom-10 -translate-y-full -translate-x-1/2 z-50"
        :text="arrows.down"
        color="white"
      />
    </div>
  </transition>
</template>

<script>
import AnimatedArrow from '@/components/AnimatedArrow.vue'
import { capitalize, saveState, getSavedState } from '@/utils/helpers'

export default {
  components: { AnimatedArrow },

  props: {
    saveState: {
      type: Boolean,
      required: false,
      default: true,
    },
    arrows: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  data() {
    return {
      showTutorial: false,
    }
  },

  mounted() {
    setTimeout(() => {
      this.showTutorial = !getSavedState(`watched${capitalize(this.$route.name)}Tutorial`)
    }, 500)
  },

  methods: {
    hideTutorial() {
      this.showTutorial = false
      if (this.saveState) {
        saveState(`watched${capitalize(this.$route.name)}Tutorial`, new Date())
      }
    },
    isTouchDevice() {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';

.fade-blur-enter,
.fade-blur-leave-to {
  opacity: 0;
  backdrop-filter: blur(0);
  transition: opacity 0.5s ease, backdrop-filter 0.5s ease;
}

.fade-blur-leave-active,
.fade-blur-enter-active {
  transition: opacity 0.5s ease, backdrop-filter 0.5s ease;
}
</style>
