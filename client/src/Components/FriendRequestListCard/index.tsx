import './style.css'; // Import your CSS file if you have one
import React, { useState } from 'react';

function AcceptDeclineButtons ({onAccept, onDecline}) {
    return (
        <>
        <button className="circle2" onClick={() => {onDecline()}}>
            <div className="profileImage">
                   <i className="fas fa-x"></i>   
        </div>
        </button>
        <button className="circle3" onClick={() => {onAccept()}}>
            <div className="profileImage">
                   <i className="fas fa-check"></i>   
            </div> 
        </button>
        </>
    );
}

function SendRequestButton ({onSend}) {
    const [hasBeenRequested, setHasBeenRequested] = useState(false);
    return ( 
        <button className="circle3" onClick={() => {onSend(); setHasBeenRequested(true)}}>
            <div className="profileImage">
                {hasBeenRequested ? (<i className="fas fa-clock" ></i>):(<i className="fas fa-plus" ></i>)}
            </div> 
        </button>
    );
}

function FriendListCard ({username, children}) {
    return (
        <div className = "card">
            <div className="circle">
                <div className="profileImage">
                       <i className="fas fa-user"></i>   
                </div> 
            </div>
            <div className = "text">
                {username}
            </div>
            <div className="right-elements">
            {children}
        </div>
        </div>
        );
}




function FriendRequestListCard ({username, onAccept, onDecline}) {
    return <FriendListCard username={username}><AcceptDeclineButtons {...{onAccept, onDecline}}/></FriendListCard>;
}

function SendRequestListCard({username, onSend}) {

    const requested = false;

    return <FriendListCard username={username}><SendRequestButton {...{onSend}} /></FriendListCard>;
}

export {FriendRequestListCard, SendRequestListCard, FriendListCard};
