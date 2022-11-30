<template>
  <div ref="snapContainer" class="flex snap-container h-full">
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
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },

  mounted() {
    var observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting === true) {
          this.$emit('change-item', entries[0].target.dataset.itemIdx)
        }
      },
      {
        root: this.$refs.snapContainer,
        threshold: [1],
      }
    )

    this.$refs.items.forEach(i => observer.observe(i))
  },

  methods: {
    goToPage(pageIdx) {
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
