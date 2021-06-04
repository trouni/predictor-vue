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
        <cld-context cloudName="dmbf29">
          <div style="display: flex; justify-content: center">
            <cld-image :publicId="publicId" width="250" crop="scale" />
          </div>
        </cld-context>
        <div>
          <button @click="openUploadModal">Upload files</button>
        </div>
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
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { CldContext, CldImage } from 'cloudinary-vue'

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
      url: '',
      publicId: '',
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
    openUploadModal() {
      console.log('openUploadModal')
      // window.cloudinary
      //   .openUploadWidget(
      //     { cloud_name: 'dmbf29', upload_preset: 'cb59wrvm' },
      //     (error, result) => {
      //       if (!error && result && result.event === 'success') {
      //         console.log('Done uploading..: ', result.info)
      //         this.url = result.info.url
      //         this.publicId = result.info.public_id
      //       }
      //     }
      //   )
      //   .open()
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
