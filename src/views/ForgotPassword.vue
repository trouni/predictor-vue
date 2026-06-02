<template>
  <div class="min-h-full flex flex-col justify-center px-5 py-8">

    <!-- Card -->
    <div
      class="w-full max-w-sm mx-auto rounded-3xl px-6 py-8"
      style="background: rgba(255,255,255,0.11); border: 1px solid rgba(255,255,255,0.18)"
    >

      <!-- Branding -->
      <div class="flex flex-col items-center mb-8">
        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
          style="background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2)"
        >
          <img
            :src="require('../assets/logo.png')"
            alt="Octacle logo"
            class="w-8 h-8 object-contain"
          />
        </div>
        <h2 class="text-white font-bold text-xl">Reset password</h2>
        <p class="text-sm mt-1 text-center" style="color: rgba(255,255,255,0.45)">
          We'll send a reset link to your email
        </p>
      </div>

      <!-- Success state -->
      <div
        v-if="success"
        class="flex flex-col items-center gap-3 py-2 text-center"
      >
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center"
          style="background: rgba(12,245,116,0.15); border: 1px solid rgba(12,245,116,0.25)"
        >
          <BaseIcon name="check" style="color: #0cf574" />
        </div>
        <p class="text-white font-semibold">Check your inbox</p>
        <p class="text-sm" style="color: rgba(255,255,255,0.5)">
          We've sent a password reset link to <span class="text-white">{{ email }}</span>
        </p>
        <BaseLink
          :to="{ name: 'login' }"
          class="mt-2 text-sm font-semibold"
          style="color: rgba(255,255,255,0.6)"
        >
          ← Back to log in
        </BaseLink>
      </div>

      <!-- Form -->
      <div v-else class="flex flex-col gap-4">

        <!-- Email -->
        <div>
          <label class="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style="color: rgba(255,255,255,0.5)">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            autofocus
            placeholder="you@example.com"
            class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
            style="background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.2)"
            @keypress.enter="submit"
          />
        </div>

        <!-- Errors -->
        <ul
          v-if="authErrors && authErrors.length"
          class="text-sm font-medium rounded-xl px-4 py-2.5"
          style="background: rgba(250,81,81,0.15); color: #fa5151; border: 1px solid rgba(250,81,81,0.25)"
        >
          <li v-for="error in authErrors" :key="error">{{ error }}</li>
        </ul>

        <!-- Submit -->
        <button
          :disabled="processingForm"
          @click="submit"
          class="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 mt-1"
          style="background: #fa5151"
        >
          <BaseIcon v-if="processingForm" name="sync" class="fa-spin" />
          <span>Send reset link</span>
        </button>

      </div>
    </div>

    <!-- Back to login -->
    <p v-if="!success" class="text-center text-sm mt-6" style="color: rgba(255,255,255,0.45)">
      Remember?
      <BaseLink
        :to="{ name: 'login' }"
        class="font-semibold ml-1"
        style="color: white"
      >
        Log in
      </BaseLink>
    </p>

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
          redirectUrl: `http://${window.location.host}/reset-password`,
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

<style scoped>
input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
input:focus {
  border-color: rgba(255, 255, 255, 0.45) !important;
  background: rgba(255, 255, 255, 0.16) !important;
}
</style>
