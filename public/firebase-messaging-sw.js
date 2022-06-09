// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("../firebase-messaging-sw.js")
//     .then(function (registration) {
//       console.log("Registration successful, scope is:", registration.scope);
//     })
//     .catch(function (err) {
//       console.log("Service worker registration failed, error:", err);
//     });
// }

 // Scripts for firebase and firebase messaging
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

 // Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyC7Nw4iqitlJgtT2z1VtxaBn9EG_PHCBAo",
  authDomain: "kanji-mochidemy-test.firebaseapp.com",
  projectId: "kanji-mochidemy-test",
  storageBucket: "kanji-mochidemy-test.appspot.com",
  messagingSenderId: "119701880503",
  appId: "1:119701880503:web:26ed121db6abb6f497d732",
  measurementId: "G-VHMJ71YG2S",
};


 firebase.initializeApp(firebaseConfig);

 // Retrieve firebase messaging
 const messaging = firebase.messaging();
 self.notificationId = null
 messaging.onBackgroundMessage(function(payload) {
   console.log("Received background message ", payload);
   
   const notificationTitle = payload.notification.title;
   self.notificationId = payload.data.id;
   const notificationOptions = {
     body: payload.notification.body,
   };

   self.registration.showNotification(notificationTitle, notificationOptions);
 });
self.addEventListener("notificationclick",async function (event) {
  console.log({event})
  event.notification.close();
  console.log({ self });
  console.log("click notification", self.notificationId);
  async function clickNotification() {
    await fetch("https://mochian-test.akira.edu.vn/v3.0/open-notification", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: self.notificationId,
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log({ res }));
  }
  await clickNotification();
  // event.waitUntil(clickNotification);
  // Do something as the result of the notification click
});