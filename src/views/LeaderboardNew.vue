<template>
  <div>
    <h1>Create Leaderboard for Competition #{{ competitionId }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    competitionId: {
      type: Number,
      default: null,
      required: true,
    },
  },
}
</script>
