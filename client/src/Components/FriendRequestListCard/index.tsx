import "./style.css";
import React, { useState } from "react";

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
function SendRequestButton({ onSend }) {
  const [hasBeenRequested, setHasBeenRequested] = useState(false);
  return (
    <button
      className="actionButton green"
      onClick={() => {
        onSend();
        setHasBeenRequested(true);
      }}
    >
      <div className="icon">
        {hasBeenRequested ? (
          <i className="fas fa-clock"></i>
        ) : (
          <i className="fas fa-plus"></i>
        )}
      </div>
    </button>
  );
}

// Card that Displays Friend Details
function FriendListCard({ username, children }) {
  return (
    <div className="card">
      <div className="profileSection">
        <div className="icon">
          <i className="fas fa-user"></i>
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
function SendRequestListCard({ username, onSend }) {
  return (
    <FriendListCard username={username}>
      <SendRequestButton {...{ onSend }} />
    </FriendListCard>
  );
}

export { FriendRequestListCard, SendRequestListCard, FriendListCard };
