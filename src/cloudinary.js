import Vue from 'vue'
import Cloudinary, { CldImage, CldTransformation } from 'cloudinary-vue'
import { config } from '@/constants'

Vue.use(Cloudinary, {
  configuration: { cloudName: config.cloudName },
  components: [CldImage, CldTransformation],
})
