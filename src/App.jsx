import { onAuthStateChanged } from 'firebase/auth';
import './App.css';
import { FireBaseContext } from './FireBase';
import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TextField from '@mui/material/TextField';

function App() {
  const firebase = useContext(FireBaseContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.fireBaseAuth, (user) => {
      if (user) {
        console.log("You are Logged In!", user);
        setUser(user);
      } else {
        console.log("You are Logged Out!");
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [firebase.fireBaseAuth]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user === null ? (
              <div className="container">
                <h1>Firebase</h1>
                <TextField
                  id="outlined-email"
                  label="Email"
                  variant="outlined"
                  type="email"
                  placeholder="Enter your email here"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <br />
                <TextField
                  id="outlined-password"
                  label="Password"
                  variant="outlined"
                  type="password"
                  placeholder="Enter your password here"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <br />
                <div>
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
                </div>
                <br />
                <button onClick={firebase.signInWithGoogle}>SignIn with Google</button>
                <br />
                <button onClick={firebase.signInWithGitHub}>SignIn with GitHub</button>
                <br />
                <button onClick={firebase.signInWithMicrosoft}>SignIn with Microsoft</button>
                <br />
              </div>
            ) : (
              <div className="container">
                {console.log(user.email)}
                {console.log("hello")}
                <h2 style={{color:"black"}}>Hello!&nbsp;&nbsp;{user.email}&nbsp;:)</h2>
                <button
                  onClick={() => {
                    firebase.signOutUser(firebase.fireBaseAuth);
                  }}
                >
                  Log Out
                </button>
              </div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
