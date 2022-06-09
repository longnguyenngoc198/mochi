
export const encodeToken = (token) => {
  const secretKey = process.env.REACT_APP_SECRET;
  const firstKey = btoa(secretKey);
  const newToken = firstKey + "@*" + token;
  return newToken;
};
export const decodeToken = (token) => {
  if (token.includes("@*")) {
    const lastToken = token.split("@*")[1];
    return lastToken;
  }
};
export function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
export const setCookie = (cookieName, cookieValue, day) => {
  document.cookie = cookieName + "=; Max-Age=0";
  const valuedCookie = cookieName + "=" + cookieValue;
  const date = new Date();
  date.setTime(+date + day * 86400000);
  document.cookie =
    valuedCookie +
    "; expires=" +
    date.toGMTString() +
    ";"
};
export const getCookie = (cookieName) => {
  const cookieNameArray = document.cookie.split(cookieName + "=");
  if (cookieNameArray.length === 2) {
    return cookieNameArray[1].split(";")[0];
  } else {
    return;
  }
};
export function randomGame() {
  return Math.random() > 0.5 ? 3 : 2;
}

export const japaneseCharacters = [
  "あ",
  "ア",
  "い",
  "イ",
  "う",
  "カ",
  "え",
  "サ",
  "お",
  "タ",
  "か",
  "ナ",
  "き",
  "ハ",
  "く",
  "マ",
  "け",
  "ヤ",
  "こ",
  "ラ",
  "さ",
  "ワ",
  "し",
  "ン",
  "す",
  "ウ",
  "せ",
  "キ",
  "そ",
  "シ",
  "た",
  "チ",
  "ち",
  "ニ",
  "つ",
  "ヒ",
  "て",
  "ミ",
  "と",
  "リ",
  "な",
  "エ",
  "に",
  "ク",
  "ぬ",
  "ス",
  "ね",
  "ツ",
  "の",
  "ヌ",
  "は",
  "フ",
  "ひ",
  "ム",
  "ふ",
  "ユ",
  "へ",
  "ル",
  "ほ",
  "オ",
  "ま",
  "ケ",
  "み",
  "セ",
  "む",
  "テ",
  "め",
  "ネ",
  "も",
  "ヘ",
  "や",
  "メ",
  "ゆ",
  "レ",
  "よ",
  "コ",
  "ら",
  "ソ",
  "り",
  "ト",
  "る",
  "ノ",
  "れ",
  "ホ",
  "ろ",
  "モ",
  "わ",
  "ヨ",
  "を",
  "ロ",
  "ん",
  "ヲ",
];
