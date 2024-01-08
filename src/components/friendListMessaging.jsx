import React, { useState, useEffect } from 'react';
import {db} from "../firebase";

const FriendList = ({ currentUserUid, onFriendSelected }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const friendsRef = db.collection('friends');

    const unsubscribe = friendsRef
      .where('userUid', '==', currentUserUid)
      .onSnapshot((snapshot) => {
        const fetchedFriends = snapshot.docs.map((doc) => doc.data().friendUid);
        setFriends(fetchedFriends);
      });

    return () => unsubscribe();
  }, [currentUserUid]);

  return (
    <div>
      <strong>Friends</strong>
      <ul>
        {friends.map((friendUid) => (
          <li key={friendUid} onClick={() => onFriendSelected(friendUid)}>
            {friendUid}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;