// store.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    thumbnails: [],
  },
  mutations: {
    setThumbnails(state, thumbnails) {
      state.thumbnails = thumbnails;
    },
  },
});