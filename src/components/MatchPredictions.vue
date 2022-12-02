<template>
  <div>
    <div class="text-center">
      <div
        ref="predictionsBar"
        class="w-full h-6 rounded-md border-gray-300 border mt-5 flex overflow-hidden"
      >
        <div v-if="hasHomeWinPredictions" ref="teamHome" class="if-home h-full">
          <div
            class="text-sm text-glow font-semibold text-gray-600 w-full h-full flex items-center justify-center"
          >
            {{ percentageHomeWin }}
          </div>
        </div>
        <div
          ref="draw"
          v-if="hasDrawPredictions"
          class="h-full bg-gray-100 flex-auto"
        >
          <div
            class="text-sm text-glow font-semibold text-gray-600 w-full h-full flex items-center justify-center uppercase"
          >
            {{ percentageDraw }}
          </div>
        </div>
        <div
          ref="teamAway"
          v-if="hasAwayWinPredictions"
          class="h-full flex-auto"
        >
          <div
            class="text-sm text-glow font-semibold text-gray-600 w-full h-full flex items-center justify-center"
          >
            {{ percentageAwayWin }}
          </div>
        </div>
      </div>
      <div ref="numbersRow" class="w-full min-h-6 flex mt-1">
        <div
          v-if="hasHomeWinPredictions"
          ref="teamHomeText"
          class="uppercase text-gray-600 truncate flex flex-col"
        >
          <span class="text-md mb-2"> {{ teamHomeName }}</span>
          <div
            v-for="user in predictions['home']"
            :key="user.userId"
            class="text-xs md:text-sm truncate"
          >
            {{ user.name }}
          </div>
        </div>
        <div
          v-if="hasDrawPredictions"
          ref="drawText"
          class="uppercase text-md text-gray-600 truncate flex flex-col"
        >
          <span class="text-md mb-2"> DRAW</span>
          <div
            v-for="user in predictions['draw']"
            :key="user.userId"
            class="text-xs md:text-sm truncate"
          >
            {{ user.name }}
          </div></div
        >
        <div
          v-if="hasAwayWinPredictions"
          ref="teamAwayText"
          class="uppercase text-md text-gray-600 text-center truncate flex flex-col"
        >
          <span class="text-md mb-2"> {{ teamAwayName }}</span>
          <div
            v-for="user in predictions['away']"
            :key="user.userId"
            class="text-xs md:text-sm truncate"
          >
            {{ user.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    match: {
      type: Object,
      required: true,
    },
    predictions: {
      type: Object,
      required: false,
    },
  },

  mounted() {
    if (this.$refs.teamHome) {
      this.$refs.teamHome.style.width = this.percentageHomeWin
      this.$refs.teamHome.style.backgroundColor = this.getColorFromTeamName(
        this.match.teamHome.name
      )
      this.$refs.teamHomeText.style.width = this.percentageHomeWin
    }
    if (this.$refs.draw) {
      this.$refs.draw.style.width = this.percentageDraw
      this.$refs.drawText.style.width = this.percentageDraw
    }
    if (this.$refs.teamAway) {
      this.$refs.teamAway.style.width = this.percentageAwayWin
      this.$refs.teamAway.style.backgroundColor = this.getColorFromTeamName(
        this.match.teamAway.name
      )
      this.$refs.teamAwayText.style.width = this.percentageAwayWin
    }
  },

  data() {
    return {
      colors: {
        argentina: '#4185F4',
        australia: '#ffbb00',
        belgium: '#FF7048',
        brazil: '#018100',
        canada: '#c5281c',
        cameroon: '#044C40',
        costa_rica: '#E91114',
        croatia: '#A90000',
        denmark: '#e32219',
        ecuador: '#ffef00',
        england: '#2b57ac',
        france: '#123163',
        germany: '#000000',
        ghana: '#D30024',
        iran: '#E11C23',
        japan: '#000080',
        mexico: '#03a154',
        morocco: '#17A376',
        netherlands: '#FE6702',
        poland: '#FF0001',
        portugal: '#ff0000',
        qatar: '#7E0000',
        saudi_arabia: '#003A11',
        senegal: '#106144',
        serbia: '#ff000d',
        south_korea: '#ffffff',
        spain: '#ff0000',
        switzerland: '#E00201',
        tunisia: '#E50112',
        uruguay: '#55b5e5',
        usa: '#002bbe',
        wales: '#ff0000',
      },
    }
  },

  methods: {
    getColorFromTeamName(team) {
      return this.colors[team.toLowerCase().replace(' ', '_')]
    },
    calculatePercentage(numOfPredictions) {
      return Math.round(
        (numOfPredictions / this.totalNumberOfUserPredictions) * 100
      )
    },
  },

  computed: {
    totalNumberOfUserPredictions() {
      return Object.keys(this.predictions).reduce((acc, key) => {
        return acc + this.predictions[key].length
      }, 0)
    },
    percentageHomeWin() {
      if (!this.hasHomeWinPredictions) return 0
      return `${this.calculatePercentage(this.predictions.home.length)}%`
    },
    percentageAwayWin() {
      if (!this.hasAwayWinPredictions) return 0
      return `${this.calculatePercentage(this.predictions.away.length)}%`
    },
    percentageDraw() {
      if (!this.hasDrawPredictions) return 0
      return `${this.calculatePercentage(this.predictions.draw.length)}%`
    },
    hasDrawPredictions() {
      return Object.keys(this.predictions).includes('draw')
    },
    hasHomeWinPredictions() {
      return Object.keys(this.predictions).includes('home')
    },
    hasAwayWinPredictions() {
      return Object.keys(this.predictions).includes('away')
    },
    teamHomeName() {
      return this.percentageHomeWin.slice(0, -1) < 20
        ? this.match.teamHome.abbrev
        : this.match.teamHome.name
    },
    teamAwayName() {
      return this.percentageAwayWin.slice(0, -1) < 20
        ? this.match.teamAway.abbrev
        : this.match.teamAway.name
    },
  },
}
</script>
