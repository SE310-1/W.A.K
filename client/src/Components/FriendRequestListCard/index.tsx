import './style.css'; // Import your CSS file if you have one
import React from 'react';


function FriendRequestListCard ({username}) {
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
        <div className="circle2">
            <div className="profileImage">
                   <i className="fas fa-x"></i>   
            </div> 
        </div>
        <div className="circle3">
            <div className="profileImage">
                   <i className="fas fa-check"></i>   
            </div> 
        </div>
        </div>
        
    
    </div>
    );
}

const UserList = ({username: String}) => {
    return (
        <div>
             <i className="fas fa-user fa-5x" ></i> Test
        </div>
    );
};

export default FriendRequestListCard;
