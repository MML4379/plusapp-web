import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import '../css/main.css'
import { useAuthState } from 'react-firebase-hooks/auth';

const MakePost = () => {
    const [postText, setPostText] = useState('');
    const [user] = useAuthState(auth);
    var uid;
  
    const HandlePost = async () => {
      
      if (!user) {
        alert('You cannot post without being logged in. Please log in to continue.');
        return;
      }else {
        uid = user.uid;
      }
  
      if (!postText.trim()) {
        alert('Post text cannot be empty!');
        return;
      }

      var postInfo = {
        details: {
            author: uid,
            text: postText,
            timePosted: serverTimestamp(),
            sponsored: false,
            likes: 0,
            postId: ""
          },
          comments: [],
      }
  
      try {
        // Add the post to the 'posts' collection
        const newPostRef = await addDoc(collection(db, 'posts'), postInfo);
        postInfo.details.postId = newPostRef.id;

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
        placeholder="What are you thinking about?"
        className='smallPostArea'
        maxLength={250}
      />
      <br />
      <button className='plus-button --lg_button --margin8l' onClick={HandlePost}>Post!</button>
    </div>
  );
};

export default MakePost;