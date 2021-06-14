<template>
  <div class="corner">
    <div class="num flex flex-col">
      <p class="font-bold m-0">PTS</p>
      <p class="m-0">3</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
    },
    img: {
      type: String,
      required: false,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.corner {
  background: blue;
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
    right: 23%;
  }
}
</style>
