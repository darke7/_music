import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
};

export const playerMixin = {
  computed:{
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playlist',
      'mode',
      'currentIndex'
    ]),
    modeIcon(){
      let mode = this.mode;
      if(mode === playMode.sequence){
        return 'icon-sequence';
      }else if(mode === playMode.loop){
        return 'icon-loop';
      }else if(mode === playMode.random){
        return 'icon-random';
      }
    }
  },
  methods:{
    ...mapMutations({
      setPlayingState:'SET_PLAYING_STATE',
      setCurrentIndex:'SET_CURRENT_INDEX',
      setPlayMode:'SET_PLAY_MODE',
      setPlayList:'SET_PLAYLIST'
    }),
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
    }
  }
}
// export const playerMixin = {
//   computed: {
//     iconMode() {
//       return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
//     },
//     ...mapGetters([
//       'sequenceList',
//       'playlist',
//       'currentSong',
//       'mode',
//       'favoriteList'
//     ])
//   },
//   methods: {
//     changeMode() {
//       const mode = (this.mode + 1) % 3
//       this.setPlayMode(mode)
//       let list = null
//       if (mode === playMode.random) {
//         list = shuffle(this.sequenceList)
//       } else {
//         list = this.sequenceList
//       }
//       this.resetCurrentIndex(list)
//       this.setPlaylist(list)
//     },
//     resetCurrentIndex(list) {
//       let index = list.findIndex((item) => {
//         return item.id === this.currentSong.id
//       })
//       this.setCurrentIndex(index)
//     },
//     toggleFavorite(song) {
//       if (this.isFavorite(song)) {
//         this.deleteFavoriteList(song)
//       } else {
//         this.saveFavoriteList(song)
//       }
//     },
//     getFavoriteIcon(song) {
//       if (this.isFavorite(song)) {
//         return 'icon-favorite'
//       }
//       return 'icon-not-favorite'
//     },
//     isFavorite(song) {
//       const index = this.favoriteList.findIndex((item) => {
//         return item.id === song.id
//       })
//       return index > -1
//     },
//     ...mapMutations({
//       setPlayMode: 'SET_PLAY_MODE',
//       setPlaylist: 'SET_PLAYLIST',
//       setCurrentIndex: 'SET_CURRENT_INDEX',
//       setPlayingState: 'SET_PLAYING_STATE'
//     }),
//     ...mapActions([
//       'saveFavoriteList',
//       'deleteFavoriteList'
//     ])
//   }
// }
