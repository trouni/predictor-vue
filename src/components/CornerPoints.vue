<template>
  <div :class="['corner', bgStyle]">

    <div class="num flex flex-col">
      <!-- <p :class="['font-bold', 'm-0', textColor]">PTS</p>
      <p :class="['m-0', textColor]">{{ number }}</p> -->
      <p v-if="correct" :class="['m-0', textColor]"><BaseIcon name="check" /></p>
      <p v-else :class="['m-0', textColor]"><BaseIcon name="times" /></p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    correct: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    bgStyle() {
      if (this.correct) {
        return 'bg-prediction-correct bg-opacity-20'
      } else {
        return 'bg-prediction-wrong bg-opacity-20'
      }
    },
    textColor() {
      if (this.correct) {
        return 'text-prediction-correct'
      } else {
        return 'text-prediction-wrong'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.corner {
  width: $spacer * 8;
  height: $spacer * 8;
  border-radius: 0px $spacer 0px 100%;
  color: white;
  position: absolute;
  top: 0;
  right: 0;
  .num {
    margin: 0;
    position: absolute;
    top: 10%;
    right: 14%;
  }
}
</style>
