<template>
  <div>
    <ul>
      <li>
        <p
          >{{ match.id }}: {{ match.teamHome.name }} vs
          {{ match.teamAway.name }}
          <small>
            ({{ new Date(match.kickoffTime).toLocaleDateString() }})
          </small>
        </p>
        <p>{{
          match.status === 'finished'
            ? `${match.teamHome.score} : ${match.teamAway.score}`
            : match.status
        }}</p>
        <p v-if="match.prediction">{{ match.prediction }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    match: {
      type: Object,
      required: true,
    },
  },

  methods: {
    async setPrediction(choice) {
      this.loading = true
      this.matches = await this.$store.dispatch(`matches/setPrediction`, {
        match: this.match,
        choice,
      })
      this.loading = false
    },
  },
}
</script>
