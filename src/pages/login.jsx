import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError(error.message);
    }
  };

  const closeErrorPopup = () => {
    // Close the error popup by clearing the error state
    setError(null);
  };

  return (
    <div>
      <h2>Login</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={handleLogin}>Log In</button>

      {error && (
        <div className="hdjiss">
            <h1>Error</h1>
            <p>There was an error validating login information. Try again.</p>
            <button className='plus-button' onClick={closeErrorPopup}>Close</button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;