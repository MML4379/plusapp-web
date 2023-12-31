import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import '../css/countdown.css';

const ChristmasCountdown = () => {
  const [user] = useAuthState(auth);
  let uid;
  if (user) {
    uid = user.uid;
  }else {
    // eslint-disable-next-line no-unused-vars
    uid = "ANONYMOUS";
  }

  const calculateTimeLeft = () => {
    const now = new Date();
    const newYear = new Date(now.getFullYear() + 1, 0, 1);
    const timeDifference = newYear - now;

    let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown">
      <h2>New Year's Day Countdown</h2>
      <strong>Anyone who made their account before 12/24/2023 has recieved the <span className='mythic-text'>Christmas UI Skin (MYTHIC)</span>! You will recieve a <span className='rare-text'>New Year 2024 Badge (RARE)</span> on 12/31/2023 at 11:59 PM.</strong>
      <p>(January 1, 2024)</p>
      <div className="timer">
        <div className="unit">
          <span className='timeNum'>{timeLeft.days}</span>
          <span className='timeUnit'>Days</span>
        </div>
        <div className="unit">
          <span className='timeNum'>{timeLeft.hours}</span>
          <span className='timeUnit'>Hours</span>
        </div>
        <div className="unit">
          <span className='timeNum'>{timeLeft.minutes}</span>
          <span className='timeUnit'>Minutes</span>
        </div>
        <div className="unit">
          <span className='timeNum'>{timeLeft.seconds}</span>
          <span className='timeUnit'>Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default ChristmasCountdown;