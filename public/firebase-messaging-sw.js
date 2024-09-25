importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAWk0pfI3SaUFnZo5vZoUVN8qC9Iq_gl1g",
  authDomain: "task-management-app-507ed.firebaseapp.com",
  projectId: "task-management-app-507ed",
  storageBucket: "task-management-app-507ed.appspot.com",
  messagingSenderId: "71925330979",
  appId: "1:71925330979:web:28c17983033c00013d6d96",
  measurementId: "G-N4H06N05TN",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/path/to/icon.png' // Replace with your app's icon path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
});
