<template>
  <div>
    <p>Name</p>
    <BaseInputText
      v-model="name"
      label="Name"
      name="name"
      type="text"
      autofocus
      @keypress.enter="submit"
    />
    <div>
      <BaseButton :disabled="processingForm" @click="submit">
        Create
      </BaseButton>
    </div>
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
  data() {
    return {
      name: '',
      processingForm: false,
      leaderboardId: null,
    }
  },
  methods: {
    async submit() {
      this.processingForm = true
      const formData = {
        competitionId: this.competitionId,
        name: this.name,
      }
      this.leaderboardId = await this.$store.dispatch(
        'leaderboards/postLeaderboard',
        formData
      )
      this.processingForm = false
      this.$router.push(
        this.$route.query.redirectFrom || { name: 'leaderboards' }
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
h3 {
  text-align: center;
}
p {
  color: $purple;
}
</style>
