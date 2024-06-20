<template>
  <div class="p-4">
    <div class="flex flex-col justify-center items-center">
      <div class="w-full md:w-6/12">
        <div class="flex justify-center">
          <div class="relative rounded-full overflow-hidden h-24 w-24">
            <cld-context
              v-if="user.photoKey || user.photo_key"
              :cloudName="cloudName"
            >
              <div>
                <cld-image :publicId="user.photoKey || user.photo_key">
                  <cld-transformation
                    width="150"
                    height="150"
                    gravity="face"
                    radius="max"
                    crop="fill"
                  />
                </cld-image>
              </div>
            </cld-context>
            <img
              v-else
              alt="football graphic"
              :src="require('../assets/player.png')"
            />
            <button @click="openUploadModal" class="avatar-btn"
              ><BaseIcon name="camera"
            /></button>
          </div>
        </div>
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

        <p id="name-label"
          >Display Name <BaseIcon v-if="userNameUpdated" name="check"
        /></p>
        <div class="relative">
          <BaseInputText
            v-model="user.name"
            label="Name"
            name="name"
            type="text"
            autofocus
            @keypress.enter="submit"
            @keypress="userNameUpdated = false"
          />
          <BaseButton
            :disabled="processingForm"
            @click="submit"
            class="absolute top-0 right-0 h-full"
          >
            Update
          </BaseButton>
        </div>
        <div class="flex items-start w-full">
          <BaseLink :to="{ name: 'logout' }">
            <p>Log out <BaseIcon name="sign-out-alt" /></p>
          </BaseLink>
        </div>
      </div>
      <div class="w-full md:w-6/12 mt-10">
        <h3>Switch Competition</h3>
        <CompetitionsList :competitions="ongoingCompetitions" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { CldContext, CldImage, CldTransformation } from 'cloudinary-vue'
import { config } from '@/constants'
import CompetitionsList from '@/components/CompetitionsList'

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  components: {
    CldContext,
    CldImage,
    CldTransformation,
    CompetitionsList,
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
    },
    ongoingCompetitions() {
      return this.descendingCompetitions.filter(c => !this.competitionEnded(c.endDate))
    },
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
