<template>
  <transition name="list-fade"  >
    <div class="playlist" v-show="showFlag"  @click.stop="hide" >
      <div class="list-wrapper" >
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="modeIcon" @click.stop="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click.stop="showConfirmClear"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="listContent" :data="sequenceList" class="list-content" >
          <transition-group ref="list" name="list" tag="ul">
            <li :key="item.id" ref="listItem" class="item" v-for="(item,k) in sequenceList" @click.stop="selectItem(item,k)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}} -- {{item.singer}}</span>
              <span @click.stop="toggleFavorite(item)" class="like">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="showConfirmDel(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click.stop="showAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div  class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirmClear" @confirm="confirmClear" confirmBtnText="清空">是否清空播放列表？</confirm>
      <confirm ref="confirmDel" @confirm="confirmDel">删除 <br/> {{delSong.name}}--{{delSong.singer}}？</confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapActions} from 'vuex'
import scroll from 'base/scroll/scroll'
import {playMode} from 'common/js/config'
import confirm from 'base/confirm/confirm'
import {playerMixin} from 'common/js/mixin.js'
import addSong from 'components/add-song/add-song'
  export default {
    mixins:[playerMixin],
    data(){
      return {
        showFlag:false,
        delSong:{}
      }
    },
    computed:{
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      }
    },
    methods:{
      hide(){
        this.showFlag=false;
      },
      show(){
        this.showFlag=true;
        setTimeout(()=>{
          this.$refs.listContent.refresh();
          this.scrollToCurrent();
        },20)
      },
      getCurrentIcon(item){
        if(this.currentSong.id === item.id){
          return 'icon-play';
        }
        return '';
      },
      selectItem(item,k){
        if(this.mode === playMode.random){
          k = this.playlist.findIndex((song)=>{
            return song.id === item.id;
          });
        }
        this.setCurrentIndex(k);
        this.setPlayingState(true);
      },
      scrollToCurrent(current){
        this.$refs.listContent.scrollToElement(this.$refs.listItem[this.currentIndex],300);
      },
      deleteOne(item){
        this.deleteSong(item);
        if(!this.playlist.length){
          this.hide();
        }
      },
      confirmClear(){
        this.deleteSongList();
      },
      showConfirmClear(){
        this.$refs.confirmClear.show()
      },
      confirmDel(){
        if(!this.delSong){
          return
        }
        this.deleteSong(this.delSong);
        if(!this.playlist.length){
          this.hide();
        }
        this.delSong = {};
      },
      showConfirmDel(item){
        console.log(item)
        this.delSong = item;
        this.$refs.confirmDel.show()
      },
      showAddSong(){
        this.$refs.addSong.show();
      },
      ...mapActions([
          'deleteSong',
          'deleteSongList'
        ])
    },
    watch:{
      currentSong(oldv,newv){
        if(!this.showFlag||oldv===newv){
          return
        }
        this.scrollToCurrent();
      }
    },
    components:{
      scroll,
      confirm,
      addSong
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
