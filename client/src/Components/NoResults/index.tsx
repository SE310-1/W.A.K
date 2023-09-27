import './style.css';
import React from 'react';

// Icon that displays when a search returns no results
function NoResults ({message}) {
    return (
        <>
            <div className="wrapper">
                   <i className="fas fa-search search-icon fa-5x"></i>   
                   <h3>{message}</h3>
            </div>
        </>
    );
}

export default NoResults;