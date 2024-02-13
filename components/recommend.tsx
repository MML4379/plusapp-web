import { db } from '../firebase';
import { getDocs, collection } from 'firebase/firestore';
import ShufflePosts from './postShuffler';

async function loadPosts() {
  try {
    // Query every post from the collection
    const postsQuery = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsQuery); // Create a snapshot for the posts
    const allPosts = postsSnapshot.docs.map((doc) => doc.data()); // Put those posts into a JSON map

    return ShufflePosts(allPosts);
  } catch (error) {
    console.error('Error loading posts:', error);
    throw error;
  }
}

export default loadPosts;