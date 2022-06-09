import * as types from "./types";

const INITIAL_STATE = {
  usWord: [],
  vnWord: [],
  suggest: [],
  wordToSearch: ''
};

const reducer = (state = INITIAL_STATE,action) => {
  
  const payload = action.payload;
  switch (action.type) {
    case types.SEARCH_WORD:
      return {
        ...state,
        usWord: payload.us,
        vnWord: payload.vi,
        suggest: payload.suggests,
        wordToSearch: action.key,
      };
    default:
      return state;
  }
};

export default reducer;
