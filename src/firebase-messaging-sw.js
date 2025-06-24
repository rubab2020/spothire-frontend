
// import sdk
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: '526256010844',
});

const messaging = firebase.messaging(); // holds firebase messaging library

// imoortant notes:
// app can have only one worker active at a timeflo