import * as types from './types'

export const searchWord = (payload, key) => {
  return {
    type: types.SEARCH_WORD,
    payload: payload,
    key,
  };
};
