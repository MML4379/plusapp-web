import React from 'react';
import '../css/share.css';

const SharePopup = ({ onClose, onFacebookShare, onTwitterShare, onCopyLink }) => {
  return (
    <div className="customSharePopup">
      <span className="close" onClick={onClose}>&times;</span>
      <h2>Share this post!</h2>
      <button onClick={onFacebookShare}>Facebook</button>
      <button onClick={onTwitterShare}>Twitter</button>
      <button onClick={onCopyLink}>Copy Link</button>
    </div>
  );
};

export default SharePopup;