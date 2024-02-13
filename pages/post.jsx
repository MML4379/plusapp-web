import React, { useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { auth, db } from '../firebase';
import '../css/main.css'

const PostPage = ({ user }) => {
    const [postText, setPostText] = useState('');
    const navigate = useNavigate();
  
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
  
      try {
        // Add the post to the 'posts' collection
        const newPostRef = await addDoc(collection(db, 'posts'), {
          details: {
            author: user.uid,
            text: postText,
            timePosted: serverTimestamp(),
            visibility: 'public',
            sponsored: false,
            likes: 0,
            views: 0,
            comments: 0,
          },
          comments: [],
        });
  
        // Update the user's coin count
        await setDoc(doc(db, 'users', user.uid), {
          coins: user.coins + 5,
        }, { merge: true });
  
        alert('Post successful!');
        setPostText('');
  
        // Redirect to the dedicated post page
        navigate(`/post/${newPostRef.id}`);
      } catch (error) {
        console.error('Error posting:', error.message);
        alert('Error posting. Please try again.');
      }
  };

  return (
    <div className='fvdual'>
      <h1>Create a Post</h1>
      <textarea
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder="What are you thinking? (MAX 100 CHARACTERS)"
        className='postArea'
        maxLength={100}
      />
      <br />
      <button onClick={handlePost}>Post</button>
    </div>
  );
};

export default PostPage;