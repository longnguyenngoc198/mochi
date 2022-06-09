import * as actions from "./actions";
import { ApiClient } from "../../../AppClient";
import { decodeToken, getCookie } from "../../../utils/helpers";
let client = new ApiClient();
const mochiTokenCookie = getCookie("mc_tk");
let mochiToken = "";
if (mochiTokenCookie) {
  mochiToken = decodeToken(mochiTokenCookie);
}

export const fetchReviewWords = () => {
  return (dispatch) => {
    if (mochiToken) {
      client
        .get("v3.1/words/words-ios", {
          params: { user_token: mochiToken },
        })
        .then((response) => {
          const result = response.data;
          if (result.code == "1") {
            dispatch(actions.fetchReviewWords(result));
          }
        })
        .catch((error) => {
          const errorMsg = error.message;
          console.log({ errorMsg });
        });
    }
  };
};
export const updateStatusGame1 = (status) => {
  return (dispatch) => {
    dispatch(actions.updateStatusGame1Action(status));
  };
};
export const updateStatusGame2 = (status) => {
  return (dispatch) => {
    dispatch(actions.updateStatusGame2Action(status));
  };
};
export const updateStatusGame3 = (status) => {
  return (dispatch) => {
    dispatch(actions.updateStatusGame3Action(status));
  };
};
export const updateStatusGame4 = (status) => {
  return (dispatch) => {
    dispatch(actions.updateStatusGame4Action(status));
  };
};
export const updateShowGameReview = (status) => {
  return (dispatch) => {
    dispatch(actions.updateShowGameReviewAction(status));
  };
};
export const updateState = (data) => {
  return (dispatch) => {
    dispatch(actions.updateStateAction(data));
  };
};
export const updateListReviewed = (data, success = () => {}) => {
  return (dispatch) => {
    dispatch(actions.updateListReviewedAction(data));
    success();
  };
};
export const updateLevelWord = (params, success = () => {}, fail = () => {}) => {
  return (dispatch) => {
    if (mochiToken) {
      client
        .post("v3.0/words/update-ios", { user_token: mochiToken, words : {words : [...params]} })
        .then((response) => {
          const result = response.data;
          console.log({ result });
          success(result.up_level);
        })
        .catch((error) => {
          const errorMsg = error.message;
          console.log({ errorMsg });
        });
    }
  };
};
export const resetGame = (params, success = () => {}, fail = () => {}) => {
  return (dispatch) => {
    dispatch(actions.resetGameAction());
  };
};
export default {
  updateLevelWord,
  fetchReviewWords,
  updateStatusGame1,
  updateStatusGame2,
  updateStatusGame3,
  updateStatusGame4,
  updateShowGameReview,
  updateListReviewed,
  updateState,
  resetGame
};
