<template>
  <div>
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
    <BaseLink :to="{ name: 'logout' }">
      <p>Log out <BaseIcon name="sign-out-alt" /></p>
    </BaseLink>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },

  async mounted() {
    this.fetchUser()
  },

  data() {
    return {
      name: '',
      loading: false,
      processingForm: false,
      user: null,
    }
  },

  methods: {
    ...mapActions({
      postLeaderboard: 'users/patchUser',
    }),
    async fetchUser() {
      this.loading = true
      this.user = await this.$store.dispatch('users/fetchUser', {
        userId: this.id,
      })
      this.loading = false
    },
    async submit() {
      this.processingForm = true
      const formData = {
        userId: this.user.id,
        name: this.name,
      }
      await this.patchUser(formData)
      this.processingForm = false
      this.$router.push(this.$route.query.redirectFrom || { name: 'profile' })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
p {
  color: $purple;
}
</style>
