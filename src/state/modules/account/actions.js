import * as types from './types'

export const getAccountInformation = (userToken) => {
  return {
    type: types.FETCH_PROFILE,
    payload: userToken,
  };
};
export const updateState = (data) => {
  return {
    type: types.UPDATE_STATE,
    payload: data,
  };
};
export const fetchProfileCompleted = (data) => {
  return {
    type: types.FETCH_PROFILE_SUCCESS,
    payload: data,
  };
};
export const fetchUserGoal = (data) => {
  return {
    type: types.FETCH_USER_GOAL,
    payload: data,
  };
};

export const fetchWordStatisticCompleted = (data) => {
  return {
    type: types.FETCH_STATISTIC_SUCCESS,
    payload: data,
  };
};
