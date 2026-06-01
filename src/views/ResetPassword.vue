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
        <h2 class="text-white font-bold text-xl">Choose a new password</h2>
        <p class="text-sm mt-1" style="color: rgba(255,255,255,0.45)">
          Must be at least 8 characters
        </p>
      </div>

      <!-- Form -->
      <div class="flex flex-col gap-4">

        <!-- New password -->
        <div>
          <label class="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style="color: rgba(255,255,255,0.5)">
            New password
          </label>
          <input
            v-model="password"
            type="password"
            autocomplete="new-password"
            autofocus
            placeholder="••••••••"
            class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
            style="background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.2)"
            @keypress.enter="submit"
          />
        </div>

        <!-- Confirm password -->
        <div>
          <label class="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style="color: rgba(255,255,255,0.5)">
            Confirm password
          </label>
          <input
            v-model="confirmation"
            type="password"
            autocomplete="new-password"
            placeholder="••••••••"
            class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
            style="background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.2)"
            @keypress.enter="submit"
          />
        </div>

        <!-- Errors -->
        <ul
          v-if="authErrors && authErrors.length"
          class="text-sm font-medium rounded-xl px-4 py-2.5"
          style="background: rgba(250,81,81,0.15); color: #fa5151; border: 1px solid rgba(250,81,81,0.25); list-style: none; margin: 0;"
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
          <BaseIcon v-if="processingForm" name="circle-notch" class="fa-spin" />
          <span>Set new password</span>
        </button>

      </div>
    </div>

    <!-- Back to login -->
    <p class="text-center text-sm mt-6" style="color: rgba(255,255,255,0.45)">
      Remember it?
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
        const { token, client_id, uid } = this.$route.query
        await this.$store.dispatch('auth/updatePassword', {
          password: this.password,
          confirmation: this.confirmation,
          headers: {
            'access-token': token,
            client: client_id,
            uid: uid,
          },
        })
        this.processingForm = false
        this.$router.push({ name: 'predictions' })
      } catch (error) {
        this.authErrors = error.full_messages
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
