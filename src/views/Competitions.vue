<template>
  <div>
    <h1>Competitions</h1>
    <ul>
      <li v-for="competition in competitions" :key="competition.id">
        <BaseLink
          :to="{ name: 'competition', params: { id: competition.id } }"
          >{{ competition.name }}</BaseLink
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      competitions: [
        {
          id: 1,
          name: 'Euro 2020',
        },
        {
          id: 2,
          name: 'World Cup 2022',
        },
      ],
    }
  },
}
</script>
