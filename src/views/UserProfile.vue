<template>
  <div>
    <div class="flex flex-col justify-center items-center">
      <div class="w-full md:w-6/12">
        <p>Email</p>
        <!-- Not sure how to give a default value -->
        <BaseInputText
          v-model="user.email"
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
        <div class="flex items-start w-full">
          <BaseLink :to="{ name: 'logout' }">
            <p>Log out <BaseIcon name="sign-out-alt" /></p>
          </BaseLink>
        </div>
      </div>
      <div v-if="user.admin" class="w-full md:w-6/12 mt-10">
        <h4>Competitions</h4>
        <ul class="flex list-none">
          <li
            v-for="competition in competitions"
            :key="competition.id"
            class="mr-3 last:mr-0"
          >
            <BaseLink :to="{ name: 'matches', params: { id: competition.id } }">
              <BaseButton>
                {{ competition.name }}
              </BaseButton>
            </BaseLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },

  async mounted() {
    this.fetchCompetitions()
    await this.fetchUser()
    this.$emit('init')
  },

  computed: {
    ...mapGetters({
      competitions: 'competitions/competitions',
    }),
  },

  data() {
    return {
      name: '',
      email: '',
      loading: false,
      processingForm: false,
      user: null,
    }
  },

  methods: {
    ...mapActions({
      patchUser: 'users/patchUser',
      fetchCompetitions: 'competitions/fetchCompetitions',
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
      this.name = this.user.name
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
