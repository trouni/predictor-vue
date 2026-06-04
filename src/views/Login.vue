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
        <h2 class="text-white font-bold text-xl">
          {{ register ? 'Create account' : 'Welcome back' }}
        </h2>
        <p class="text-sm mt-1" style="color: rgba(255,255,255,0.45)">
          {{ register ? 'Start predicting today' : 'Sign in to continue' }}
        </p>
      </div>

      <!-- Form -->
      <div class="flex flex-col gap-4">

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
            style="background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.2); placeholder-color: rgba(255,255,255,0.3)"
            @keypress.enter="submit"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style="color: rgba(255,255,255,0.5)">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            :autocomplete="register ? 'new-password' : 'current-password'"
            placeholder="••••••••"
            class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
            style="background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.2)"
            @keypress.enter="submit"
          />
        </div>

        <!-- Error -->
        <p
          v-if="authError"
          class="text-sm font-medium rounded-xl px-4 py-2.5"
          style="
            background: rgba(200, 40, 40, 0.55);
            color: #fff;
            border: 1px solid rgba(250, 81, 81, 0.5);
          "
        >
          {{ errorMessage }}
        </p>

        <!-- Submit -->
        <button
          :disabled="processingForm"
          @click="submit"
          class="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 mt-1"
          style="background: #fa5151"
        >
          <BaseIcon v-if="processingForm" name="sync" class="fa-spin" />
          <span>{{ register ? 'Create account' : 'Log in' }}</span>
        </button>

        <!-- Forgot password -->
        <div v-if="!register" class="text-center">
          <BaseLink
            :to="{ name: 'forgot_password' }"
            class="text-sm"
            style="color: rgba(255,255,255,0.4)"
          >
            Forgot password?
          </BaseLink>
        </div>

      </div>
    </div>

    <!-- Toggle login / register -->
    <p class="text-center text-sm mt-6" style="color: rgba(255,255,255,0.45)">
      {{ register ? 'Already have an account?' : "Don't have an account?" }}
      <button
        @click="register = !register"
        class="font-semibold ml-1 focus:outline-none"
        style="color: white"
      >
        {{ register ? 'Log in' : 'Sign up' }}
      </button>
    </p>

  </div>
</template>

<script>
import { authMethods } from '@/store/helpers'

export default {
  data() {
    return {
      email: '',
      password: '',
      authError: null,
      processingForm: false,
      register: false,
    }
  },

  mounted() {
    this.$emit('init')
    if (this.isJoinLink()) this.register = true
  },

  computed: {
    errorMessage() {
      return this.authError && typeof this.authError === 'string'
        ? this.authError
        : 'An error occurred. Please try again.'
    },
  },

  methods: {
    ...authMethods,
    submit() {
      this.register ? this.tryToSignUp() : this.tryToLogIn()
    },
    async tryToLogIn() {
      this.processingForm = true
      this.authError = null
      const credentials = { email: this.email, password: this.password }

      if (!this.$store.getters['competitions/currentCompetitionId']) {
        await this.$store.dispatch('competitions/setDefaultCompetition')
      }

      return this.logIn(credentials)
        .then(() => {
          this.processingForm = false
          this.$router.push(
            this.$route.query.redirectFrom || { name: 'predictions' }
          )
        })
        .catch(error => {
          this.processingForm = false
          this.authError = error.response.data.errors[0]
        })
    },
    tryToSignUp() {
      this.processingForm = true
      this.authError = null
      const credentials = {
        email: this.email,
        password: this.password,
        confirm_success_url: this.$route.query.redirectFrom || window.location.origin + '/',
      }
      return this.signUp(credentials)
        .then(() => {
          this.tryToLogIn()
        })
        .catch(error => {
          this.processingForm = false
          const errors = Array.isArray(error) ? error : (error?.full_messages || error?.errors || [])
          this.authError = errors.join(', ') || 'Sign up failed. Please try again.'
        })
    },
    isJoinLink() {
      return !!location.search.match(/redirectFrom=%2Fjoin/)
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
