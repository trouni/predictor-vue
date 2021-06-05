<template>
  <div class="swiper overflow-hidden flex">
    <div class="flex flex-col justify-center items-center w-full my-5">
      <div class="absolute bottom-28 text-center">
        <p class="text-gray-500 font-light text-xs">{{
          formatDateTime(currentMatch.kickoffTime)
        }}</p>
        <h2 class="mt-3 text-2xl">
          {{ currentMatch.teamHome.name }}
          <span class="font-light text-gray-500">v.</span>
          {{ currentMatch.teamAway.name }}
        </h2>
      </div>
    </div>
    <div
      class="flex-grow text-center flex justify-center fixed top-1/3 w-full left-0"
    >
      <PredictionSwiperCard
        v-for="(match, index) in matches"
        :active="index === 0"
        :key="match.id"
        :match="match"
        :index="index"
        @remove="choice => removeMatch(match, choice)"
        v-model="choice"
      />
    </div>
    <div
      v-if="statusMatch"
      :class="[
        'absolute left-0 top-16 z-10 w-full flex justify-center text-center pointer-events-none transform transition',
        choiceConfirmed ? 'opacity-100 scale-100' : 'opacity-70 scale-90',
      ]"
    >
      <PredictionSwiperStatus :match="statusMatch" :choice="choice" />
    </div>
  </div>
</template>

<script>
import PredictionSwiperCard from '@/components/PredictionSwiperCard'
import PredictionSwiperStatus from '@/components/PredictionSwiperStatus'
import { formatDateTime } from '@/utils/helpers'

export default {
  components: { PredictionSwiperCard, PredictionSwiperStatus },

  props: {
    matches: Array,
  },

  data() {
    return {
      choice: '',
      choiceConfirmed: false,
      statusMatch: null,
    }
  },

  watch: {
    currentMatch(newMatch) {
      if (!this.statusMatch) this.statusMatch = newMatch
    },
  },

  computed: {
    currentMatch() {
      if (!this.matches.length) return

      return this.matches[0]
    },
  },

  methods: {
    removeMatch(match, choice) {
      this.choiceConfirmed = true
      this.choice = choice
      setTimeout(() => {
        this.$emit('predict', { match, choice })
      }, 300)
      setTimeout(() => {
        this.choice = ''
        this.statusMatch = this.currentMatch
        this.choiceConfirmed = false
      }, 1000)
    },
    formatDateTime,
  },
}
</script>
