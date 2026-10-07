import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbV6TuYqSLBxt4mI2Zzus3onvnXaXhGoI",
  authDomain: "ems-programming-club.firebaseapp.com",
  projectId: "ems-programming-club",
  storageBucket: "ems-programming-club.firebasestorage.app",
  messagingSenderId: "203984483228",
  appId: "1:203984483228:web:4c21045fd2567149c78e59"
};

const VAPID_KEY = "BJy9-3lYbONud5DEa1_Ga6EF58UGeickptqia54AdS-JQzKHHKZs41GwLBY50AvY_pyfBCaDwAGYxo5JEK2FHGM";
const PORTAL_API = "https://emspc-portal.emspc.workers.dev"; // set after first deploy

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const notifyBtn = document.getElementById("notify-btn");

function updateButtonState() {
  if (!notifyBtn) return;
  if (Notification.permission === "granted") {
    notifyBtn.textContent = "Notifications On";
    notifyBtn.classList.add("active");
    notifyBtn.disabled = true;
  } else if (Notification.permission === "denied") {
    notifyBtn.textContent = "Notifications Blocked";
    notifyBtn.disabled = true;
  } else {
    notifyBtn.textContent = "Enable Notifications";
    notifyBtn.disabled = false;
  }
}

const FCM_SW_SCOPE = "/firebase-cloud-messaging-push-scope";
const SUB_KEY = "emspc_fcm_sub";
const SUB_TTL = 7 * 24 * 3600 * 1000;

// Firebase gets its own scope so /service-worker.js (scope "/") cannot replace it
async function getFcmRegistration() {
  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: FCM_SW_SCOPE });
  const sw = registration.installing || registration.waiting || registration.active;
  if (sw && sw.state !== "activated") {
    await new Promise((resolve) => {
      sw.addEventListener("statechange", () => { if (sw.state === "activated") resolve(); });
    });
  }
  return registration;
}

// Get this device FCM token and register it with the portal Worker (announcements topic)
async function subscribeDevice() {
  const registration = await getFcmRegistration();
  const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
  if (!token) return;

  try {
    const last = JSON.parse(localStorage.getItem(SUB_KEY) || "null");
    if (last && last.token === token && Date.now() - last.t < SUB_TTL) return; // already subscribed recently
  } catch (e) { /* storage unavailable */ }

  const res = await fetch(PORTAL_API + "/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  });
  if (!res.ok) {
    console.warn("Push subscribe failed:", res.status);
    return;
  }
  try { localStorage.setItem(SUB_KEY, JSON.stringify({ token, t: Date.now() })); } catch (e) { /* ignore */ }
}

async function enableNotifications() {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    console.warn("Push notifications not supported in this browser.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    updateButtonState();
    if (permission !== "granted") return;
    await subscribeDevice();
  } catch (err) {
    console.error("Error enabling notifications:", err);
  }
}

if (notifyBtn) {
  notifyBtn.addEventListener("click", enableNotifications);
  updateButtonState();
}

// Handle messages received while the site is open/foreground
onMessage(messaging, (payload) => {
  const title = payload.notification?.title || "EMS CS Club";
  const body = payload.notification?.body || "";
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "icons/icon-192.png" });
  }
});

// Permission was already granted on an earlier visit: make sure this device is subscribed
if ("Notification" in window && "serviceWorker" in navigator && Notification.permission === "granted") {
  subscribeDevice().catch((err) => console.error("Re-subscribe failed:", err));
}
