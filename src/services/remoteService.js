// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, push, set,ref,child, get,update, onValue, off, serverTimestamp} from "firebase/database";
import log from "./logger";

function init() {

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_DATABASEURL,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID
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

