
import "./style.css";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import React from 'react';
import { Card, CardContent, CircularProgress, styled } from "@mui/material";
import UserListCard from "../../Components/FriendRequestListCard";
import FriendRequestListCard from "../../Components/FriendRequestListCard";
// Shows error for whatever reason
 

// Create Custom Tab Panel Component That uses value to indicate its value

// Create Friends Component that shows list of friends
// Create Requests Component that shows list of requests
// Create Search Component that allows user to send requests
// Add Search Image into the background

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan"
     /> }}
  />
))({
  backgroundColor: 'black',
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 80,
    maxHeight: 20,
    width: '100%',
    height:'100%',
    backgroundColor: '#00ff00',
  },
});

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({

  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '20px',
  marginRight: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: '#fff',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
  '&:not(:first-of-type)': {
    '&:before': {
      content: '" "',
      position: 'absolute',
      left: 0,
      display: 'block',
      height: 20,
      width: 1,
      zIndex: 1,
      backgroundColor: 'grey',
    },
  },
}));

const Friends = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    const friends = [
      {
      username: "Sam"
    },
    {
      username: "Luca"
    },
    {
      username: "Kenny"
    },
    {
      username: "Vishva"
    },
    {
      username: "Alex"
    },
  ];

    // Inspiration: https://mui.com/material-ui/react-tabs/
    return (
        <div className="home-container-search">
           <div className="overlay-search"></div>  
           <h1 className="featured-heading">Movies are better with friends.</h1>
           <div className="friends-card">
           <Box className = "tabs">
           <StyledTabs
          value={tabIndex}
          onChange={(e, index) => setTabIndex(index)}
        >
        <StyledTab label="Friends"/>
        <StyledTab label="Requests"/>
        <StyledTab label="Add Friend"/>
      </StyledTabs>
      {friends.map(user => 
      <Card sx={{ minWidth: 325, margin: 1.5, background: '#3b3e43', padding: 1.5, boxShadow: 5, borderRadius: 3 }}><FriendRequestListCard username={user.username} /></Card>
      )}
      <CircularProgress color="secondary" />
    </Box>     
            </div> 
        </div>
    );
};

export default Friends;
