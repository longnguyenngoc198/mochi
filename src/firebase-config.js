// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, onMessage } from "firebase/messaging";

// DEV
const firebaseConfig = {
  apiKey: "AIzaSyC7Nw4iqitlJgtT2z1VtxaBn9EG_PHCBAo",
  authDomain: "kanji-mochidemy-test.firebaseapp.com",
  projectId: "kanji-mochidemy-test",
  storageBucket: "kanji-mochidemy-test.appspot.com",
  messagingSenderId: "119701880503",
  appId: "1:119701880503:web:26ed121db6abb6f497d732",
  measurementId: "G-VHMJ71YG2S",
};

// Production
// const firebaseConfig = {
//   apiKey: "AIzaSyA7XZFrn_ue3sR8RNfXZdn74F0dle0GMpI",
//   authDomain: "mochien-7880c.firebaseapp.com",
//   projectId: "mochien-7880c",
//   storageBucket: "mochien-7880c.appspot.com",
//   messagingSenderId: "158797874498",
//   appId: "1:158797874498:web:a029802e1da3f7edfdb4db",
//   measurementId: "G-90NXGYPE7C",
// };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export default { messaging, app };
onMessage(messaging,(payload) => {
  console.log('click onMessage');
  console.log({payload});
});