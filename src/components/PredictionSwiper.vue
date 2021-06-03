<template>
  <div class="swiper overflow-hidden flex">
    <div class="flex flex-col justify-center items-center w-full my-5">
      <p class="text-gray-500 font-light text-xs">{{
        formatDateTime(currentMatch.kickoffTime)
      }}</p>
      <h2 class="mt-3 text-2xl text-center">
        {{ currentMatch.teamHome.name }}
        <span class="font-light text-gray-500">v.</span>
        {{ currentMatch.teamAway.name }}
      </h2>
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
        @remove="choice => removeMatch(match.id, choice)"
        v-model="choice"
      />
    </div>
    <div
      v-if="statusMatch"
      class="absolute left-0 bottom-0 z-10 mb-16 w-full flex justify-center text-center pointer-events-none"
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
      statusMatch: null,
    }
  },

  watch: {
    currentMatch(newMatch) {
      if (!newMatch) this.$router.push({ path: '/matches' })
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
    removeMatch(matchId, choice) {
      this.choice = choice
      setTimeout(() => {
        this.$emit('predict', { matchId, choice })
      }, 300)
      setTimeout(() => {
        this.choice = ''
        this.statusMatch = this.currentMatch
      }, 1000)
    },
    formatDateTime,
  },
}
</script>
