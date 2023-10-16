import FriendModal from "../FriendModal";
import "./style.css";
import React, { useState, useEffect } from "react";

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

function FriendListCard({ username, children, onClick }) {
    return (
        <div className="card" onClick={onClick}>
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
function SendRequestListCard({ username, onSend, status }) {
    return (
        <FriendListCard username={username}>
            <SendRequestButton {...{ onSend, status }} />
        </FriendListCard>
    );
}

export { FriendRequestListCard, SendRequestListCard, FriendListCard };
