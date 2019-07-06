import { playMode } from '../common/js/aliasConfig'
const state = {
  fullScreen: false, // 控制全屏
  playList: [], // 歌曲播放列表
  sequenceList: [], // 顺序播放列表
  currentIndex: 0, // 当前播放的索引
  mode: playMode.sequence, // 播放的模式
  historyList: JSON.parse(localStorage.getItem('HistoryList')) || [],
  loveList: JSON.parse(localStorage.getItem('LoveList')) || [],
  searchText: JSON.parse(localStorage.getItem('searchText')) || []
}

export default state
