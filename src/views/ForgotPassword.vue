<template>
  <div class="flex flex-col justify-center items-center">
    <div class="w-full md:w-6/12">
      <div v-if="success">
        <p>We've sent you an email with a link to reset your password.</p>
      </div>
      <div v-else>
        <p>What is your email?</p>
        <BaseInputText
          v-model="email"
          label="Email"
          name="email"
          type="text"
          autofocus
          @keypress.enter="submit"
        />
        <BaseButton :disabled="processingForm" @click="submit">
          Reset password
        </BaseButton>
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
      email: '',
      authErrors: null,
      processingForm: false,
      success: false,
    }
  },

  mounted() {
    this.$emit('init')
  },

  methods: {
    ...authMethods,
    async submit() {
      this.processingForm = true
      try {
        await this.$store.dispatch('auth/resetPassword', {
          email: this.email,
          redirectUrl: `http://${window.location.host}/reset-password`
        })
        this.success = true
      } catch (errors) {
        this.authErrors = errors
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
