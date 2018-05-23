<template>
  <div class="recommend" ref="recommend">
      <scroll class="recommend-content" :data="discList" ref="scroll">
        <div>
          <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
              <slider swipeid="swipe" :loop="true" :autoplay="2500">
                <div v-for="top in recommends" :key="top.id" class="swiper-slide" slot="swiper-con" >
                  <img :src="top.picUrl">
                <h3>{{top.title}}</h3>
                </div>
              </slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li @click="selectItem(item)" v-for="item in discList" class="item">
                <div class="icon">
                  <img width="60" height="60" v-lazy="item.imgurl">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
              <loading v-show="!discList.length"></loading>
            </ul>
          </div>
        </div>
      </scroll>
      <router-view></router-view>
  </div>
</template>
<script>
import {ERR_OK} from 'api/config'
import {getRecommend,getDiscList} from 'api/recommend'
import slider from 'base/slider/slider'
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin.js'
import {mapMutations} from 'vuex'

export default {
  mixins: [playlistMixin],
  data () {
    return {
    	recommends: [],
      discList:[]
    }
  },
  mounted(){
  	this._getRecommend();
    setTimeout(()=>{
      this._getDiscList();
    },1000);
    console.log(1231)
  },
  methods:{
    selectItem(item){
      this.$router.push({
        path:`recommend/${item.dissid}`
      })
      this.setDisc(item);
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
  	_getRecommend(){
  		getRecommend().then((res) => {
  			if (res.code === ERR_OK) {
  				this.recommends = res.data.slider;
  			}
      })
  	},
    _getDiscList(){
      getDiscList().then((res)=>{
        if(res.code === ERR_OK){
          this.discList = res.data.list;
        }
      })
    },
    ...mapMutations({
      'setDisc':'SET_DISC'
      })
  },
  components:{
    slider,
    scroll,
    loading
  }

}
</script>

<style lang="stylus">
@import '~common/stylus/variable'

.recommend
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  z-index:2
  .recommend-content
    height: 100%
    overflow: hidden
    .slider-wrapper
      position: relative
      width: 100%
      overflow: hidden
    .slider-wrapper
      position: relative
      width: 100%
      overflow: hidden
      text-align:center
      height:150px
      z-index:1
      img
        height:150px
      .swiper-pagination-bullet-active
        width:20px
        border-radius:20px
        background:#fff
        opacity:0.6
    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          width: 60px
          padding-right: 20px
        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: $color-text
          .desc
            color: $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
