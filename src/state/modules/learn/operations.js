import * as actions from "./actions";
import { ApiClient } from "../../../AppClient";
import { decodeToken, encodeToken, getCookie } from "../../../utils/helpers";
let client = new ApiClient();
const mochiTokenCookie = getCookie("mc_tk");
let mochiToken = "";
if (mochiTokenCookie) {
  mochiToken = decodeToken(mochiTokenCookie);
}

export const fetchListCourse = (
  params,
  success = () => {},
  fail = () => {}
) => {
  return (dispatch) => {
    client
      .get("v3.0/course/get-course-ios", {
        params: { ...params, user_token: mochiToken },
      })
      .then((response) => {
        const result = response.data;
        if (result.code == "1") {
          success(true);
          dispatch(actions.fetchListCourseAction(result.data));
        }
      })
      .catch((error) => {
        const errorMsg = error.message;
        console.log({ errorMsg });
        // dispatch(actions.fetchListFailed(errorMsg));
      });
  };
};
export const fetchListLesson = (
  params,
  title,
  type,
  success = () => {},
  fail = () => {}
) => {
  console.log(params);
  return (dispatch) => {
    client
      .get("v3.0/mobile/lesson-ios", {
        params: { ...params, user_token: mochiToken },
      })
      .then((response) => {
        const result = response.data;

        if (result.code == "1") {
          success();
          result["titleCourseActive"] = title;
          result["course_id"] = params.course_id;
          result["type"] = type;
          dispatch(actions.fetchListLessonAction(result));
        }
      })
      .catch((error) => {
        const errorMsg = error.message;
        console.log({ errorMsg });
        // dispatch(actions.fetchListFailed(errorMsg));
      });
  };
};
export const fetchListQuestions = (
  params,
  success = () => {},
  fail = () => {}
) => {
  return async (dispatch) => {
    client
      .get("v3.0/mobile/question", {
        params: { ...params, user_token: mochiToken },
      })
      .then((response) => {
        const result = response.data;

        if (result.code == "1") {
          success(true);
          dispatch(actions.fetchListQuestions(result.data));
        }
      })
      .catch((error) => {
        const errorMsg = error.message;
        console.log({ errorMsg });
        // dispatch(actions.fetchListFailed(errorMsg));
      });
  };
};
export const updateState = (params) => {
  return (dispatch) => {
    dispatch(actions.updateState(params));
  };
};
export const restartWord = (newId) => {
  const params = {
    totalCorrect: 0,
    totalGameLearn: 0,
    countTrue: 0,
    countFalse: 0,
    countIncorrect: 0,
  };
  params.wordToLearnId = newId;
  return (dispatch) => {
    dispatch(actions.updateState(params));
  };
};
export const updateListLearned = (params) => {
  return (dispatch) => {
    dispatch(actions.updateListLearned(params));
  };
};

export const finishLesson = (params, success = () => {}, fail = () => {}) => {
  return (dispatch) => {
    if (mochiToken) {
      client
        .post("v3.0/words/add-ios", { user_token: mochiToken, ...params })
        .then((response) => {
          const result = response.data;
          console.log({ result });
          if (result.code === 1) {
            success(true);
          } else {
            fail(result.msg);
          }
        })
        .catch((error) => {
          const errorMsg = error.message;
          console.log({ errorMsg });
        });
    }
  };
};
export const saveWordToNotebook = (params, success = () => {}, fail = () => {}) => {
  return (dispatch) => {
    if (mochiToken) {
      client
        .post("v3.0/words/update-ios", { user_token: mochiToken, ...params })
        .then((response) => {
          const result = response.data;
          console.log({ result });
          if (result.code === 1) {
            success(true);
          } else {
            fail(result.msg);
          }
        })
        .catch((error) => {
          const errorMsg = error.message;
          console.log({ errorMsg });
        });
    }
  };
};
export const sendError = (
  params,
  success = () => {},
  fail = () => {}
) => {
  return (dispatch) => {
    if (mochiToken) {
      client
        .post("v3.0/mobile/question-error", {
          user_token: mochiToken,
          ...params,
        })
        .then((response) => {
          const result = response.data;
          console.log({ result });
          if (result.code === 1) {
            success(true);
          } else {
            fail(result.msg);
          }
        })
        .catch((error) => {
          const errorMsg = error.message;
          console.log({ errorMsg });
        });
    }
  };
};
export default {
  fetchListCourse,
  fetchListLesson,
  fetchListQuestions,
  updateState,
  updateListLearned,
  finishLesson,
  restartWord,
  saveWordToNotebook,
  sendError,
};
