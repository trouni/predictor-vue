<template>
  <div ref="snapContainer" class="flex w-screen snap-container">
    <div
      v-for="(item, index) in items"
      class="min-w-[100vw] w-screen p-4 snap-section"
      :key="index"
      ref="items"
      :data-item-idx="index"
    >
      <slot name="item" :item="item">
        {{ item.id }}
      </slot>
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
    // var observer = new IntersectionObserver(
    //   entries => {
    //     if (entries[0].isIntersecting === true) {
    //       this.$emit('change-item', entries[0].target.dataset.itemIdx)
    //     }
    //   },
    //   {
    //     root: this.$refs.snapContainer,
    //     threshold: [0.9],
    //   }
    // )

    // this.$refs.items.forEach(i => observer.observe(i))
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
</style>
