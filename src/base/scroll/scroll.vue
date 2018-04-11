<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default{
  data(){
    return {
    }
  },
  props:{
    probeType: {
        type: Number,
        default: 1
    },
    click:{
      type:Boolean,
      default:false
    },
    data:{
      type:Array,
      default:null
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => {
        this.scrollInit();
    }, 20);
  },
  methods:{
    scrollInit(){
      if(!this.$refs.wrapper){
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper,{
        probeType: this.probeType,
        click: this.click,
      });
      if (this.listenScroll) {
        this.scroll.on("scroll", pos => {
            this.$emit("scroll", pos);
        });
      }
    },
    refresh(){
      this.scroll&&this.scroll.refresh();
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
          this.refresh();
      }, 20);
    }
  }
}
</script>

<style lang="stylus">
</style>

