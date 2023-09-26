import './style.css'; // Import your CSS file if you have one
import React from 'react';

function NoResults ({message}) {
    return (
        <>
            <div className="profileImage2">
                   <i className="fas fa-search test fa-5x"></i>   
                   <h3>{message}</h3>
            </div>
        </>
    );
}

export default NoResults;