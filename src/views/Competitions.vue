<template>
  <div class="">
    <h3>Competitions</h3>
    <ul class="flex-column list-none competitions">
      <li
        v-for="competition in descendingCompetitions"
        :key="competition.id"
        class="mt-3"
      >
        <BaseLink :to="{ name: 'predictions', params: { id: competition.id } }">
          <BaseButton
            class="w-full"
            :class="competitionEnded(competition.endDate) ? 'secondary' : ''"
            @click="handleCompetitionClick(competition.id)"
          >
            {{ competition.name }}
          </BaseButton>
        </BaseLink>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { config } from '@/constants'

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  async mounted() {
    this.fetchCompetitions()
    this.user = await this.fetchUser({ userId: this.id })
    this.$emit('init')
  },

  computed: {
    ...mapGetters({
      competitions: 'competitions/competitions',
    }),
    descendingCompetitions() {
      return [...this.competitions].reverse()
    }
  },

  data() {
    return {
      name: '',
      email: '',
      loading: false,
      processingForm: false,
      user: null,
      userNameUpdated: false,
      cloudName: config.cloudName,
    }
  },
  methods: {
    ...mapActions({
      patchUser: 'users/patchUser',
      fetchCompetitions: 'competitions/fetchCompetitions',
      fetchUser: 'users/fetchUser',
    }),
    async submit() {
      this.processingForm = true
      const formData = {
        userId: this.user.id,
        name: this.user.name,
        photoKey: this.user.photoKey,
      }
      this.user = await this.patchUser(formData)
      this.name = this.user.name
      this.userNameUpdated = true
      this.processingForm = false
    },
    openUploadModal() {
      window.cloudinary
        .openUploadWidget(
          { cloud_name: this.cloudName, upload_preset: 'cb59wrvm' },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              this.$set(this.user, 'photoKey', result.info.public_id)
              this.submit()
            }
          }
        )
        .open()
    },
    competitionEnded(endDate) {
      return (
        new Date().setHours(0, 0, 0, 0) > new Date(endDate).setHours(0, 0, 0, 0)
      )
    },
    async handleCompetitionClick(competitionId) {
      await this.$store.dispatch(
        'competitions/selectCompetition',
        competitionId
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
p {
  color: $purple;
}
.avatar-btn {
  position: absolute;
  color: $red;
  top: 12px;
  left: 12px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  &:hover {
    cursor: pointer;
  }
}

.competitions a {
  width: 100%;
}
</style>
