import * as actions from "./actions";
import { ApiClient } from "../../../AppClient";
import { decodeToken, encodeToken, getCookie } from "../../../utils/helpers";
let client = new ApiClient();
const mochiTokenCookie = getCookie("mc_tk");
let mochiToken = "";
if (mochiTokenCookie) {
  mochiToken = decodeToken(mochiTokenCookie);
}
console.log({ mochiToken });
const tempNotify = [
  {
    id: 23,
    name: "Event 2",
    user_group_id: 9,
    image:
      "https://play-lh.googleusercontent.com/SB10E0Pgg1gRtzHOlmMDFu_Rb72LKgI5T3gKrQ9LWbUTH0hMMbD_Gw_KZxhkiL5jk5s",
    message:
      "Khoá học của bạn sẽ hết hạn sau 07 ngày nữa. Gia hạn để tiếp tục học cùng Mochi nhé!",
    title: "Gia hạn ngay",
    text_button: "Gia hạn ngay",
    time_start: "2021-11-17 08:28:00",
    landing_page: "https://mochidemy.com/mochian-web-vi-gia-han/",
    status: 1,
    lang: 2,
    device_type: 1,
    created_at: "2021-11-17 08:39:00",
    updated_at: "2021-11-17 08:39:12",
  },
];

export const fetchProfile = () => {
  return (dispatch) => {
    if (mochiToken) {
      dispatch(actions.getAccountInformation(mochiToken));
      client
        .get("v3.0/profile", { params: { user_token: mochiToken } })
        .then((response) => {
          const result = response.data;
          console.log({ result });
          if (result.code == "1") {
            dispatch(actions.fetchProfileCompleted(result.data));
          }
          // dispatch(actions.closeLoading());
        })
        .catch((error) => {
          const errorMsg = error.message;
          console.log({ errorMsg });
          // dispatch(actions.fetchListFailed(errorMsg));
        });
    }
  };
};
export const fetchWordStatistic = () => {
  return (dispatch) => {
    if (mochiToken) {
      client
        .get("v3.0/words/summary-ios", {
          params: { user_token: mochiToken },
        })
        .then((response) => {
          const result = response.data;
          console.log({ result });
          if (result.code == "1") {
            dispatch(actions.fetchWordStatisticCompleted(result.data));
          }
          // dispatch(actions.closeLoading());
        })
        .catch((error) => {
          const errorMsg = error.message;
          console.log({ errorMsg });
          // dispatch(actions.fetchListFailed(errorMsg));
        });
    }
  };
};
export const fetchUserGoal = () => {
  return (dispatch) => {
    if (mochiToken) {
      client
        .get("v3.0/get-badge", {
          params: { user_token: mochiToken },
        })
        .then((response) => {
          const result = response.data;
          console.log("goal", result);
          if (result.code == "1") {
            dispatch(actions.fetchUserGoal(result.data));
          }
          // dispatch(actions.closeLoading());
        })
        .catch((error) => {
          const errorMsg = error.message;
          console.log({ errorMsg });
          // dispatch(actions.fetchListFailed(errorMsg));
        });
    }
  };
};
export const fetchListPopup = (success = () => {}) => {
  return (dispatch) => {
    if (mochiToken) {
      client
        .get("v3.0/popup", {
          params: { user_token: mochiToken },
        })
        .then((response) => {
          const result = response.data;
          if (result.code === 1) {
            success(result.data);
            // success(tempNotify);
          }
          console.log("popup", result);
          // if (result.code == "1") {
          //   dispatch(actions.fetchUserGoal(result.data));
          // }
          // dispatch(actions.closeLoading());
        })
        .catch((error) => {
          const errorMsg = error.message;
          console.log({ errorMsg });
          // dispatch(actions.fetchListFailed(errorMsg));
        });
    }
  };
};

export const enterCode = (params, success = () => {}, fail = () => {}) => {
  return (dispatch) => {
    // dispatch(actions.getAccountInformation());
    if (mochiToken) {
      client
        .post("v3.0/code-new-ios", { user_token: mochiToken, ...params })
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
          // dispatch(actions.fetchListFailed(errorMsg));
        });
    }
  };
};
export const updateUserInfo = (params, success = () => {}, fail = () => {}) => {
  return (dispatch) => {
    // dispatch(actions.getAccountInformation());
    if (mochiToken) {
      client
        .post("v3.1/update-info", { user_token: mochiToken, ...params })
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
          // dispatch(actions.fetchListFailed(errorMsg));
        });
    }
  };
};
export const addDevice = (params, success = () => {}, fail = () => {}) => {
  return (dispatch) => {
    // dispatch(actions.getAccountInformation());
    if (mochiToken) {
      client
        .post("v3.0/app-devices", { user_token: mochiToken, ...params })
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
          // dispatch(actions.fetchListFailed(errorMsg));
        });
    }
  };
};

export const loginByThirdParty = (params, success = () => {}) => {
  return (dispatch) => {
    // dispatch(actions.getAccountInformation());
    client
      .post("v3.0/signin-with-fb-google", params)
      .then((response) => {
        const result = response.data;
        console.log({ result });
        success(result);
        // dispatch(actions.fetchListCompleted(result));
        // dispatch(actions.closeLoading());
      })
      .catch((error) => {
        const errorMsg = error.message;
        console.log({ errorMsg });
        // dispatch(actions.fetchListFailed(errorMsg));
      });
  };
};
export const loginByEmail = (params, success = () => {}, error = () => {}) => {
  return (dispatch) => {
    // dispatch(actions.getAccountInformation());
    client
      .post("v3.0/signin-email", params)
      .then((response) => {
        const result = response.data;
        console.log({ result });
        if (result.code == 1) {
          success(result);
        } else {
          error(result.msg, result.lang);
        }
        // dispatch(actions.fetchListCompleted(result));
        // dispatch(actions.closeLoading());
      })
      .catch((error) => {
        const errorMsg = error.message;
        console.log({ errorMsg });
        // dispatch(actions.fetchListFailed(errorMsg));
      });
  };
};
export const registerByEmail = (params, success = () => {}) => {
  return (dispatch) => {
    // dispatch(actions.getAccountInformation());
    client
      .post("v3.0/register-ios", params)
      .then((response) => {
        const result = response.data;
        console.log({ result });
        success(result);
        // dispatch(actions.fetchListCompleted(result));
        // dispatch(actions.closeLoading());
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

export default {
  fetchProfile,
  loginByThirdParty,
  fetchWordStatistic,
  loginByEmail,
  registerByEmail,
  updateState,
  fetchUserGoal,
  enterCode,
  updateUserInfo,
  fetchListPopup,
  addDevice,
};
