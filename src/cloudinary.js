import Vue from 'vue'
import Cloudinary, { CldImage, CldTransformation } from 'cloudinary-vue'

Vue.use(Cloudinary, {
  configuration: { cloudName: 'dmbf29' },
  components: [CldImage, CldTransformation],
})
