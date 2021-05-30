<template>
  <div>
    <div>
      <p>Email</p>
      <!-- Not sure how to give a default value -->
      <BaseInputText
        v-model="email"
        label="Email"
        name="email"
        type="text"
        disabled="true"
        :value="user.email"
        autofocus
        @keypress.enter="submit"
      />
      <p>Display Name</p>
      <div class="flex">
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
            Update
          </BaseButton>
        </div>
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
      patchUser: 'users/patchUser',
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
      this.user = await this.patchUser(formData)
      this.processingForm = false
      // show success?
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
