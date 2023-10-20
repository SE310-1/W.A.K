import FriendModal from "../FriendModal";
import "./style.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiKey } from "../../../env";

// Accepts/Declines Friend Requests
function AcceptDeclineButtons({ onAccept, onDecline }) {
  return (
    <>
      <button
        className="actionButton red"
        onClick={() => {
          onDecline();
        }}
      >
        <div className="icon">
          <i className="fas fa-x"></i>
        </div>
      </button>
      <button
        className="actionButton green"
        onClick={() => {
          onAccept();
        }}
      >
        <div className="icon">
          <i className="fas fa-check"></i>
        </div>
      </button>
    </>
  );
}

// Sends Friend Request
function SendRequestButton({ onSend, status }) {
  const [hasBeenRequested, setHasBeenRequested] = useState(status);
  return (
    <>
      {hasBeenRequested ? (
        <button
          className="actionButton blue"
          onClick={() => {
            onSend();
            setHasBeenRequested(true);
          }}
        >
          <div className="icon">
            <i className="fas fa-clock"></i>
          </div>
        </button>
      ) : (
        <button
          className="actionButton green"
          onClick={() => {
            onSend();
            setHasBeenRequested(true);
          }}
        >
          <div className="icon">
            <i className="fas fa-plus"></i>
          </div>
        </button>
      )}
    </>
  );
}
async function getProfilePath(username: string) {
  // Fetch user's proile picture file path
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_API_URL}/${username}/profilePicture`
  );
  const profilePictureID = response.data.profilePicture[0].movieId;

  // Fetch details for each favorite movie
  const profilePictureDetails = await fetch(
    `https://api.themoviedb.org/3/movie/${profilePictureID}?api_key=${apiKey}&language=en-US`
  ).then((response) => response.json());

  return profilePictureDetails.backdrop_path;
}
function FriendListCard({ username, children, onClick }) {
  const [profilePicturePath, setProfilePicturePath] = useState("");

  useEffect(() => {
    getProfilePath(username).then((path) => {
      setProfilePicturePath(path);
    });
  }, [username]);
  return (
    <div className="card" onClick={onClick}>
      <div className="profileSection">
        <div className="profilePicture">
          <img
            src={`https://image.tmdb.org/t/p/w300/${profilePicturePath}`}
            alt={username}
          />
        </div>
      </div>
      <div className="text">{username}</div>
      <div className="right-elements">{children}</div>
    </div>
  );
}

// Card that Displays a Friend Request
function FriendRequestListCard({ username, onAccept, onDecline }) {
  return (
    <FriendListCard username={username}>
      <AcceptDeclineButtons {...{ onAccept, onDecline }} />
    </FriendListCard>
  );
}

// Card that appears in user search, allows them to send a request
function SendRequestListCard({ username, onSend, status }) {
  return (
    <FriendListCard username={username}>
      <SendRequestButton {...{ onSend, status }} />
    </FriendListCard>
  );
}

export { FriendRequestListCard, SendRequestListCard, FriendListCard };
