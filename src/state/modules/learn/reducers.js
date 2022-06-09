import * as types from "./types";

const INITIAL_STATE = {
  list: [],
  listLesson: [],
  listQuestion: [],
  listKanjiAnswer: [],
  listContentAnswer: [],
  titleCourseActive: "",
  course_id: null,
  paginationLesson: {
    current: 1,
    per_page: 20,
    total_page: 1,
    total: 20,
  },
  wordToLearnId: 0,
  timeStart: 0,
  learnTime: 0,
  listLearned: [],
  currentCourse: "",
  currentLesson: "",
  gameLoading: false,
  openGameLearn: false,
  totalCorrect: 0,
  totalGameLearn: 0,
  countTrue: 0,
  countFalse: 0,
  openEndingGame: false,
  listCorrect: [],
  countIncorrect: 0
};

const reducer = (state = INITIAL_STATE, action) => {
  const payload = action.payload;
  switch (action.type) {
    case types.FETCH_LIST_COURSE:
      return {
        ...state,
        list: payload,
      };
    case types.FETCH_LIST_QUESTION:
      return {
        ...state,
        listQuestion: payload,
        listContentAnswer: getListContentAnswer(payload),
        listKanjiAnswer: getListKanjiAnswer(payload),
      };
    case types.FETCH_LIST_LESSON:
      if (payload.data.length > 0) {
        if (payload.type == "switchCourse") {
          state.listLesson = payload.data;
        } else {
          state.listLesson.push(...payload.data);
        }
      }

      return {
        ...state,
        paginationLesson: payload.pagination,
        titleCourseActive: payload.titleCourseActive,
        course_id: payload.course_id,
      };
    case types.UPDATE_STATE:
      return {
        ...state,
        ...action.payload,
      };
    case types.UPDATE_LIST_LEARN:
      return {
        ...state,
        listLearned: [...state.listLearned, payload.word],
      };
    default:
      return state;
  }
};

export default reducer;
function getListKanjiAnswer(listQuestion) {
  return listQuestion
    .map((item) => (item.kanji ? item.kanji : ""))
    .filter((item) => item !== "");
}
function getListContentAnswer(listQuestion) {
  return listQuestion.map((item) => (item.content ? item.content : ""));
}