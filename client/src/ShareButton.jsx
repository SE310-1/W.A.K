// eslint-disable-next-line no-unused-vars
import React from 'react';

const ShareButton = () => {
    const shareURL = window.location.href; // Get the current URL

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/share?url=${encodeURIComponent(shareURL)}`, '_blank');
    };

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`, '_blank');
    };

    return (
        <div className="share-button">
            <button onClick={shareOnTwitter}>Share on Twitter</button>
            <button onClick={shareOnFacebook}>Share on Facebook</button>
        </div>
    );
};

export default ShareButton;
// This is the shared button jsx file, where the actual functionality exist
// It will be implemented across App.jsx for actual usage later on