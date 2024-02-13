/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { signOut, updatePassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadBytes } from 'firebase/storage';

export const UserSettings = () => {
    const [user] = useAuthState(auth);
    const [userData, setUserData] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [handle, setHandle] = useState('');
    const [bio, setBio] = useState('');
    const [profileImg, setProfileImg] = useState(null);
    const [allowNotifs, setAllowNotifis] = useState(null);
    const [email, setEmail] = useState("");
    const [authMethods, setAuthMethods] = useState([]);

    useEffect(() => {
        const GetUserData = async () => {
            try {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    setUserData(userDoc.data())
                    setFirstName(userData.firstName);
                    setLastName(userData.lastName);
                    setHandle(userData.handle);
                    setBio(userData.bio);
                    setAllowNotifis(userData.notifs);
                    setEmail(user.email || "noEmailAvail");
                }else {
                    alert("You need to be logged into an active account to use this feature.");
                    window.location.replace("/login");
                }
            } catch (error) {
                console.error("Error getting your data: ", error);
            }    
        }
        GetUserData();
    });

    const handleNotificationSettingChange = () => {
        if (!("Notification" in window)) {
            // Check if the browser supports notifications
            alert("This browser does not support desktop notifications!");
        } else if (Notification.permission === "granted") {
            const notification = new Notification("Notifications are already enabled! You will need to disable them via website settings for now.");
        } else if (Notification.permission !== "denied") {
            // We need to ask the user for permission
            Notification.requestPermission().then((permission) => {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    const notification = new Notification("Hey, it's MML+! You will now be notified of activity in MML+ in the future.");
                }
            });
        }
    }

    const actionCodeSettings = {

    };

    const handlePasswordReset = async () => {
        
    }

    return(
        <div className='userSettingsPage'>
            <h1>MML+ Settings</h1>
            <strong>Settings for {firstName} {lastName} ({email})</strong>
            <div className='space'></div>
            <article className='settings-section'>
                <section name="ClientSettings">
                    <h2>Client Settings</h2>
                    <input type='checkbox' name='BrightnessMode' defaultChecked />
                    <label for="BrightnessMode">Dark mode</label>
                    <div className='smallSpace'></div>
                    <input type='checkbox' name="Notifications" onChange={() => {handleNotificationSettingChange()}} />
                    <label for="Notifications">Allow Notifications</label>
                </section>
                <div className='space'></div>
                <section name="Authentication">
                    <h2>Authentication</h2>
                    <p>You're currently signed in as {handle} under {email}.</p>
                    <div className='smallSpace'></div>
                    <button className='plus-button' onClick={() => {signOut(auth); window.location.href="/";}}>Sign Out</button>
                    <div className='smallSpace'></div>
                    <button className='plus-button' onClick={() => {}}>Reset my Password</button>
                </section>
            </article>
        </div>
    )
}