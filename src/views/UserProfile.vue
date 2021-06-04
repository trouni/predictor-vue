<template>
  <div>
    <div class="flex flex-col justify-center items-center">
      <div class="w-full md:w-6/12">
        <div class="flex justify-center">
          <div class="relative rounded-full h-24 w-24">
            <cld-context v-if="user.photoKey" :cloudName="clo">
              <div>
                <cld-image :publicId="user.photoKey">
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

        <p>Display Name</p>
        <div class="flex">
          <BaseInputText
            v-model="user.name"
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
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { CldContext, CldImage, CldTransformation } from 'cloudinary-vue'
import { config } from '@/constants'

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
  },
  async mounted() {
    await this.fetchUser()
    this.$emit('init')
  },

  data() {
    return {
      name: '',
      email: '',
      loading: false,
      processingForm: false,
      user: null,
      cloudName: config.cloudName,
    }
  },

  methods: {
    ...mapActions({
      patchUser: 'users/patchUser',
    }),
    async fetchUser() {
      this.loading = true
      this.user = await this.$store.dispatch('users/fetchUser', {
        userId: this.id,
      })
      console.log('updated')
      this.loading = false
    },
    async submit() {
      this.processingForm = true
      const formData = {
        userId: this.user.id,
        name: this.user.name,
        photoKey: this.user.photoKey,
      }
      this.user = await this.patchUser(formData)
      this.name = this.user.name
      this.processingForm = false
      // show success?
    },
    openUploadModal() {
      window.cloudinary
        .openUploadWidget(
          { cloud_name: 'dmbf29', upload_preset: 'cb59wrvm' },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              console.log(result.info)
              this.user.photoKey = result.info.public_id
              this.submit()
            }
          }
        )
        .open()
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
  top: 0;
  left: 0;
  &:hover {
    cursor: pointer;
  }
}
</style>
