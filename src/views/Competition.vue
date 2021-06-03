<template>
  <div>
    <div v-if="$route.name === 'competition'">
      <BaseLink :to="{ name: 'leaderboards' }">
        <BaseButton>View Leaderboards</BaseButton>
      </BaseLink>

      <BaseLink :to="{ name: 'matches' }">
        <BaseButton>View Matches</BaseButton>
      </BaseLink>

      <BaseLink :to="{ name: 'new_leaderboard' }">
        <BaseButton>New Leaderboard</BaseButton>
      </BaseLink>
    </div>

    <RouterView v-else></RouterView>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
a:not(:first-child) {
  margin-left: 1em;
}
</style>
