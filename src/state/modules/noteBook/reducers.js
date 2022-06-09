import * as types from "./types";

const INITIAL_STATE = {
  list_level1: [],
  list_level2: [],
  list_level3: [],
  list_level4: [],
  list_level5: [],
  hasNextLv1: true,
  hasNextLv2: true,
  hasNextLv3: true,
  hasNextLv4: true,
  hasNextLv5: true,
  titleCourseActive: "",
  course_id: null,
  paginationLesson: {
    current: 1,
    per_page: 20,
    total_page: 1,
    total: 20,
  },
  hasWord: false,
  wordUpdateStatus: {
    words: []
  },
  hasChange: false,
  isShowModalConfirmSaveNoteBook: false,
  routeActive: 'review'
};

function checkHasWord(list) {
  if (
    list["list_level1"].length > 0 ||
    list["list_level2"].length > 0 ||
    list["list_level3"].length > 0 ||
    list["list_level4"].length > 0 ||
    list["list_level5"].length > 0
  ) {
    return true;
  } else {
    return false;
  }
}

const reducer = (state = INITIAL_STATE, action) => {
  const payload = action.payload;
  switch (action.type) {
    case types.FETCH_LIST_WORD:
      const isResetSearch = payload.isResetSearch;
      const data = payload.result;
      if(!isResetSearch){
        state.list_level1.push(...data[1]);
        state.list_level2.push(...data[2]);
        state.list_level3.push(...data[3]);
        state.list_level4.push(...data[4]);
        state.list_level5.push(...data[5]);
      }else{
        state.list_level1 = data[1];
        state.list_level2 = data[2];
        state.list_level3 = data[3];
        state.list_level4 = data[4];
        state.list_level5 = data[5];
      }

      state.hasWord = checkHasWord(state);

      return {
        ...state,
        paginationLesson: data.pagination,
        hasNextLv1: data[1].length == 0 ? false : true,
        hasNextLv2: data[2].length == 0 ? false : true,
        hasNextLv3: data[3].length == 0 ? false : true,
        hasNextLv4: data[4].length == 0 ? false : true,
        hasNextLv5: data[5].length == 0 ? false : true,
      };

    case types.FETCH_SEARCH_WORD:
      state.list_level1 = payload;
      state.list_level2 = payload;
      state.list_level3 = payload;
      state.list_level4 = payload;
      state.list_level5 = payload;

      return {
        ...state,
        paginationLesson: payload.pagination,
        hasNextLv1: payload.length == 0 ? false : true,
        hasNextLv2: payload.length == 0 ? false : true,
        hasNextLv3: payload.length == 0 ? false : true,
        hasNextLv4: payload.length == 0 ? false : true,
        hasNextLv5: payload.length == 0 ? false : true,
      };
    case types.RESET_HAS_CHANGE:
      return {
        ...state,
        hasChange: false,
        wordUpdateStatus: {
          words: []
        },
      };
    case types.SET_STATUS_MODAL_CONFIRM_NOTE_BOOK:
      return {
        ...state,
        isShowModalConfirmSaveNoteBook: payload
      };
    case types.SET_ROUTE_ACTIVE:
      return {
        ...state,
        routeActive: payload
      };

    case types.UPDATE_STATUS_WORD:
      state['list_level' + payload.lv][payload.index]['review_status'] = payload.review_status;
      let objectUpdate = {
        word_id: payload.word_id,
        review_status: payload.review_status
      }
      if(typeof state['list_level' + payload.lv][payload.index]['has_change_status'] !== 'undefined' && state['list_level' + payload.lv][payload.index]['has_change_status']){
        state.wordUpdateStatus.words.forEach((e, index)=>{
          if(e.word_id == payload.word_id){
            state.wordUpdateStatus.words[index]['review_status'] = payload.review_status;
          }
        })
      }else{
        state.wordUpdateStatus.words.push(objectUpdate)
      }
      state['list_level' + payload.lv][payload.index]['has_change_status'] = true;
      return {
        ...state,
        hasChange: true
      };
    default:
      return state;
  }
};

export default reducer;
