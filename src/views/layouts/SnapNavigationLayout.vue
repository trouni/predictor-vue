<template>
  <div ref="snapContainer" class="flex snap-container h-full">
    <transition>
      <div
        v-if="showTutorial"
        @click="hideTutorial"
        class="fixed w-full h-full bg-black/50 z-40"
      >
        <AnimatedArrow
          :left="!!previousItem"
          :right="!!nextItem"
          class="text-xl fixed top-1/2 -translate-y-1/2 z-50 uppercase"
          :class="{
            'left-0': previousItem,
            'right-0': nextItem,
          }"
          text="Swipe Next"
          color="white"
        />
      </div>
    </transition>
    <div
      v-for="(item, index) in items"
      class="snap-section min-w-[100%]"
      :key="index"
      ref="items"
      :data-item-idx="index"
    >
      <div class="h-full overflow-hidden">
        <div class="hide-scrollbar h-full overflow-y-scroll p-4">
          <slot name="item" :item="item">
            {{ item.id }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AnimatedArrow from '@/components/AnimatedArrow.vue'
import { saveState, getSavedState } from '@/utils/helpers'

export default {
  components: { AnimatedArrow },

  props: {
    items: {
      type: Array,
      required: true,
    },
    watchedTutorialStateKey: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      currentItem: this.items[0],
      showTutorial:
        this.items.length > 0 && (!this.watchedTutorialStateKey || !getSavedState(this.watchedTutorialStateKey)),
    }
  },

  mounted() {
    var observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting === true) {
          const index = entries[0].target.dataset.itemIdx
          this.currentItem = this.items[index]
          this.$emit('change-item', index)
        }
      },
      {
        root: this.$refs.snapContainer,
        threshold: [1],
      }
    )

    this.$refs.items.forEach(i => observer.observe(i))
  },

  computed: {
    previousItem() {
      return this.items[this.items.indexOf(this.currentItem) - 1]
    },
    nextItem() {
      return this.items[this.items.indexOf(this.currentItem) + 1]
    },
  },

  methods: {
    goToPage(pageIdx) {
      this.currentItem = this.items[pageIdx]
      this.$refs.items[pageIdx].scrollIntoView()
    },
    hideTutorial() {
      this.showTutorial = false
      if (this.watchedTutorialStateKey) {
        saveState(this.watchedTutorialStateKey, true)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.snap-container {
  overflow: scroll;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
}

.snap-section {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar { /* Chrome, Safari and Opera */
    display: none;
  }
}
</style>
