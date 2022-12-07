<template>
  <div class="flex flex-col px-1">
    <div class="flex justify-between">
      <div :class="match.groupId ? 'w-1/3' : 'w-1/2'">
        <BaseLink
          v-for="user in predictions['home']"
          :to="{ name: 'predictions', query: { userId: user.userId } }"
          :key="user.userId"
        >
          <span
            :class="[
              'inline-block mx-1 my-0.5 px-2 py-1.5 leading-3 rounded-full border truncate max-w-[100px] sm:max-w-[200px] overflow-hidden whitespace-nowrap	',
              currentUserId === user.userId
                ? currentUserPillColor('home')
                : pillColor('home'),
            ]"
          >
            {{ user.name }}
          </span>
        </BaseLink>
        <div v-if="!hasPredictions('home')" class="px-2"> No Predictions </div>
      </div>
      <div v-if="match.groupId" class="w-1/3">
        <span
          v-for="user in predictions['draw']"
          :key="user.userId"
          :class="[
            'inline-block mx-1 my-0.5 px-2 py-1.5 leading-3 rounded-full border truncate max-w-[100px] sm:max-w-[200px] overflow-hidden whitespace-nowrap	',
            currentUserId === user.userId
              ? currentUserPillColor('draw')
              : pillColor('draw'),
            ,
          ]"
        >
          {{ user.name }}
        </span>
        <div v-if="!hasPredictions('draw')" class="px-2"> No Predictions </div>
      </div>
      <div :class="match.groupId ? 'w-1/3' : 'w-1/2'">
        <span
          v-for="user in predictions['away']"
          :key="user.userId"
          :class="[
            'inline-block mx-1 my-0.5 px-2 py-1.5 leading-3 rounded-full border truncate max-w-[100px] sm:max-w-[200px] overflow-hidden whitespace-nowrap	',
            currentUserId === user.userId
              ? currentUserPillColor('away')
              : pillColor('away'),
          ]"
        >
          {{ user.name }}
        </span>
        <div v-if="!hasPredictions('away')" class="px-2"> No Predictions </div>
      </div>
    </div>
    <div class="my-4">
      <MatchPredictionsBar
        :predictions="predictions"
        :result="result"
        :match="match"
      />
    </div>
  </div>
</template>

<script>
import MatchPredictionsBar from '@/components/MatchPredictionsBar'
export default {
  components: {
    MatchPredictionsBar,
  },

  props: {
    match: {
      type: Object,
      required: true,
    },
    predictions: {
      type: Object,
      required: false,
    },
    result: {
      type: String,
      required: true,
    },
    currentUserId: {
      type: Number,
      required: true,
    },
  },

  methods: {
    pillColor(column) {
      if (
        (column === 'draw' && this.result === 'draw') ||
        (column == 'away' && this.result === 'away') ||
        (column == 'home' && this.result === 'home')
      ) {
        return 'text-prediction-correct border-prediction-correct'
      } else {
        return 'text-gray-500 border-gray-400 bg-gray-50'
      }
    },
    currentUserPillColor(column) {
      if (this.match.status === 'started') {
        return 'text-white border-gray-400 bg-gray-400 font-semibold shadow-md'
      } else if (
        (column === 'draw' && this.result === 'draw') ||
        (column == 'away' && this.result === 'away') ||
        (column == 'home' && this.result === 'home')
      ) {
        return 'text-white border-prediction-correct bg-prediction-correct font-semibold shadow-md'
      } else {
        return 'text-white border-prediction-wrong bg-prediction-wrong font-semibold shadow-md'
      }
    },

    hasPredictions(column) {
      return Object.keys(this.predictions).includes(column)
    },
  },
}
</script>
