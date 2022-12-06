<template>
  <div ref="snapContainer" class="flex snap-container h-full relative">
    <SwipeTutorial
      v-if="previousItem || nextItem"
      :arrows="{
        left: !!previousItem ? `Swipe for previous leaderboard<br><strong>${previousItem.name}</strong>` : null,
        right: !!nextItem ? `Swipe for next leaderboard<br><strong>${nextItem.name}</strong>` : null,
      }"
    />
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
import SwipeTutorial from '@/components/SwipeTutorial.vue'

export default {
  components: { SwipeTutorial },

  props: {
    items: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      pageIdx: 0,
    }
  },

  watch: {
    pageIdx: {
      handler(newIdx) {
        this.$emit('change-item', newIdx)
      },
      immediate: true,
    },
  },

  mounted() {
    var observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          this.pageIdx = parseInt(entries[0].target.dataset.itemIdx)
        }
      },
      {
        root: this.$refs.snapContainer,
        threshold: [0.95],
      }
    )

    this.$refs.items.forEach(i => observer.observe(i))
  },

  computed: {
    currentItem() {
      return this.items[this.pageIdx]
    },
    previousItem() {
      return this.items[this.items.indexOf(this.currentItem) - 1]
    },
    nextItem() {
      return this.items[this.items.indexOf(this.currentItem) + 1]
    },
  },

  methods: {
    goToPage(pageIdx) {
      this.pageIdx = pageIdx
      this.$refs.items[pageIdx].scrollIntoView()
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
