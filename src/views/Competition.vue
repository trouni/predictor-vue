<template>
  <div>
    <h1>Competition #{{ id }}</h1>

    <div v-if="$route.name === 'competition'">
      <BaseLink :to="{ name: 'leagues', params: { competitionId: id } }">
        <BaseButton>View Leagues</BaseButton>
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
