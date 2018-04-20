<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" ></span>
            <span class="dot" ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime|format}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @schedule="schedule"></progress-bar>
            </div>
            <span class="time time-r">{{currentSong.duration|format}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="tagglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i  class="icon-not-favorite" ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon" >
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i @click.stop="tagglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
        <audio ref='audio' :src="currentSong.url" @canplay="read" @error="error" @timeupdate="timeUpdate" @ended="end"></audio>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters,mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import progressBar from 'base/progress-bar/progress-bar.vue'
import progressCircle from 'base/progress-circle/progress-circle.vue'
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util.js'

const transform = prefixStyle('transform')

export default {
  data(){
    return {
      songRead:false,
      currentTime:0
    }
  },
  computed:{
    modeIcon(){
      let mode = this.mode;
      if(mode === playMode.sequence){
        return 'icon-sequence';
      }else if(mode === playMode.loop){
        return 'icon-loop';
      }else if(mode === playMode.random){
        return 'icon-random';
      }
    },
    percent(){
      return this.currentTime/this.currentSong.duration;
    },
    disableCls(){
      return this.songRead?"":"disable";
    },
    cdCls(){
      return this.playing?'play':'play pause';
    },
    playIcon(){
      return !this.playing?'icon-play':'icon-pause';
    },
    miniIcon(){
      return !this.playing?'icon-play-mini':'icon-pause-mini';
    },
    ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
  },
  watch:{
    currentSong(newV,afterV){
      if(newV.id === afterV.id){
        return;
      }
      this.$nextTick(function() {
        this.$refs.audio.play();
        this.setPlayingState(true);
        this.currentSong.getLyric();
      })
    },
    playing(v){
      let audio = this.$refs.audio;
      this.$nextTick(function(){
        audio[this.playing?'play':'pause']();
      });
    }
  },
  methods:{
    end(){
      if(this.mode === playMode.loop){
        this.loop();
      }else{
        this.next();
      }
    },
    loop(){
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    },
    changeMode(){
      const mode = (this.mode+1)%3;
      this.setPlayMode(mode);
      let list = null;
      if(mode === playMode.random){
        list = shuffle(this.sequenceList);
      }else{
        list = this.sequenceList;
      }
      this.resetCurrentIndex(this.currentSong,list);
      this.setPlayList(list);
    },
    resetCurrentIndex(currentSong,list){
      let index = list.findIndex((item)=>{
        return currentSong.id === item.id;
      });
      this.setCurrentIndex(index);
    },
    schedule(jd){
      this.$refs.audio.currentTime = this.currentSong.duration*jd;
      if(!this.playing){
        this.tagglePlaying();
      }
    },
    timeUpdate(e){
      this.currentTime = e.target.currentTime;
    },
    error(){
       this.songRead = true;
    },
    read(){
      this.songRead = true;
    },
    next(){
      if(this.songRead){
        let index = this.currentIndex+1;
        if(index === this.playlist.length){
          index = 0;
        }
        this.setCurrentIndex(index);
        this.songRead = false;
      }
    },
    prev(){
      if(this.songRead){
        let index = this.currentIndex-1;
        if(index === -1){
          index = this.playlist.length-1;
        }
        this.setCurrentIndex(index);
        this.songRead = false;
      }
    },
    tagglePlaying(){
        this.setPlayingState(!this.playing);
    },
    back(){
      this.setPlayer(false);
    },
    open(){
      this.setPlayer(true);
    },
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    _getPosAndScale(){
      // mini
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      // max
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      // mixin
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setPlayer:'SET_FULL_SCREEN',
      setPlayingState:'SET_PLAYING_STATE',
      setCurrentIndex:'SET_CURRENT_INDEX',
      setPlayMode:'SET_PLAY_MODE',
      setPlayList:'SET_PLAYLIST'
    })
  },
  filters:{
    format(interval) {
        let pad = (num, n = 2)=>{
            let len = num.toString().length;
            while (len < n) {
                num = "0" + num;
                len++;
            }
            return num;
        }
        interval = interval | 0;
        const minute = (interval / 60) | 0;
        const second = pad(interval % 60);
        return `${minute}:${second}`;
    }
  },
  components:{
    progressBar,
    progressCircle
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          right: -2px;
          top: 0px;

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
