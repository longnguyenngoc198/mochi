import * as types from "./types";

const INITIAL_STATE = {
  userToken: "",
  profileLoading: false,
  displayName: "Hi guest!",
  email: "mochimochi@gmail.com",
  avatar: "",
  expiredDay: "",
  dayExpire: null,
  startDay: "",
  totalWord: 0,
  statistic: [
    { proficiency: 1, count: 0 },
    { proficiency: 2, count: 0 },
    { proficiency: 3, count: 0 },
    { proficiency: 4, count: 0 },
    { proficiency: 5, count: 0 },
  ],
  reviewWords: 0,
  reviewCount: 0,
  learningGoal: 0,
  reviewTime: "2022-05-29T11:20:09+07:00",
  listReviewWords: [],
  countProficiency: {},
  maxStreakDay: {},
  streakDay: {},
  countWord: {},
  isOpenLogin: false,
  isOpenRegister: false,
  isOpenExpireDay: false,
  isOpenExpired: false,
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_PROFILE:
      return {
        ...state,
        userToken: action.payload,
      };
    case types.FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        displayName: action.payload.display_name,
        email: action.payload.email,
        avatar: action.payload.avatar,
        expiredDay: convertDate(action.payload.expired_day),
        dayExpire:
          action.payload.expired_day !== null
            ? getDayExpire(action.payload.expired_day)
            : null,
        startDay: convertDate(action.payload.created_at),
      };
    case types.FETCH_STATISTIC_SUCCESS:
      const statistics = action.payload;
      return {
        ...state,
        totalWord: statistics.total,
        reviewCount: statistics.review_count,
        reviewWords: statistics.re_word_count,
        reviewTime: statistics.review_time,
        statistic: convertStatistic(state.statistic, statistics.statistic),
      };
    case types.FETCH_USER_GOAL:
      const data = action.payload;
      return {
        ...state,
        countProficiency: data.count_proficiency,
        maxStreakDay: data.max_streak_day,
        streakDay: data.streak_day,
        countWord: data.count_word,
      };
    case types.UPDATE_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
function convertStatistic(statistics, data) {
  let firstList = [...statistics];
  let columnOne = 0;
  let columnFourAndFive = 0;
  let columnBiggerThanFive = 0;
  data.forEach((item) => {
    if (item.proficiency === 1) {
      columnOne += item.count;
    } else if (item.proficiency === 2) {
      firstList[1].count = item.count;
    } else if (item.proficiency === 3) {
      firstList[2].count = item.count;
    } else if (item.proficiency == 4 || item.proficiency == 5) {
      columnFourAndFive += item.count;
    } else {
      columnBiggerThanFive += item.count;
    }
  });
  firstList[0].count = columnOne;
  firstList[3].count = columnFourAndFive;
  firstList[4].count = columnBiggerThanFive;
  return firstList;
}

function convertDate(date) {
  if (date) {
    const dateObject = new Date(date);
    let day =
      dateObject.getDate() < 10
        ? "0" + dateObject.getDate()
        : dateObject.getDate();

    const month =
      dateObject.getMonth() + 1 < 10
        ? "0" + (dateObject.getMonth() + 1)
        : dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    return day + "/" + month + "/" + year;
  } else {
    return "";
  }
}

function getDayExpire(date) {
  const expiredDayTime = new Date(date).getTime();
  const nowTime = new Date().getTime();
  const diffDay = Math.ceil((expiredDayTime - nowTime) / 86400000);
  return diffDay;
}
