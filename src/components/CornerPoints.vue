<template>
  <div :class="['corner', bgStyle]">
    <div class="num flex flex-col">
      <!-- <p :class="['font-bold', 'm-0', textColor]">PTS</p>
      <p :class="['m-0', textColor]">{{ number }}</p> -->
      <p v-if="correct" :class="['m-0', textColor]"
        ><BaseIcon name="check"
      /></p>
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
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.corner {
  width: $spacer * 3.5;
  height: $spacer * 3.5;
  border-radius: 0px $spacer 0px 100%;
  position: absolute;
  top: 0;
  right: 0;
  .num {
    margin: 0;
    position: absolute;
    top: 5%;
    right: 16%;
    font-size: 12px;
  }
}
// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) {
  .corner {
    width: $spacer * 6;
    height: $spacer * 6;
    position: absolute;
    .num {
      margin: 0;
      position: absolute;
      top: 16%;
      right: 22%;
      font-size: 16px;
    }
  }
}
</style>
