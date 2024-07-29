import React, { useState, useContext, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-number-input/style.css';
import  FireBaseContext  from './FireBase';
import Button from '@mui/material/Button';
import  TextField from '@mui/material';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';


export default function PhoneNumberSignIn() {
  const firebase = useContext(FireBaseContext);
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);
  const [otp, setOTP] = useState("");

  useEffect(() => {
    console.log('Firebase Auth object:', firebase.fireBaseAuth);
    if (!window.recaptchaVerifier && firebase.fireBaseAuth) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            sendOTP();
          },
          'expired-callback': () => {
            console.log('Recaptcha expired');
          }
        },
        firebase.fireBaseAuth
      );
    }
  }, [firebase.fireBaseAuth]);

  const sendOTP = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(firebase.fireBaseAuth, phone, appVerifier);
      setUser(confirmationResult);
      console.log('OTP sent');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const verifyOTP = async () => {
    try {
      const result = await user.confirm(otp);
      console.log('OTP verified', result);
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div className='phone-signin'>
      <div className='phone-content'>
        <PhoneInput
          country={"IN"}
          value={phone}
          onChange={(value) => setPhone(value)}
        />
        <Button
          variant='contained'
          style={{ marginTop: "10px" }}
          onClick={sendOTP}
        >
          Send OTP
        </Button>
        <div id="recaptcha-container" style={{ marginTop: "10px" }}></div>
        <br />
        <TextField
          variant='outlined'
          size="small"
          label="Enter OTP"
          style={{ marginTop: "10px", width: "300px" }}
          value={otp}
          onChange={(evt) => setOTP(evt.target.value)}
        />
        <br />
        <Button
          variant='contained'
          color="success"
          style={{ marginTop: "10px" }}
          onClick={verifyOTP}
        >
          Verify OTP
        </Button>
      </div>
    </div>
  );
}
