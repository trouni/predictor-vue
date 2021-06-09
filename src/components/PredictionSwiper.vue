<template>
  <div class="swiper overflow-hidden flex">
    <div class="flex flex-col justify-center items-center w-full my-5">
      <div class="absolute top-16 text-center">
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
        ref="card"
        :key="match.id"
        :active="match.id === currentMatch.id"
        :match="match"
        :index="index"
        @submit="confirmChoice"
        v-model="choice"
      />
    </div>
    <div
      v-if="currentMatch"
      class="flex flex-col items-center justify-center absolute top-1/3 left-1/2 transform -translate-x-1/2 w-full"
    >
      <PredictionSwiperStatus
        :match="currentMatch"
        :choice="choice"
        :class="[
          'pointer-events-none transform transition',
          needsConfirmation ? 'opacity-100 scale-100' : 'opacity-70 scale-90',
        ]"
      />
      <transition>
        <div v-if="needsConfirmation" class="mt-16 w-full text-center">
          <h4 class="text-xl mb-3">Confirm your prediction?</h4>
          <div class="flex justify-evenly w-full items-center z-50">
            <UndoButton @click="undoChoice" class="z-50" />
            <ConfirmButton @click="submitPrediction" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import UndoButton from '@/components/UndoButton'
import ConfirmButton from '@/components/ConfirmButton'
import PredictionSwiperCard from '@/components/PredictionSwiperCard'
import PredictionSwiperStatus from '@/components/PredictionSwiperStatus'
import { formatDateTime } from '@/utils/helpers'
import { mapActions } from 'vuex'

export default {
  components: {
    PredictionSwiperCard,
    PredictionSwiperStatus,
    UndoButton,
    ConfirmButton,
  },

  props: {
    matches: Array,
  },

  data() {
    return {
      choice: '',
      needsConfirmation: false,
    }
  },

  computed: {
    currentMatch() {
      if (!this.matches.length) return

      return this.matches[0]
    },
  },

  methods: {
    ...mapActions({
      fetchMatches: 'matches/fetchMatches',
      setPrediction: 'matches/setPrediction',
    }),
    resetSwiper() {
      this.needsConfirmation = false
      this.choice = ''
      this.$refs.card[0].resetCard()
    },
    confirmChoice(choice) {
      this.needsConfirmation = true
      this.choice = choice
    },
    undoChoice() {
      console.log('undo')
      this.resetSwiper()
    },
    async submitPrediction() {
      try {
        await this.setPrediction({
          match: this.currentMatch,
          choice: this.choice,
        })
      } catch {
        this.fetchMatches()
      } finally {
        this.resetSwiper()
      }
    },
    formatDateTime,
  },
}
</script>
