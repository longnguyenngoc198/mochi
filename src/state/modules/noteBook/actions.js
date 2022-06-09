import * as types from './types'

export const fetchListWordAction = (payload, isResetSearch) => {
  return {
    type: types.FETCH_LIST_WORD,
    payload: {
      result: payload,
      isResetSearch: isResetSearch
    },
  };
};

export const fetchSearchWordAction = (payload, key) => {
  return {
    type: types.FETCH_SEARCH_WORD,
    payload: payload,
  };
};

export const updateStatusWordAction = (payload) => {
  return {
    type: types.UPDATE_STATUS_WORD,
    payload: payload,
  };
};

export const resetHasChangeAction = (payload) => {
  return {
    type: types.RESET_HAS_CHANGE,
    payload: payload,
  };
};

export const setStatusModalConfirmNoteBookAction = (payload) => {
  return {
    type: types.SET_STATUS_MODAL_CONFIRM_NOTE_BOOK,
    payload: payload,
  };
};

export const setRouteActiveAction = (payload) => {
  return {
    type: types.SET_ROUTE_ACTIVE,
    payload: payload,
  };
};
