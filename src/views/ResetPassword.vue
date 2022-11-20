<template>
  <div class="flex flex-col justify-center items-center">
    <div class="w-full md:w-6/12">
      <div>
        <p>New password</p>
        <BaseInputText
          v-model="password"
          label="Password"
          name="password"
          type="password"
          autofocus
          @keypress.enter="submit"
        />
        <p>Password confirmation</p>
        <BaseInputText
          id="confirmation"
          v-model="confirmation"
          label="Confirmation"
          name="confirmation"
          type="password"
          @keypress.enter="submit"
        />
        <div>
          <BaseButton :disabled="processingForm" @click="submit">
            Reset password
          </BaseButton>
        </div>
        <ul class="text-[red] mt-3">
          <li v-for="error in authErrors" :key="error">
            <small>
              {{ error }}
            </small>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { authMethods } from '@/store/helpers'

export default {
  data() {
    return {
      password: '',
      confirmation: '',
      authErrors: [],
      processingForm: false,
    }
  },

  mounted() {
    this.$emit('init')
  },

  methods: {
    ...authMethods,
    async submit() {
      try {
        await this.$store.dispatch('auth/updatePassword', {
          password: this.password,
          confirmation: this.confirmation,
        })
        this.processingForm = false
        this.$router.push({ name: 'matches' })
      } catch (error) {
        this.authErrors = error.full_messages
        this.processingForm = false
      }
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
