<template>
  <div class="predict-flow flex flex-col gap-4 w-full" style="margin: 0 auto;">

    <!-- Progress bar -->
    <div class="px-1">
      <div class="flex justify-between items-center mb-2">
        <p
          class="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
          style="color: #0cf574"
        >
          <BaseIcon name="bolt" /> Choose a Result
        </p>
        <span class="text-white text-sm font-semibold">
          {{ remainingCount }}<span class="opacity-50 font-normal"> remaining</span>
        </span>
      </div>
      <div class="h-1.5 rounded-full overflow-hidden" style="background: rgba(255,255,255,0.2)">
        <div
          class="h-full rounded-full transition-all duration-500"
          style="background: linear-gradient(90deg, #0cf574, #6690b7)"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
    </div>

    <!-- Match card with slide transition -->
    <transition :name="slideDirection" mode="out-in">
      <div
        v-if="currentMatch"
        :key="currentMatch.id"
        class="rounded-2xl text-center shadow bg-prediction-card transition duration-300 relative overflow-hidden"
        :class="localChoice ? '' : 'border-prediction-default'"
      >
        <!-- Status bar -->
        <div class="flex items-center justify-between px-4 py-2.5 bg-prediction-info">
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {{ formattedMatchDate }}
          </span>
          <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-prediction-card text-white/60">
            + {{ pointsValue }} pts
          </span>
        </div>

        <div class="flex justify-evenly items-center">
          <PredictionChoiceTeam
          class="w-1/3"
          options="h-20 w-20"
            :team="currentMatch.teamHome"
            :status="status('home')"
            :clickable="!isSaving"
            :greyOut="!!localChoice && localChoice !== 'home'"
            :chosen="localChoice === 'home'"
            @click.native="predict('home')"
          />
          <div
            v-if="currentMatch.groupId"
            class="flex flex-col my-2 items-center justify-start px-3 h-full w-1/3"
          >
            <p class="mb-1 h-8 leading-none flex items-center text-sm"></p>
            <div class="flex-grow">
              <PredictionChoiceDraw
                :status="status('draw')"
                :clickable="!isSaving"
                :greyOut="!!localChoice && localChoice !== 'draw'"
                :teamHome="currentMatch.teamHome"
                :teamAway="currentMatch.teamAway"
                :chosen="localChoice === 'draw'"
                @click.native="predict('draw')"
              />
            </div>
          </div>
          <div v-else class="flex flex-col my-2 items-center justify-center px-3 h-full w-1/3">
            <p class="text-sm font-light tracking-widest" style="color: rgba(255,255,255,0.3)">VS</p>
          </div>
          <PredictionChoiceTeam
            class="w-1/3"
            options="h-20 w-20"
            :team="currentMatch.teamAway"
            :status="status('away')"
            :clickable="!isSaving"
            :greyOut="!!localChoice && localChoice !== 'away'"
            :chosen="localChoice === 'away'"
            @click.native="predict('away')"
          />
        </div>

        <div class="flex items-center justify-center p-2 rounded-b-2xl bg-prediction-info">
          <transition name="fade" mode="out-in">
            <p v-if="isSaving" key="saving" class="text-xs text-white/70 flex items-center gap-1.5">
              <BaseIcon name="circle-notch" class="fa-spin" /> Saving...
            </p>
            <p v-else-if="localChoice" key="chosen" class="text-xs font-semibold text-green-400 flex items-center gap-1.5">
              <BaseIcon name="check-circle" /> {{ localChoiceLabel }}
            </p>
            <div v-else key="info" class="flex items-center justify-center gap-4">
              <p v-if="currentMatch.location" class="text-white/70 text-xs">
                <BaseIcon name="map-pin" class="font-bold text-white" /> {{ currentMatch.location }}
              </p>
              <p v-if="currentMatch.groupName" class="text-white/70 text-xs">
                <BaseIcon name="people-group" class="font-bold text-white" /> {{ currentMatch.groupName }}
              </p>
              <p v-if="!currentMatch.location && !currentMatch.groupName" class="text-xs text-white/40">
                Tap to make your prediction
              </p>
            </div>
          </transition>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { formatDateTime } from '@/utils/helpers'
import PredictionChoiceTeam from './PredictionChoiceTeam'
import PredictionChoiceDraw from './PredictionChoiceDraw'

export default {
  name: 'PredictCard',

  components: { PredictionChoiceTeam, PredictionChoiceDraw },

  props: {
    matches: {
      type: Array,
      required: true,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    removeOnSave: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      currentIndex: 0,
      savedChoices: {},
      isSaving: false,
      slideDirection: 'slide-next',
      initialMatchCount: 0,
      lastPredictedId: null,
    }
  },

  mounted() {
    this.initialMatchCount = this.matches.length
    this.matches.forEach(match => {
      if (match.prediction && match.prediction.choice) {
        this.$set(this.savedChoices, match.id, match.prediction.choice)
      }
    })
  },

  watch: {
    matches(newVal, oldVal) {
      const prevMatch = oldVal[this.currentIndex]
      if (!prevMatch) return
      const newIdx = newVal.findIndex(m => m.id === prevMatch.id)
      if (newIdx !== -1) {
        this.currentIndex = newIdx
      } else if (this.currentIndex >= newVal.length) {
        this.currentIndex = Math.max(0, newVal.length - 1)
      }
    },
  },

  computed: {
    currentMatch() {
      return this.matches[this.currentIndex] || null
    },
    localChoice() {
      if (!this.currentMatch) return ''
      return this.savedChoices[this.currentMatch.id] || ''
    },
    localChoiceLabel() {
      if (!this.localChoice || !this.currentMatch) return ''
      if (this.localChoice === 'draw') return 'Draw predicted'
      if (this.localChoice === 'home') return `${this.currentMatch.teamHome.name} to win`
      if (this.localChoice === 'away') return `${this.currentMatch.teamAway.name} to win`
      return ''
    },
    remainingCount() {
      return this.matches.filter(m => !this.savedChoices[m.id]).length
    },
    progressPercent() {
      if (!this.initialMatchCount) return 0
      return Math.round(
        ((this.initialMatchCount - this.remainingCount) / this.initialMatchCount) * 100
      )
    },
    pointsValue() {
      if (!this.currentMatch) return 0
      // Points = roundNumber + 2 (from Rails model)
      return (this.currentMatch.roundNumber || 0) + 2
    },
    formattedMatchDate() {
      if (!this.currentMatch) return ''
      return formatDateTime(this.currentMatch.kickoffTime)
    },
  },

  methods: {
    ...mapActions({
      setPrediction: 'matches/setPrediction',
    }),

    status(choice) {
      return this.localChoice === choice ? 'selected' : 'default'
    },

    async predict(choice) {
      if (this.isSaving) return
      if (this.localChoice === choice) return

      const match = this.currentMatch
      const matchId = match.id

      // Release the previously held prediction into the list below
      if (
        this.removeOnSave &&
        this.lastPredictedId &&
        this.lastPredictedId !== matchId
      ) {
        this.$emit('predicted', this.lastPredictedId)
      }

      this.isSaving = true
      try {
        await this.setPrediction({ match, choice })
        this.$set(this.savedChoices, matchId, choice)

        if (!this.editMode) {
          if (this.removeOnSave) this.lastPredictedId = matchId
          setTimeout(() => {
            const next = this.findNextUnpredicted()
            if (next === -1) {
              if (this.removeOnSave) {
                this.$emit('predicted', matchId)
                this.lastPredictedId = null
              } else {
                this.$emit('done')
              }
            } else if (next !== this.currentIndex) {
              this.slideDirection = 'slide-next'
              this.currentIndex = next
            }
          }, 1400)
        }
      } catch (err) {
        console.error('Failed to save prediction:', err)
      } finally {
        this.isSaving = false
      }
    },

    findNextUnpredicted() {
      // Search forward from current position first
      for (let i = this.currentIndex + 1; i < this.matches.length; i++) {
        if (!this.savedChoices[this.matches[i].id]) return i
      }
      // Then wrap around from the beginning
      for (let i = 0; i < this.currentIndex; i++) {
        if (!this.savedChoices[this.matches[i].id]) return i
      }
      return -1
    },

    formatDateTime,
  },
}
</script>

<style lang="scss" scoped>
.bg-prediction-card {
  background-color: rgba(255, 255, 255, 0.08);
}
.bg-prediction-info {
  background-color: rgba(255, 255, 255, 0.04);
}

/* Slide forward (next) — card exits downward, next enters from above */
.slide-next-enter-active,
.slide-next-leave-active {
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-next-enter {
  opacity: 0;
  transform: translateY(-28px);
}
.slide-next-leave-to {
  opacity: 0;
  transform: translateY(28px);
}

/* Slide backward (prev) — card exits upward, next enters from below */
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-prev-enter {
  opacity: 0;
  transform: translateY(28px);
}
.slide-prev-leave-to {
  opacity: 0;
  transform: translateY(-28px);
}

/* Fade for status footer */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>
