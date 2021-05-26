<template>
  <div>
    <main>
      <div class="banner">
        <div class="banner-container">
          <h1>Predictor App</h1>
          <p>Join. Predict. Win.</p>
          <div class="mt-3">
            <BaseButton> Get Started </BaseButton>
          </div>
        </div>
      </div>
      <div class="steps">
        <HomeStep v-for="(step, index) in steps" :key="index" :step="step" />
      </div>
    </main>
    <FooterNav />
  </div>
</template>

<script>
import FooterNav from '@/components/FooterNav'
import HomeStep from '@/components/HomeStep'

export default {
  components: { FooterNav, HomeStep },
  data() {
    return {
      steps: [],
    }
  },
  created() {
    this.steps = [
      {
        title: 'Predict a Game',
        description: 'Choose the right results for all of the games.',
        img: `${require('../assets/football.png')}`,
      },
      {
        title: 'Create/Join a League',
        description: 'Join in with friends and compete for the highest score.',
        img: `${require('../assets/player.png')}`,
      },
      {
        title: 'Come Out on Top',
        description: 'Compete against all users in the overall leaderboard.',
        img: `${require('../assets/trophy.png')}`,
      },
    ]
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.banner {
  background-size: cover;
  background-position: center;
  padding: 80px 0;
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url('~@/assets/crowd.jpg');
}

.banner h1 {
  margin: $spacer 0;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  font-size: 32px;
  font-weight: bold;
}

.banner p {
  font-size: 20px;
  color: white;
  opacity: 0.8;
  margin: $spacer 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}
.banner-container {
  padding-right: $spacer * 2;
  padding-left: $spacer * 2;
  margin-right: auto;
  margin-left: auto;
  width: 100%;
}
.steps {
  background: linear-gradient(167.4deg, #3e3b7d 0%, #6690b7 88.73%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ($spacer * 2) 0 ($spacer * 10) 0;
}
</style>
