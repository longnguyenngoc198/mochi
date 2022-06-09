import * as types from "./types";

const INITIAL_STATE = {
  listReviewWords: [],
  listGameOriginal1:[],
  listGameOriginal2:[],
  listGameOriginal3:[],
  listGameOriginal4:[],
  listGame1:[],
  listGame2: [],
  listGame3: [],
  listGame4: [],
  lengthGame1:1,
  lengthGame2:1,
  lengthGame3:1,
  lengthGame4:1,
  currentLevel:1,
  openGameReview: false,
  gameLoading: false,
  lastTimeReview: 0,
  listreviewed:[],
  openEndingGame: false,
  countFalse: 0,
  countCorrectGame:0,
  showMochiDongVien: false,
  showMochiCauCa: false,
  timeStart: 0,
  listResultGame: [],
  array_list_game_random: [],
  showStartGame: true
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_REVIEW_WORD:
      if(action.payload.data.length > 0){
        action.payload.data.sort(() => Math.random() - 0.5);
        let countMiddle = (action.payload.data.length / 2).toFixed();
        state.listReviewWords = [];
        state.listGameOriginal1 = [];
        state.listGameOriginal3 = [];
        state.listGameOriginal4 = [];
        state.listGameOriginal4 = [];
        state.listResultGame = [];
        state.listGame1 = [];
        state.listGame2 = [];
        state.listGame3 = [];
        state.listGame4 = [];
        state.lengthGame1 = 1;
        state.lengthGame2 = 1;
        state.lengthGame3 = 1;
        state.lengthGame4 = 1;
        state.currentLevel = 1;
        state.countFalse = 0;
        state.countCorrectGame = 0;
        state.array_list_game_random = [];
        state.showStartGame = true;
        action.payload.data.forEach(element => {
          element.answer_right = element.word_answer.find(e=>e.status==1);
          if(element.proficiency < 4){ //nếu level dưới lv4 thì còn 3 đáp án
            element.word_answer = element.word_answer.filter(e=>e.status == 0);
            element.word_answer[0] = element.answer_right;
          }
          element.word_answer.sort(() => Math.random() - 0.5);
          if(state.listGame1.length < countMiddle && element.kanji !== null){
            state.listGame1.push(element)
            state.listGameOriginal1.push(element)
            state.array_list_game_random.push(1);
          }else{
            let count = (countMiddle / 3).toFixed();
            if(state.listGame2.length < count){
              state.listGame2.push(element)
              state.listGameOriginal2.push(element)
              state.array_list_game_random.push(2);
            }else if(state.listGame3.length < count){
              state.listGame3.push(element)
              state.listGameOriginal3.push(element)
              state.array_list_game_random.push(3);
            }else{
              state.listGame4.push(element)
              state.listGameOriginal4.push(element)
              state.array_list_game_random.push(4);
            }
          }
        });

        state.array_list_game_random.sort(() => Math.random() - 0.5);
        state.lengthGame1 = state.listGame1.length;
        state.lengthGame2 = state.listGame2.length;
        state.lengthGame3 = state.listGame3.length;
        state.lengthGame4 = state.listGame4.length;
      }
      return {
        ...state,
        listReviewWords: action.payload.data,
        lastTimeReview: action.payload.last_review_time,
      };

    case types.RESET_GAME:
        state.currentLevel = 1;
        state.countFalse = 0;
        state.countCorrectGame = 0;
        state.showStartGame = true;
      return {
        ...state,
      };

    case types.UPDATE_STATUS_GAME_1_ACTION:
      if(action.payload){
        state.listGame1.shift();
        state.array_list_game_random.shift();
        state.currentLevel = state.currentLevel + 1;
      }else{
        for(let indexChange=5; indexChange>0; indexChange--){
          if(typeof state.listGame1[indexChange] !== "undefined"){
            state.listGame1 = array_move(state.listGame1, 0, indexChange);
            state.array_list_game_random = array_move(state.array_list_game_random, 0, indexChange);
            break;
          }
        }
      }
      return {
        ...state,
      };

    case types.UPDATE_STATUS_GAME_2_ACTION:
      if(action.payload){
        state.listGame2.shift();
        state.array_list_game_random.shift();
        state.currentLevel = state.currentLevel + 1;
      }else{
        for(let indexChange=5; indexChange>0; indexChange--){
          if(typeof state.listGame2[indexChange] !== "undefined"){
            state.listGame2 = array_move(state.listGame2, 0, indexChange);
            state.array_list_game_random = array_move(state.array_list_game_random, 0, indexChange);
            
            break;
          }
        }
      }
      return {
        ...state,
      };

    case types.UPDATE_STATUS_GAME_3_ACTION:
      if(action.payload){
        state.listGame3.shift();
        state.array_list_game_random.shift();
        state.currentLevel = state.currentLevel + 1;
        console.log("state.array_list_game_random", state.array_list_game_random);
      }else{
        for(let indexChange=5; indexChange>0; indexChange--){
          if(typeof state.listGame3[indexChange] !== "undefined"){
            state.listGame3 = array_move(state.listGame3, 0, indexChange);
            state.array_list_game_random = array_move(state.array_list_game_random, 0, indexChange);

            break;
          }
        }
      }
      return {
        ...state,
      };
    case types.UPDATE_STATUS_GAME_4_ACTION:
      if(action.payload){
        state.listGame4.shift();
        state.array_list_game_random.shift();
        state.currentLevel = state.currentLevel + 1;
      }else{
        for(let indexChange=5; indexChange>0; indexChange--){
          if(typeof state.listGame4[indexChange] !== "undefined"){
            state.listGame4 = array_move(state.listGame4, 0, indexChange);
            state.array_list_game_random = array_move(state.array_list_game_random, 0, indexChange);

            break;
          }
        }
      }
      return {
        ...state,
      };
    case types.UPDATE_STATUS_SHOW_GAME:
      return {
        ...state,
        openGameReview: action.payload
      };
    case types.UPDATE_STATE:
      return {
        ...state,
        ...action.payload
      };

      case types.UPDATE_LIST_REVIEW:
        let indexWord = state.listreviewed.findIndex(e=>e.word_id == action.payload.word.word_id);
        if(indexWord !== -1){
          state.listreviewed[indexWord]["true"] = action.payload.word.true;
          state.listreviewed[indexWord]["false"] = action.payload.word.false;
        }else{
          state.listreviewed = [...state.listreviewed, action.payload.word]
          console.log("action.payload.currentWord", action.payload.currentWord);
          if(typeof action.payload.currentWord !== "undefined"){
            state.listResultGame = [...state.listResultGame, action.payload.currentWord];
          }
        }
        return {
          ...state,
        };
    default:
      return state;
  }
};

export default reducer;

function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};
