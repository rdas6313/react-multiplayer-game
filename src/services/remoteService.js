// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, push, set,ref,child, get,update, onValue, off, serverTimestamp} from "firebase/database";
import log from "./logger";

function init() {
  const firebaseConfig = {
    apiKey: "AIzaSyBQoXKzKIqTDJ8Ny4jm_0K0lqHAzbVXAmg",
    authDomain: "react-multiplayer-app.firebaseapp.com",
    databaseURL: "https://react-multiplayer-app-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "react-multiplayer-app",
    storageBucket: "react-multiplayer-app.appspot.com",
    messagingSenderId: "922896963519",
    appId: "1:922896963519:web:9525677af42a5c46cd730a",
    measurementId: "G-Y3K6CSB1W9"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
}


function write(path, data) {
  const promise = new Promise(async (resolve, reject) => {
     try {
       const db = getDatabase();
       const thenable = await push(child(ref(db), path),data);
       resolve(thenable.key);
     } catch (error) {
       reject("Something went wrong! Unable to write");
     } 
  });
  return promise;
}

function updateData(path, data) {
  const updates = {};
  updates[path] = data;
  const promise = new Promise(async (resolve, reject) => { 
    try {
      const db = getDatabase();
      await update(ref(db), updates);
      resolve(true);
    } catch (error) {
      log(error);
      reject("Something went wrong! Unable to update.");
    }
  });
  return promise;
}

function readOnce(path) {
  const promise = new Promise(async (resolve, reject) => {
      try {
        const snapshot = await get(child(ref(getDatabase()), path));
        const response = {
          isDataExist: snapshot.exists(),
          value: snapshot.val()
        }
        resolve(response);
      } catch (error) {
        log(error);
        reject("Something went wrong! unable to read.");
      }
  });
  return promise;
}

function addDataChangeEventListener(path, callback) {
  const db = getDatabase();
  const pathRef = ref(db, path);
  onValue(pathRef, (snapshot) => {
    const data = {isDataExist: snapshot.exists(),value:snapshot.val()};
    callback(data);
  });
}

function removeDataChangeEventListener(path) {
  const db = getDatabase();
  const pathRef = ref(db, path);
  off(pathRef);
}

function getServerTimeStamp() {
  return serverTimestamp();
}

export {
  getServerTimeStamp,
  init,
  write,
  updateData,
  readOnce,
  addDataChangeEventListener,
  removeDataChangeEventListener
};

