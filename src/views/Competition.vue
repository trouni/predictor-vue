<template>
  <div>
    <div v-if="$route.name === 'competition'">
      <BaseLink :to="{ name: 'leaderboards', params: { competitionId: id } }">
        <BaseButton>View Leaderboards</BaseButton>
      </BaseLink>

      <BaseLink :to="{ name: 'matches', query: { competitionId: id } }">
        <BaseButton>View Matches</BaseButton>
      </BaseLink>

      <BaseLink
        :to="{ name: 'new_leaderboard', params: { competitionId: id } }"
      >
        <BaseButton>New Leaderboard</BaseButton>
      </BaseLink>
    </div>

    <RouterView v-else></RouterView>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      default: null,
      required: true,
    },
  },
}
</script>

<style scoped>
a:not(:first-child) {
  margin-left: 1em;
}
</style>
