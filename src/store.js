import { createStore, combineReducers, compose } from "redux";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import firebase from "firebase";
import "firebase/firestore";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
import notifyReducer from "./reducers/notifyReducer";
import settingsReducer from "./reducers/settingsReducer";
// reducer @todo

const firebaseConfig = {
  apiKey: "AIzaSyDQTeFuzcykzTO0sWuKSLZlXH3OzAfTkSg",
  authDomain: "clientpanel-5d267.firebaseapp.com",
  databaseURL: "https://clientpanel-5d267.firebaseio.com",
  projectId: "clientpanel-5d267",
  storageBucket: "clientpanel-5d267.appspot.com",
  messagingSenderId: "155067317612"
};

// react redux firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

// init firebase
firebase.initializeApp(firebaseConfig);
// init firestore
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// add redux firebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase)
)(createStore);

// add root reducer
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer,
  settings: settingsReducer
});

//check fo settings in local storage

if (localStorage.getItem("settings") == null) {
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };

  //set to localstorage
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

// create init state
const initialState = { settings: JSON.parse(localStorage.getItem("settings")) };

// create store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
