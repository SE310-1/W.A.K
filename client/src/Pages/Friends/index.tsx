
import "./style.css";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import React from 'react';
// Shows error for whatever reason
import backgroundImage from "./img/movies.jpeg"; 

// Create Custom Tab Panel Component That uses value to indicate its value

// Create Friends Component that shows list of friends
// Create Requests Component that shows list of requests
// Create Search Component that allows user to send requests
// Add Search Image into the background

const Friends = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    // Inspiration: https://mui.com/material-ui/react-tabs/
    
    return (
        <div className="home-container-search">
           <div className="overlay-search"></div>  
          <h1 style={{width:'100%'}}> Movies are better with friends.</h1>
            <Box sx={{ width: '100%'}}>
      <Tabs
        className="tabs"
        value={tabIndex}
        onChange={(e, index) => setTabIndex(index)}
      >
        <Tab className="tabs" label={'Friends'} />
        <Tab  label={'Incoming Requests'} />
        <Tab  label={'Add Friend'} />
      </Tabs>

    </Box>
        </div>

    );
};

export default Friends;
