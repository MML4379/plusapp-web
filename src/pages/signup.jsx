import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { isValid, parse } from 'date-fns';
import { auth, db } from '../firebase';
import '../css/main.css';

const SignUpPage = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [birthday, setBirthday] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const coins = 100;

  document.title = "Sign up for MML+";

  const validateBirthday = () => {
    return isValid(parse(birthday, 'yyyy-MM-dd', new Date()));
  };

  const handleSignUp = async () => {
    try {
      if (!validateBirthday()) {
        alert('Invalid birthday');
        window.location.reload();
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      const userDocRef = doc(db, 'users', uid);
      const joinDate = serverTimestamp();
      await setDoc(userDocRef, {
        handle,
        firstName,
        lastName,
        birthday,
        joinDate,
        coins
      });

      // Check if props.history is available before using it
      if (props.history) {
        // Redirect to the user's profile page upon successful sign-up
        props.history.push(`/profile/${uid}`);
      } else {
        // Fallback to using window.location.replace
        window.location.replace(`/profile/${uid}`);
      }

      // Reset form fields
      setEmail('');
      setPassword('');
      setHandle('');
      setBirthday('');
      setFirstName('');
      setLastName('');
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className='afnjdd'>
      <h2>Sign Up</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <label>Handle:</label>
      <input type="text" value={handle} onChange={(e) => setHandle(e.target.value)} />
      <br />
      <label>First Name:</label>
      <input type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <br />
      <label>Last Name:</label>
      <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <br />
      <label>Birthday:</label>
      <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
      <br />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUpPage;