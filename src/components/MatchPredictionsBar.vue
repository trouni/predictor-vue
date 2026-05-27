<template>
  <div class="w-full h-5 rounded-full overflow-hidden flex border border-gray-200">

    <!-- Home -->
    <div
      class="h-full flex items-center justify-center text-xs font-semibold transition-all duration-700 overflow-hidden"
      :style="{
        width: percentageHomeWin,
        minWidth: hasPicks('home') ? '2.5rem' : '0',
        background: result === 'home' ? '#84CC16' : '#f3f4f6',
        color: result === 'home' ? 'white' : '#9ca3af',
      }"
    >
      <span v-if="hasPicks('home')">{{ percentageHomeWin }}</span>
    </div>

    <!-- Draw (group stage only) -->
    <div
      v-if="match.groupId"
      class="h-full flex items-center justify-center text-xs font-semibold transition-all duration-700 overflow-hidden border-x border-gray-200"
      :style="{
        width: percentageDraw,
        minWidth: hasPicks('draw') ? '2.5rem' : '0',
        background: result === 'draw' ? '#84CC16' : '#f3f4f6',
        color: result === 'draw' ? 'white' : '#9ca3af',
      }"
    >
      <span v-if="hasPicks('draw')">{{ percentageDraw }}</span>
    </div>

    <!-- Away — fills remaining space via flex-1 -->
    <div
      class="flex-1 h-full flex items-center justify-center text-xs font-semibold transition-all duration-700 overflow-hidden"
      :style="{
        minWidth: hasPicks('away') ? '2.5rem' : '0',
        background: result === 'away' ? '#84CC16' : '#f3f4f6',
        color: result === 'away' ? 'white' : '#9ca3af',
      }"
    >
      <span v-if="hasPicks('away')">{{ percentageAwayWin }}</span>
    </div>

  </div>
</template>

<script>
export default {
  name: 'MatchPredictionsBar',

  props: {
    match: {
      type: Object,
      required: true,
    },
    predictions: {
      type: Object,
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
  },

  computed: {
    total() {
      return Object.keys(this.predictions).reduce(
        (acc, key) => acc + (this.predictions[key]?.length || 0),
        0
      )
    },
    percentageHomeWin() {
      return this.pct('home')
    },
    percentageAwayWin() {
      return this.pct('away')
    },
    percentageDraw() {
      return this.pct('draw')
    },
  },

  methods: {
    hasPicks(column) {
      return this.predictions[column] && this.predictions[column].length > 0
    },
    pct(column) {
      if (!this.hasPicks(column) || this.total === 0) return '0%'
      return `${Math.round((this.predictions[column].length / this.total) * 100)}%`
    },
  },
}
</script>
