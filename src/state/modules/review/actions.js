import * as types from './types'

export const fetchReviewWords = (data) => {
  return {
    type: types.FETCH_REVIEW_WORD,
    payload: data,
  };
};

export const updateStatusGame1Action = (data) => {
  return {
    type: types.UPDATE_STATUS_GAME_1_ACTION,
    payload: data,
  };
};

export const updateStatusGame2Action = (data) => {
  return {
    type: types.UPDATE_STATUS_GAME_2_ACTION,
    payload: data,
  };
};

export const updateStatusGame3Action = (data) => {
  return {
    type: types.UPDATE_STATUS_GAME_3_ACTION,
    payload: data,
  };
};

export const updateStatusGame4Action = (data) => {
  return {
    type: types.UPDATE_STATUS_GAME_4_ACTION,
    payload: data,
  };
};

export const updateShowGameReviewAction = (data) => {
  return {
    type: types.UPDATE_STATUS_SHOW_GAME,
    payload: data,
  };
};

export const updateStateAction = (data) => {
  return {
    type: types.UPDATE_STATE,
    payload: data,
  };
};

export const updateListReviewedAction = (data) => {
  return {
    type: types.UPDATE_LIST_REVIEW,
    payload: data,
  };
};

export const resetGameAction = (data) => {
  return {
    type: types.RESET_GAME,
    payload: data,
  };
};

