import { onAuthStateChanged } from 'firebase/auth';
import './App.css';
import { FireBaseContext } from './FireBase';
import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PhoneNumberSignIn from './PhoneNumberSignIn';

function App() {
  const firebase = useContext(FireBaseContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(firebase.fireBaseAuth, (user) => {
      if (user) {
        console.log("You are Logged In!");
        console.log(user);
        setUser(user);
      } else {
        console.log("You are Logged Out!");
        setUser(null);
      }
    });
  }, [firebase.fireBaseAuth]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user === null ? (
              <>
                <h1>Firebase</h1>
                <label>Email:&nbsp;&nbsp;</label>
                <input
                  type="email"
                  placeholder=" enter your email here"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <br /><br />
                <label>Password:&nbsp;&nbsp;</label>
                <input
                  type="password"
                  placeholder=" enter your password here"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <br /><br />
                <button
                  onClick={() => {
                    firebase.signUpUserWithEmailAndPassword(
                      email,
                      password,
                      setEmail,
                      setPassword
                    );
                  }}
                >
                  SignUp User
                </button>
                &nbsp;&nbsp;
                <button
                  onClick={() => {
                    firebase.signInUserWithEmailAndPassword(
                      email,
                      password,
                      setEmail,
                      setPassword
                    );
                  }}
                >
                  SignIn With Me
                </button>
                <br /><br />
                <button onClick={firebase.signInWithGoogle}>SignIn with Google</button>
                <br /><br />
                <button onClick={firebase.signInWithGitHub}>SignIn with GitHub</button>
                <br /><br />
                <button onClick={firebase.signInWithMicrosoft}>SignIn with Microsoft</button>
                <br></br>
                <Link to="/phone-signin">
                  <button>SignIn with Phone Number</button>
                </Link>
              </>
            ) : (
              <>
                <h2>Hello!&nbsp;&nbsp;{user.email}</h2>
                <button
                  onClick={() => {
                    firebase.signOutUser(firebase.fireBaseAuth);
                  }}
                >
                  Log Out
                </button>
              </>
            )
          }
        />
        <Route path="/phone-signin" element={<PhoneNumberSignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
