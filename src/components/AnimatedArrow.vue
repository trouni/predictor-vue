<template>
  <div :class="direction" :style="cssProps">
    <span class="arrow"></span>
    <p v-html="text"></p>
  </div>
</template>

<script>
export default {
  name: 'AnimatedArrow',

  props: {
    up: {
      type: Boolean,
      default: false,
    },
    down: {
      type: Boolean,
      default: false,
    },
    left: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      required: false
    },
    color: {
      type: String,
      default: 'black'
    }
  },

  computed: {
    direction() {
      if (this.up) return 'up'
      else if (this.down) return 'down'
      else if (this.left) return 'left'
      else if (this.right) return 'right'
      else return ''
    },
    cssProps() {
      return {
        '--color': this.color,
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';

@keyframes uparrow {
  0% {
    -webkit-transform: translateY(0);
    opacity: 0.4;
  }
  100% {
    -webkit-transform: translateY(-0.4em);
    opacity: 0.9;
  }
}
@keyframes downarrow {
  0% {
    -webkit-transform: translateY(0);
    opacity: 0.4;
  }
  100% {
    -webkit-transform: translateY(0.4em);
    opacity: 0.9;
  }
}
@keyframes leftarrow {
  0% {
    -webkit-transform: translateX(0);
    opacity: 0.4;
  }
  100% {
    -webkit-transform: translateX(-0.4em);
    opacity: 0.9;
  }
}
@keyframes rightarrow {
  0% {
    -webkit-transform: translateX(0);
    opacity: 0.4;
  }
  100% {
    -webkit-transform: translateX(0.4em);
    opacity: 0.9;
  }
}

.arrow {
  border-color: transparent;
  border-style: solid;
  border-width: 1em;
  display: block;
  height: 0;
  opacity: 0.4;
  text-indent: -9999px;
  transform-origin: 50% 50%;
  width: 0;
}

.up,
.down,
.left,
.right {
  color: var(--color);
  @apply flex items-center gap-3;
}
.up {
  animation: uparrow 0.6s infinite alternate ease-in-out;
  & .arrow { border-bottom: 1em solid var(--color); }
  @apply flex-col text-center;
}
.down {
  animation: downarrow 0.6s infinite alternate ease-in-out;
  & .arrow { border-top: 1em solid var(--color); }
  @apply flex-col flex-col-reverse text-center;
}
.left {
  animation: leftarrow 0.6s infinite alternate ease-in-out;
  & .arrow { border-right: 1em solid var(--color); }
}
.right {
  & .arrow { border-left: 1em solid var(--color); }
  animation: rightarrow 0.6s infinite alternate ease-in-out;
  @apply flex-row-reverse text-right;
}
</style>