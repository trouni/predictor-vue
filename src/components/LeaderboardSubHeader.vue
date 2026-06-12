<template>
  <div v-if="leaderboards.length" class="mt-2">
    <div class="flex items-stretch">
      <!-- Left arrow: only rendered when there's overflow -->
      <button
        v-if="hasOverflow"
        @click="scroll(-140)"
        :disabled="!canScrollLeft"
        class="scroll-arrow pl-5 pr-2"
        aria-label="Scroll left"
      >
        <BaseIcon name="angle-left" />
      </button>

      <!-- Tab strip -->
      <div
        ref="scrollEl"
        class="flex flex-1 overflow-x-auto hide-scrollbar gap-1"
        :class="hasOverflow ? 'px-2' : 'px-5'"
        @scroll="checkScroll"
      >
        <button
          v-for="lb in leaderboards"
          :key="lb.id"
          :ref="isActive(lb.id) ? 'activeTab' : null"
          @click="selectLeaderboard(lb.id)"
          class="flex-shrink-0 text-sm pt-0.5 md:mr-1 pb-3 px-2 border-b-2 whitespace-nowrap transition-all duration-150 focus:outline-none"
          :style="
            isActive(lb.id)
              ? 'border-color: #fa5151; color: white; font-weight: 600'
              : 'border-color: transparent; color: rgba(255,255,255,0.38)'
          "
        >
          {{ lb.name }}
        </button>

        <!-- ＋ New leaderboard pill at the far end -->
        <BaseLink
          :to="{ name: 'new_leaderboard' }"
          class="flex-shrink-0 flex items-center gap-1 self-start px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80 whitespace-nowrap"
          style="
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.45);
          "
        >
          <BaseIcon name="plus" style="font-size: 0.6rem" />
          New Board
        </BaseLink>
      </div>

      <!-- Right arrow: only rendered when there's overflow -->
      <button
        v-if="hasOverflow"
        @click="scroll(140)"
        :disabled="!canScrollRight"
        class="scroll-arrow pl-2 pr-5"
        aria-label="Scroll right"
      >
        <BaseIcon name="angle-right" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LeaderboardSubHeader',

  data() {
    return {
      hasOverflow: false,
      canScrollLeft: false,
      canScrollRight: false,
    }
  },

  computed: {
    ...mapGetters({
      leaderboards: 'leaderboards/leaderboards',
      currentLeaderboard: 'leaderboards/currentLeaderboard',
    }),
  },

  watch: {
    currentLeaderboard() {
      this.$nextTick(this.scrollToActive)
    },
    leaderboards() {
      this.$nextTick(() => {
        this.checkScroll()
        if (this.$refs.scrollEl) this._ro.observe(this.$refs.scrollEl)
      })
    },
  },

  mounted() {
    this._ro = new ResizeObserver(this.checkScroll)
    this.$nextTick(() => {
      this.checkScroll()
      this.scrollToActive()
      if (this.$refs.scrollEl) this._ro.observe(this.$refs.scrollEl)
    })
  },

  beforeUnmount() {
    this._ro?.disconnect()
  },

  methods: {
    ...mapActions({
      selectLeaderboard: 'leaderboards/selectLeaderboard',
    }),

    isActive(id) {
      return this.currentLeaderboard && this.currentLeaderboard.id === id
    },

    checkScroll() {
      const el = this.$refs.scrollEl
      if (!el) return
      this.hasOverflow = el.scrollWidth > el.clientWidth + 2
      this.canScrollLeft = el.scrollLeft > 2
      this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 2
    },

    scroll(amount) {
      this.$refs.scrollEl?.scrollBy({ left: amount, behavior: 'smooth' })
    },

    scrollToActive() {
      const tabs = this.$refs.activeTab
      const tab = Array.isArray(tabs) ? tabs[0] : tabs
      if (!tab) return
      tab.scrollIntoView({
        inline: 'nearest',
        behavior: 'smooth',
        block: 'nearest',
      })
    },
  },
}
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.scroll-arrow {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.15s, opacity 0.15s;
  padding-bottom: 12px;
}
.scroll-arrow:hover:not(:disabled) {
  color: white;
}
.scroll-arrow:disabled {
  opacity: 0.25;
  cursor: default;
}
</style>
