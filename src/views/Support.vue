<template>
  <div class="md:p-10 p-5 h-screen">
    <div class="flex flex-col justify-start p-5">
      <div class="w-full md:w-6/full">
        <h3 class="w-full">{{ header }}</h3>
      </div>
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="my-5 flex flex-col items-center"
      >
        <h4 class="underline underline-offset-1">{{ step.title }}</h4>
        <p>{{ step.instructions }}</p>
        <img alt="football graphic" :src="step.img" class="md:w-6/80 mt-2" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async mounted() {
    this.$emit('init')
  },

  data() {
    return {
      header: 'Adding Octacle to Homescreen:',
      steps: [
        {
          title: 'Step 1',
          instructions: 'Click on the share button',
          img: `${require('../assets/support_small1.png')}`,
        },
        {
          title: 'Step 2',
          instructions: 'Click on the add to home screen button',
          img: `${require('../assets/support_small2.png')}`,
        },
        {
          title: 'Step 3',
          instructions: 'Use Octacle with icon from your home screen',
          img: `${require('../assets/support_small3.png')}`,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';

p {
  color: $purple;
}

.image-placeholder {
  background-color: #f0f0f0;
  color: #aaa;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  border: 1px dashed #aaa;
}
</style>
