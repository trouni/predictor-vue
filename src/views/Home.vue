<template>
  <div class="home-wrapper">
    <TopNav />
    <main>
      <div class="banner">
        <div class="banner-container">
          <h1>Octacle</h1>
          <p>Join. Predict. Win.</p>
          <div class="xs:mt-3 sm:mt-7">
            <BaseButton>
              <BaseLink
                :to="{ path: '/matches' }"
                v-if="$store.getters['auth/loggedIn']"
              >
                Matches
              </BaseLink>
              <BaseLink :to="{ name: 'login' }" v-else> Get Started </BaseLink>
            </BaseButton>
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
import TopNav from '@/components/TopNav'

export default {
  components: { FooterNav, HomeStep, TopNav },
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
        title: 'Join a League',
        description: 'Join friends and compete for the highest score.',
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
.home-wrapper {
  background: linear-gradient(167.4deg, #3e3b7d 0%, #6690b7 88.73%);
}

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
  line-height: 1em;
}

.banner p {
  font-size: 20px;
  color: white;
  opacity: 0.8;
  margin: ($spacer * 1.5) 0;
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

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) {
  .steps {
    flex-direction: row;
    justify-content: space-around;
    padding: ($spacer * 8) 0 ($spacer * 8) 0;
  }
  .banner {
    padding: 150px 0;
    h1 {
      font-size: 5em;
    }
    p {
      font-size: 2em;
    }
  }
  .banner-container {
    padding-right: $spacer * 10;
    padding-left: $spacer * 10;
    width: 100%;
  }
}
</style>
