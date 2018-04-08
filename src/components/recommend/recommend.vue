<template>
  <div>
      <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider swipeid="swipe" ref="swiper" :autoPlay="3000" effect="slide">
            <div v-for="top in recommends" :key="top.id" class="swiper-slide" slot="swiper-con" >
              <img v-lazy="top.picUrl">
            <!-- <h3>{{top.title}}</h3> -->
            </div>
          </slider>
      </div>
  </div>
</template>
<style lang="stylus">
  .slider-wrapper
    img
      height:200px;
</style>
<script>
import {ERR_OK} from 'api/config'
import {getRecommend} from 'api/recommend'
import slider from 'base/slider/slider'
export default {
  data () {
    return {
    	recommends: [],
    }
  },
  mounted(){
  	this._getRecommend();
  },
  methods:{
  	_getRecommend(){
  		getRecommend().then((res) => {
			if (res.code === ERR_OK) {
				this.recommends = res.data.slider;
				console.log(this.recommends);
			}
        })
  	},

  },
  components:{
    slider
  }

}
</script>
<style lang="stylus">
  .swiper
    img
      height:100px;
</style>

