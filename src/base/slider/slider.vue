<template>
  <div class="swiper-container" :class="swipeid">
    <div class="swiper-wrapper">
      <!-- 存放具体的轮播内容 -->
      <slot name ="swiper-con"></slot>
    </div>
    <!-- 分页器 -->
    <div :class="{'swiper-pagination':pagination}"></div>
  </div>
</template>
<script>
  import Swiper from "swiper";
  import "swiper/dist/css/swiper.min.css";
  export default{
    data(){
      return {

      }
    },
    props: {
      swipeid: {
        type: String,
        default: "swipe"
      },
      effect: {
        type: String,
        default: "slide"
      },
      loop: {
        type: Boolean,
        default: false
      },
      direction: {
        type: String,
        default: "horizontal"
      },
      pagination: {
        type: Boolean,
        default: true
      },
      paginationType: {
        type: String,
        default: "bullets"
      },
      autoplay: {
        type: Number,
        default: 0
      },
      obj:{
        type:Object,
        default:null
      }
    },
    mounted(){
      var that = this;
      var _autoplay = this.autoplay?{
        delay:this.autoplay,
        //用户操作swiper之后，不禁止autoplay
        disableOnInteraction: false,
      }:false;
      let option = {
        //循环
        loop: this.loop,
        //分页器
        pagination: {
          el: ".swiper-pagination",
          bulletClass : 'swiper-pagination-bullet',
        },
        //分页类型
        paginationType: this.paginationType,
        //自动播放
        autoplay: _autoplay,
        //方向
        direction: this.direction,
        //特效
        effect: this.effect,
        //修改swiper自己或子元素时，自动初始化swiper
        observer: true,
        //修改swiper的父元素时，自动初始化swiper
        observeParents: true
      };
      if(this.obj){
        Object.assign(option,this.obj);
      }
      this.dom = new Swiper("." + that.swipeid, option);
    },
    activated(){
      this.dom.attachEvents();
      this.dom.autoplay.start();
    },
    deactivated(){
      this.dom.detachEvents();
      this.dom.autoplay.stop();
    },
    destroyed(){
      this.dom.destroy(true,true);
    }
  }
</script>

<style lang="stylus">
  .swiper-container
    width:100%
    height:100%
</style>
