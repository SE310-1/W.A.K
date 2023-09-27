import React, { useEffect, useState } from "react";
import "./style.css"; // Import your CSS file if you have one
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faPinterest,
  faWhatsapp,
  faReddit,
} from "@fortawesome/free-brands-svg-icons";

// Define the ShareButtons component
const ShareButtons: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false); // State to track visibility

  // Get the URL, title, and image of the current web page for sharing
  const postUrl = encodeURIComponent(window.location.href);
  const postTitle = document.title;
  const postImgElement = document.querySelector('meta[property="og:image"]');
  const postImg = postImgElement ? postImgElement.getAttribute("content") : "";

  const iconSize = "2x"; // You can adjust the size (e.g., 'lg', '2x', '3x', '4x', '5x', etc.)

  // Generate share links for various social media platforms
  const facebookShareLink = `https://www.facebook.com/sharer.php?u=${postUrl}`;
  const twitterShareLink = `https://twitter.com/share?url=${postUrl}&text=${postTitle}`;
  const pinterestShareLink = `https://pinterest.com/pin/create/bookmarklet/?media=${postImg}&url=${postUrl}&description=${postTitle}`;
  const whatsappShareLink = `https://api.whatsapp.com/send?text=${postTitle} ${postUrl}`;
  const redditShareLink = `https://reddit.com/submit?url=${postUrl}&title=${postTitle}`;

  useEffect(() => {
    // Simulate a delay before showing the share buttons
    const timer = setTimeout(() => {
      setIsVisible(true); // Show the share buttons after the delay
    }, 500); // Adjust the time in milliseconds as needed

    return () => clearTimeout(timer); // Clean up the timeout on unmount
  }, []);

  return (
    <div className={`share-btn-container ${isVisible ? "visible" : ""}`}>
      {/* Create anchor elements for each share button */}
      <a id="facebook-share" href={facebookShareLink}>
        <FontAwesomeIcon icon={faFacebook} size={iconSize} />
      </a>
      <a id="twitter-share" href={twitterShareLink}>
        <FontAwesomeIcon icon={faTwitter} size={iconSize} />
      </a>
      <a id="pinterest-share" href={pinterestShareLink}>
        <FontAwesomeIcon icon={faPinterest} size={iconSize} />
      </a>
      <a id="whatsapp-share" href={whatsappShareLink}>
        <FontAwesomeIcon icon={faWhatsapp} size={iconSize} />
      </a>
      <a id="reddit-share" href={redditShareLink}>
        <FontAwesomeIcon icon={faReddit} size={iconSize} />
      </a>
    </div>
  );
};

export default ShareButtons;
