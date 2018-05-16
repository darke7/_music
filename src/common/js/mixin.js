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

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
