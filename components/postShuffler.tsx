import { DocumentData } from "firebase/firestore";

/**
 * @description Shuffles an array of posts
 * @param arr The array you want to shuffle
 * @returns The shuffled array
 */
const ShufflePosts = async (arr: DocumentData[]) => {
    for (let i = arr.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [arr[i], arr[j]] = [arr[j], arr[i]]; 
     } 
    return arr; 
}

export default ShufflePosts;