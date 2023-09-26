import './style.css'; // Import your CSS file if you have one
import React, { useState } from 'react';

function NoResults () {
    return (
        <>
            <div className="profileImage2">
                   <i className="fas fa-search test fa-5x"></i>   
                   <h3>No Results Found</h3>
            </div>
        </>
    );
}

export default NoResults;