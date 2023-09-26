
import "./style.css";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { Card, CardContent, CircularProgress, styled } from "@mui/material";
import {FriendRequestListCard, SendRequestListCard, FriendListCard} from "../../Components/FriendRequestListCard";
import { useAuthContext } from "../../hooks/useAuthContext";
import { addFriend } from "../../Functions/addFriend";
import { declineFriendRequest } from "../../Functions/declineFriendRequest.js";
import { acceptFriendRequest } from "../../Functions/acceptFriendRequest";
import { useFriendRequests } from "../../Hooks/useFriendRequests";
import { useFriends } from "../../Hooks/useFriends";
import { useSearchFriends } from "../../Hooks/useSearchUsers";
import SearchBar from "@mkyy/mui-search-bar";
import backgroundImage from "./img/movies.jpeg";
import NoResults from "../../Components/NoResults";

// Create Custom Tab Panel Component That uses value to indicate its value

// Create Friends Component that shows list of friends
// Create Requests Component that shows list of requests
// Create Search Component that allows user to send requests
// Add Search Image into the background

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ margin: '0 auto', justifyContent: 'center',
        '& .MuiPaper-root': {
     margin: '10px auto',
        },
        
        }}>
          {children}
        </Box>
      )}
    </div>
  );
}

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
  margin: "0 auto",
  backgroundColor: 'transparent',
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 80,
    maxHeight: 20,
    height: 20,
    width: 80,
    backgroundColor: '#00ff00',
  },
  '& .MuiTabs-flexContainer': {
    display: 'flex',
    justifyContent: 'center',
    margin: "0 auto",
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

    const [reload, setReload] = useState(false);
    const { user } = useAuthContext();
    const [textFieldValue, setTextFieldValue] = useState("");

    const {
      friendRequests,
      isPending: isPendingFriendRequests,
      error: errorFriendRequests,
    } = useFriendRequests(user.username, reload);

    const {
      friends,
      isPending: isPendingFriends,
      error: errorFriends,
  } = useFriends(user.username, reload);

  const {
    searchUsers,
    isPending: isPendingSearchUsers,
    error: errorSearchUsers,
} = useSearchFriends(textFieldValue);

const handleReload = () => {
  setReload(!reload); // Toggle the reload state to trigger re-fetching
};
    // Inspiration: https://mui.com/material-ui/react-tabs/
    return (
      <> 
        <div className="home-container-search">
           
           <div className="background-image-search" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}></div>
           
           <div className="overlay-search"></div>  
           <h1 className="featured-heading">Movies are better with friends.</h1>

          
           <div className="friends-card">
            <div className="friends-card-content"> 
      
          <div className="tab-section">
            
           <StyledTabs
          value={tabIndex}
          onChange={(e, index) => setTabIndex(index)}
        >
        <StyledTab label="Friends"/>
        <StyledTab label="Requests"/>
        <StyledTab label="Add Friend"/>
      </StyledTabs>
      </div>
      <div className = "remainingContent">
      <div className="centralizer">
      <CustomTabPanel {...{className: "full-width"}} value={tabIndex} index={2}>
      <SearchBar
                style={{
                    color: "black",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    margin: "20px auto 10px auto",                
                    zIndex: "999",
                }}
                value={textFieldValue}
                onChange={(newValue) => {
                    setTextFieldValue(newValue);
                }}
                placeholder="Search Username"
            />
        </CustomTabPanel>
        </div>
      <div className="content-section">


      <CustomTabPanel value={tabIndex} index={0}>
                    {errorFriends && <div>{errorFriends}</div>}
                    {isPendingFriends && <div><CircularProgress color="secondary" /></div>}
                    {friends &&
                        friends.map((friend) => {
                            return (
                                <>
                                  <Card sx={{ width: 450, margin: 1.5, background: '#3b3e43', padding: 1.5, boxShadow: 5, borderRadius: 3 }}><FriendListCard username={friend}><></></FriendListCard></Card>
                                </>
                            );
                        })}
        
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={1}>
      {errorFriendRequests && <div>{errorFriendRequests}</div>}
                    {isPendingFriendRequests && <div><CircularProgress color="secondary" /></div>}
                    {friendRequests &&
                        friendRequests.map((friendRequest) => {
                            console.log(friendRequest);
                            return (
                                <>
                                    <Card sx={{ width: 450, margin: 1.5, background: '#3b3e43', padding: 1.5, boxShadow: 5, borderRadius: 3 }}><FriendRequestListCard onDecline={async () => {await declineFriendRequest(user.username, friendRequest); handleReload();}} onAccept={async () => {await acceptFriendRequest(user.username, friendRequest); handleReload();}} username={friendRequest}/></Card>
                                </>
                            );
                        })}
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={2}>
       
      {errorSearchUsers && <div>{errorSearchUsers}</div>}
                {isPendingSearchUsers && <div>Loading...</div>}
                {searchUsers &&
                    searchUsers.map((friend) => {
                        return (
                            <>
                                <Card sx={{ width: 450, margin: 1.5, background: '#3b3e43', padding: 1.5, boxShadow: 5, borderRadius: 3 }}><SendRequestListCard onSend={() => {addFriend(user.username, friend.username); handleReload();}} username={friend.username}/></Card>
                            </>
                        );
                    })}
                    
        
        </CustomTabPanel>

        </div>
        </div>
        </div>
        </div>
       
        </div>
      <NoResults/></>
    );
};

export default Friends;
