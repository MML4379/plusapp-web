import React, { useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import '../css/main.css'

const MakePost = () => {
    const [postText, setPostText] = useState('');
  
    const handlePost = async () => {
      const user = auth.currentUser; // Get the current user
  
      if (!user) {
        alert('User not authenticated. Please log in.');
        return;
      }
  
      if (!postText.trim()) {
        alert('Post text cannot be empty!');
        return;
      }

      const postInfo = {
        details: {
            author: user.uid,
            text: postText,
            timePosted: serverTimestamp(),
            visibility: 'public',
            sponsored: false,
            likes: 0,
            approves: 0,
            views: 0,
            comments: 0,
            postId: ""
          },
          comments: [],
      }
  
      try {
        // Add the post to the 'posts' collection
        const newPostRef = await addDoc(collection(db, 'posts'), postInfo);
        postInfo.details.postId = newPostRef.id;
  
        // Update the user's coin count
        await setDoc(doc(db, 'users', user.uid), {
          coins: user.coins + 5,
        }, { merge: true });
  
        alert('Post successful!');
        setPostText('');
  
        window.location.replace(`/post/${newPostRef.id}`);
      } catch (error) {
        console.error('Error posting:', error.message);
        alert('Error posting. Please try again.');
      }
  };

  return (
    <div className='fcdual'>
      <textarea
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder="Wow, @notmml really did deck the halls here!"
        className='smallPostArea'
        maxLength={250}
      />
      <br />
      <button className='plus-button --lg_button --margin8l' onClick={handlePost}>Post!</button>
    </div>
  );
};

export default MakePost;