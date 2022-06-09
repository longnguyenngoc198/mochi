
import * as actions from './actions'
import { ApiClient } from '../../../AppClient'
import { decodeToken, encodeToken, getCookie } from "../../../utils/helpers";
let client = new ApiClient();
const mochiTokenCookie = getCookie("mc_tk");
let mochiToken = "";
if (mochiTokenCookie) {
  mochiToken = decodeToken(mochiTokenCookie);
}
export const fetchListWord = (params, isResetSearch, success = () => {}, fail = () => {}) => {
    return (dispatch) => {
        client
          .get("v3.0/words/page",{ params: {...params, user_token: mochiToken} })
          .then((response) => {
              const result = response.data;
              if (result.code == '1') {
                  success(true);
                  dispatch(actions.fetchListWordAction(result.data, isResetSearch));
              }
              
          })
          .catch((error) => {
              const errorMsg = error.message;
              console.log({ errorMsg });
            // dispatch(actions.fetchListFailed(errorMsg));
          });
    }
}

export const fetchSearchWord = (params, success = () => {}, fail = () => {}) => {
    return (dispatch) => {
        client
          .get("v3.0/words/search",{ params: {...params, user_token: mochiToken} })
          .then((response) => {
              const result = response.data;
              if (result.code == '1') {
                  success(true);
                  dispatch(actions.fetchSearchWordAction(result.data));
              }
              
          })
          .catch((error) => {
              const errorMsg = error.message;
              console.log({ errorMsg });
            // dispatch(actions.fetchListFailed(errorMsg));
          });
    }
}

export const postUpdateLearnStatus = (params, success = () => {}) => {
    return (dispatch) => {
      client
        .post("v3.0/words/update-learn-status", {...params,  user_token: mochiToken})
        .then((response) => {
          const result = response.data;
          success(result)
        })
        .catch((error) => {
          const errorMsg = error.message;
          console.log({ errorMsg });
        });
    };
  };

export const updateStatusWord = (params, success = () => {}, fail = () => {}) => {
    return (dispatch) => {
        success();
        dispatch(actions.updateStatusWordAction(params));
    }
}
export const resetHasChange = (params, success = () => {}, fail = () => {}) => {
    return (dispatch) => {
        success();
        dispatch(actions.resetHasChangeAction(params));
    }
}
export const setStatusModalConfirmNoteBook = (status, success = () => {}, fail = () => {}) => {
    return (dispatch) => {
        success();
        dispatch(actions.setStatusModalConfirmNoteBookAction(status));
    }
}
export const setRouteActive = (route, success = () => {}, fail = () => {}) => {
    return (dispatch) => {
        success();
        dispatch(actions.setRouteActiveAction(route));
    }
}

export default {postUpdateLearnStatus, setRouteActive, fetchListWord, fetchSearchWord, updateStatusWord, resetHasChange, setStatusModalConfirmNoteBook };
