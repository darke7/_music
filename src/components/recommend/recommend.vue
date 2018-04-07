<template>
  <div>
      <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
        
      </div>
  </div>
</template>

<script>
import {ERR_OK} from 'api/config'
import {getRecommend} from 'api/recommend'
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

  }

}
</script>

