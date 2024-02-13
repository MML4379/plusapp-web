import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db as firestore } from '../firebase';

const FriendList = ({ currentUserUid, onFriendSelected }) => {
  const friendsRef = collection(firestore, `users/${currentUserUid}/friends`);
  const friendsQuery = query(friendsRef);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(friendsQuery, (snapshot) => {
      const fetchedFriends = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFriends(fetchedFriends);
    });

    return () => unsubscribe();
  }, [currentUserUid, friendsQuery]);

  return (
    <div>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} onClick={() => onFriendSelected(friend.friendUid)}>
            {friend.friendUid}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;