<template>
  <div class="p-4">
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
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      name: '',
      processingForm: false,
      leaderboardId: null,
    }
  },
  mounted() {
    this.$emit('init')
  },
  methods: {
    ...mapActions({
      postLeaderboard: 'leaderboards/postLeaderboard',
    }),
    async submit() {
      this.processingForm = true
      const formData = {
        name: this.name,
      }
      await this.postLeaderboard(formData)
      this.processingForm = false
      this.$router.push(
        this.$route.query.redirectFrom || { name: 'rankings' }
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
