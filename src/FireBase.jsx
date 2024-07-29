import { createContext } from "react";
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, GithubAuthProvider, OAuthProvider } from "firebase/auth";
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDESL0tgqR8W7ODhg6ZGfk2ljW26b-GBz4",
  authDomain: "my-app-f3be7.firebaseapp.com",
  projectId: "my-app-f3be7",
  storageBucket: "my-app-f3be7.appspot.com",
  messagingSenderId: "690722258168",
  appId: "1:690722258168:web:0b70c39108ef03ae6a8f0d",
  databaseURL: "https://my-app-f3be7-default-rtdb.firebaseio.com"
};

const fireBaseApp = initializeApp(firebaseConfig);
const fireBaseAuth = getAuth(fireBaseApp);
const fireBaseDB = getDatabase(fireBaseApp);
const googleProvider = new GoogleAuthProvider();
const gitHubProvider = new GithubAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

export const FireBaseContext = createContext(null);

export function FireBaseProvider({ children }) {

  let isSignInInProgress = false;

  function addData(key, data) {
    const dbRef = ref(fireBaseDB, key);
    set(dbRef, data)
      .then(() => {
        console.log("Data Added Successfully! :)");
      })
      .catch((error) => {
        console.error("Error adding data: ", error);
      });
  }

  function signUpUserWithEmailAndPassword(email, password, setEmail, setPassword) {
    createUserWithEmailAndPassword(fireBaseAuth, email, password)
      .then((value) => {
        alert("Congo! Account Created Successfully!:)");
        addData("users/yashika", { email, password });
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  function signInUserWithEmailAndPassword(email, password, setEmail, setPassword) {
    signInWithEmailAndPassword(fireBaseAuth, email, password)
      .then((value) => {
        alert("Congo! Logged In Successfully! :)");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Account Does Not Exist! :(");
        console.log(errorCode, errorMessage);
      });
  }

  function signInWithGoogle() {
    signInWithPopup(fireBaseAuth, googleProvider)
      .then(() => {
        alert("SignedIn With Google Successfully! :)");
      })
      .catch((error) => {
        alert("Failed to sign In! :(");
      });
  }

  function signInWithGitHub() {
    signInWithPopup(fireBaseAuth, gitHubProvider)
      .then(() => {
        alert("SignedIn With GitHub Successfully! :)");
      })
      .catch((error) => {
        alert("Failed to sign In! :(");
      });
  }

  function signInWithMicrosoft() {
    if (isSignInInProgress) return;
    isSignInInProgress = true;

    signInWithPopup(fireBaseAuth, microsoftProvider)
      .then(() => {
        alert("Signed In with Microsoft Successfully!");
      })
      .catch((error) => {
        console.error("Error during Microsoft sign-in: ", error);
        alert(`Failed to sign In: ${error.message}`);
      })
      .finally(() => {
        isSignInInProgress = false;
      });
  }

  function signOutUser(auth) {
    signOut(auth).then(() => {
      alert("Signed Out Successfully! :)");
    }).catch((error) => {
      alert("Failed to sign Out! :(");
    });
  }


  return (
    <FireBaseContext.Provider value={{ signUpUserWithEmailAndPassword, signInUserWithEmailAndPassword, addData, signInWithGoogle, fireBaseAuth, signOutUser, signInWithGitHub, signInWithMicrosoft }}>
      {children}
    </FireBaseContext.Provider>
  );
}
