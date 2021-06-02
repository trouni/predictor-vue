<template>
  <div class="swiper">
    <div
      :class="[
        'swiper--status',
        {
          'choice-away': choice === 'away',
          'choice-home': choice === 'home',
          'choice-draw': choice === 'draw',
        },
      ]"
    >
      <TeamBadge
        :flag="remainingCards[0].teamHome.badgeUrl"
        class="badge home"
      />
      <PredictionChoiceDraw class="badge draw" />
      <TeamBadge
        :flag="remainingCards[0].teamAway.badgeUrl"
        class="badge away"
      />
    </div>

    <div class="swiper--cards">
      <PredictionSwiperCard
        v-for="(card, index) in remainingCards"
        :key="card.id"
        :card="card"
        :index="index"
        @remove="choice => removeCard(card.id, choice)"
        @choice="v => (choice = v)"
      />
    </div>
  </div>
</template>

<script>
import PredictionSwiperCard from '@/components/PredictionSwiperCard'
import PredictionChoiceDraw from '@/components/PredictionChoiceDraw'
import TeamBadge from '@/components/TeamBadge'

export default {
  components: { PredictionSwiperCard, TeamBadge, PredictionChoiceDraw },

  props: {
    cards: Array,
  },

  data() {
    return {
      choice: '',
    }
  },

  computed: {
    remainingCards() {
      return this.cards.filter(c => !c.removed)
    },
  },

  methods: {
    removeCard(id, choice) {
      const cardIndex = this.cards.findIndex(card => card.id === id)
      this.$set(this.cards[cardIndex], 'choice', choice)
      this.choice = choice
      this.$set(this.cards[cardIndex], 'removed', true)
      setTimeout(() => {
        this.choice = ''
      }, 1000)
    },
  },
}
</script>

<style lang="scss">
.swiper {
  // height: 100vh;
  overflow: hidden;
  display: flex;
  // flex-direction: column;
  // position: relative;
  transition: opacity 0.1s ease-in-out;
}

.swiper--status {
  position: absolute;
  top: 50%;
  left: 0;
  // margin-top: -30px;
  z-index: 2;
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  pointer-events: none;
}

.swiper--status .badge {
  // font-size: 100px;
  opacity: 0;
  transform: scale(0.3) translate(-50%, -50%);
  transition: all 0.2s ease-in-out;
  position: absolute;
  // width: 100px;
  // margin-left: -50px;
}

.choice-away .away,
.choice-home .home,
.choice-draw .draw {
  opacity: 0.7;
  transform: scale(2) translate(-50%, -50%);
}

.swiper--cards {
  flex-grow: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  z-index: 1;
}

.swiper--buttons {
  flex: 0 0 100px;
  text-align: center;
  padding-top: 20px;
}

.swiper--buttons button {
  border-radius: 50%;
  line-height: 60px;
  width: 60px;
  border: 0;
  background: #ffffff;
  display: inline-block;
  margin: 0 8px;
}

.swiper--buttons button:focus {
  outline: 0;
}

.swiper--buttons i {
  font-size: 32px;
  vertical-align: middle;
}
</style>
