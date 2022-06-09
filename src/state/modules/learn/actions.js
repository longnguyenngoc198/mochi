import * as types from "./types";

export const fetchListCourseAction = (payload, key) => {
  return {
    type: types.FETCH_LIST_COURSE,
    payload: payload,
  };
};

export const fetchListLessonAction = (payload, key) => {
  return {
    type: types.FETCH_LIST_LESSON,
    payload: payload,
  };
};
export const fetchListQuestions = (payload, key) => {
  return {
    type: types.FETCH_LIST_QUESTION,
    payload: payload,
  };
};
export const updateState = (data) => {
  return {
    type: types.UPDATE_STATE,
    payload: data,
  };
};
export const updateListLearned = (data) => {
  return {
    type: types.UPDATE_LIST_LEARN,
    payload: data,
  };
};