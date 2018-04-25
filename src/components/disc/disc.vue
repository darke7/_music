<template>
  <transition name="slide">
    <div class="disc">
      <music-list :title="title" :bg-image="bgImg"></music-list>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend.js'

  export default {
    computed:{
      ...mapGetters([
          'disc'
        ]),
      title(){
        return this.disc.dissname
      },
      bgImg(){
        return this.disc.imgurl
      }

    },
    mounted(){
      this._getSongList(this.disc.dissid);
    },
    methods:{
      _getSongList(dissid){
        getSongList(dissid).then((res)=>{
          // console.log(res);
        })
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .disc
    position:relative
    z-index:2
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
