<template>
  <div>
    <h1>Leaderboard</h1>
    <p>Competition #{{ competitionId }}</p>
    <ul>
      <li v-for="leaderboard in leaderboards" :key="leaderboard.id">
        Leaderboard for {{ leaderboard.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    competitionId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      leaderboards: [],
    }
  },
}
</script>
