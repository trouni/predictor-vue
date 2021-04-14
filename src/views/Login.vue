<template>
  <div>
    <p v-if="register">
      Already got an account?
      <BaseButton @click="register = false">Log in</BaseButton>
    </p>
    <p v-else>
      Need an account?
      <BaseButton @click="register = true">Register</BaseButton>
    </p>
    <div>
      <h3>
        {{ register ? 'Sign up' : 'Sign in' }}
      </h3>
      <p v-if="authError" v-html="authError"></p>
      <BaseInputText
        v-model="email"
        label="Email"
        name="email"
        type="text"
        autofocus
        @keypress.enter="tryToLogIn"
      />

      <BaseInputText
        id="password"
        v-model="password"
        label="Password"
        name="password"
        type="password"
        @keypress.enter="tryToLogIn"
      />
      <div>
        <BaseButton :disabled="processingForm" @click="submit">
          {{ register ? 'Sign up' : 'Login' }}
        </BaseButton>
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
      password: '',
      authError: null,
      processingForm: false,
      register: false,
    }
  },

  methods: {
    ...authMethods,
    submit() {
      this.register ? this.tryToSignUp() : this.tryToLogIn()
    },
    tryToLogIn() {
      this.processingForm = true
      this.authError = null
      const credentials = {
        email: this.email,
        password: this.password,
      }
      return this.logIn(credentials)
        .then(() => {
          this.processingForm = false
          // Redirect to the originally requested page, or to the home page
          this.$router.push(this.$route.query.redirectFrom || { name: 'home' })
        })
        .catch(error => {
          this.processingForm = false
          this.authError = error
        })
    },
    tryToSignUp() {
      this.processingForm = true
      this.authError = null
      const credentials = {
        email: this.email,
        password: this.password,
        confirm_success_url: this.$route.query.redirectFrom || '/',
      }
      return this.signUp(credentials)
        .then(() => {
          this.tryToLogIn()
        })
        .catch(error => {
          this.processingForm = false
          this.authError = error.full_messages.join('<br/>')
        })
    },
  },
}
</script>

<style></style>
