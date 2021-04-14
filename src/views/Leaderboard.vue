<template>
  <div>
    <h1>Leaderboard</h1>
    <p>Competition #{{ competitionId }}</p>
    <ul>
      <li v-for="league in leagues" :key="league.id">
        Leaderboard for {{ league.name }}
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
      leagues: [
        {
          id: 1,
          name: 'Admin League',
        },
        {
          id: 2,
          name: 'Other League',
        },
      ],
    }
  },
}
</script>
