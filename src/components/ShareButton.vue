<template>
  <div class="visibility-hidden tooltip" data-tooltip="Copied!">
    <BaseIcon name="share" @click.native="copy($event)" />
  </div>
</template>

<script>
export default {
  props: {
    password: {
      type: String,
      default: null,
      required: true,
    },
  },
  methods: {
    copy(event) {
      event.target.parentElement.parentElement.classList.remove(
        'visibility-hidden'
      )
      setTimeout(this.hidePopOver, 3000)
      const text = window.location.origin + '/join/' + this.password
      const elem = document.createElement('textarea')
      elem.value = text
      document.body.appendChild(elem)
      elem.select()
      document.execCommand('copy')
      document.body.removeChild(elem)
    },
    hidePopOver() {
      document.querySelector('.tooltip').classList.add('visibility-hidden')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.tooltip {
  position: relative;
  z-index: 2;
  cursor: pointer;
}
.tooltip:before,
.tooltip:after {
  opacity: 1;
  pointer-events: none;
}
/* Position tooltip above the element */
.tooltip:before {
  position: absolute;
  bottom: 150%;
  left: 50%;
  margin-bottom: 5px;
  margin-left: -80px;
  padding: 7px;
  width: 160px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  background-color: $purple;
  color: $white;
  content: attr(data-tooltip);
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
}

/* Triangle hack to make tooltip look like a speech bubble */
.tooltip:after {
  position: absolute;
  bottom: 150%;
  left: 50%;
  margin-left: -5px;
  width: 0;
  border-top: 5px solid #000;
  border-top: 5px solid hsla(0, 0%, 20%, 0.9);
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  content: ' ';
  font-size: 0;
  line-height: 0;
}
.visibility-hidden.tooltip:before,
.visibility-hidden.tooltip:after {
  visibility: hidden;
}
</style>
