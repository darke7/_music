<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
import {createSong} from 'common/js/song.js'
import musicList from 'components/music-list/music-list'

 export default{
  data(){
    return {
      songs:[]
    }
  },
  computed:{
    ...mapGetters([
        'singer'
      ]),
    title(){
      return this.singer.name;
    },
    bgImage(){
      return this.singer.avatar;
    }
  },
  created(){
    this._getSingerDetail();
  },
  methods:{
    _getSingerDetail(){
      if(!this.singer.id){
        this.$router.push('/singer');
        return ;
      }
      getSingerDetail(this.singer.id).then((res)=>{
        if(res.code === ERR_OK){
          this.songs = this._normalizeSongs(res.data.list);
        }
      });
    },
    _normalizeSongs(list){
      let ret = [];
      list.forEach((item)=>{
        let {musicData} = item;
        if(musicData.songmid&&musicData.albummid){
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  components:{
    musicList
  }
 }
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
</style>
