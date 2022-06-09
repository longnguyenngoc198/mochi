
import * as actions from './actions'
import { ApiClient } from '../../../AppClient'
let client = new ApiClient();
export const searchWord = (params, success = () => {}, fail = () => {}) => {
    return (dispatch) => {
        client
          .get("v3.1/words/dictionary-english", { params: params })
          .then((response) => {
              const result = response.data;
              if (result.code == '1') {
                  success(true);
                  dispatch(actions.searchWord(result.data, params.key));
              }
              
          })
          .catch((error) => {
              const errorMsg = error.message;
              console.log({ errorMsg });
            // dispatch(actions.fetchListFailed(errorMsg));
          });
    }
}
export const saveWord = (params, success = () => {}, fail = () => {}) => {
  return (dispatch) => {
    client
      .post("v3.1/words/dictionary-english/add-word", { params: params })
      .then((response) => {
          const result = response.data;
          console.log({result})
        if (result.code == "1") {
            success(true);
            
        //   dispatch(actions.searchWord(result.data, params.key));
        }
      })
      .catch((error) => {
        const errorMsg = error.message;
        console.log({ errorMsg });
        // dispatch(actions.fetchListFailed(errorMsg));
      });
  };
};

export default { searchWord, saveWord };
