<template>
  <div class="p-4 flex flex-col justify-center items-center">
    <div class="w-full md:w-6/12">
      <p v-if="register">
        Already got an account?
        <BaseButton @click="register = false">Log in</BaseButton>
      </p>
      <p v-else>
        Need an account?
        <BaseButton @click="register = true">Register</BaseButton>
      </p>
      <div>
        <p>Email</p>
        <p v-if="authError" v-html="authError"></p>
        <BaseInputText
          v-model="email"
          label="Email"
          name="email"
          type="text"
          autofocus
          @keypress.enter="submit"
        />
        <p>Password</p>
        <BaseInputText
          id="password"
          v-model="password"
          label="Password"
          name="password"
          type="password"
          @keypress.enter="submit"
        />
        <div class="flex justify-between items-center">
          <BaseButton :disabled="processingForm" @click="submit">
            {{ register ? 'Sign up' : 'Login' }}
          </BaseButton>
          <BaseLink :to="{ name: 'forgot_password' }">Forgot password?</BaseLink>
        </div>
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

  mounted() {
    this.$emit('init')
    if (this.isJoinLink()) this.register = true
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
          // Redirect to the originally requested page, or to the matches page
          this.$router.push(
            this.$route.query.redirectFrom || { name: 'predictions' }
          )
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
    isJoinLink() {
      return !!location.search.match(/redirectFrom=%2Fjoin/)
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
