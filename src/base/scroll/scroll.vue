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
    }
  },
  updated(){
    this.scrollInit();
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
    },
    refresh(){
      this.scroll&&this.scroll.refresh();
    }
  },
  watch: {
    data() {
      setTimeout(() => {
          this.refresh();
      }, 100);
    }
  }
}
</script>

<style lang="stylus">

</style>
