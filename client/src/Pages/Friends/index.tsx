// Importing necessary dependencies and components
import "./style.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { Card, CardContent, CircularProgress, styled } from "@mui/material";
import {
  FriendRequestListCard,
  SendRequestListCard,
  FriendListCard,
} from "../../Components/FriendRequestListCard";
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

// Interface definitions
interface PanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface StyleProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

// TabPanel component for rendering tab content
function TabPanel(props: PanelProps) {
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
        <Box
          sx={{
            "& .MuiPaper-root": {
              margin: "10px auto",
            },
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

// Styles for the Tabs and Tab components
const tabsStyleAttributes = {
  margin: "0 auto",
  backgroundColor: "transparent",
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 80,
    maxHeight: 20,
    height: 20,
    width: 80,
    backgroundColor: "#00ff00",
  },
  "& .MuiTabs-flexContainer": {
    display: "flex",
    justifyContent: "center",
    margin: "0 auto",
  },
};

// StyledTabs component
const StyledTabs = styled((props: StyleProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))(tabsStyleAttributes);

// StyledTab component
const StyledTab = styled((props: { label: string }) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  boxShadow: "none",
  textTransform: "none",
  fontWeight: "bold",
  fontSize: "20px",
  color: "rgba(255, 255, 255, 0.7)",
  "&.Mui-selected": {
    color: "#fff",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
  "&:not(:first-of-type)": {
    "&:before": {
      content: '" "',
      position: "absolute",
      left: 0,
      display: "block",
      height: 20,
      width: 1,
      zIndex: 1,
      backgroundColor: "grey",
    },
  },
}));

// Common card styles
const commonCardStyles = {
  width: 450,
  margin: 1.5,
  background: "#3b3e43",
  padding: 1.5,
  boxShadow: 5,
  borderRadius: 3,
};

// Friends component
const Friends = () => {
  // State and context variables
  const [tabIndex, setTabIndex] = React.useState(0);
  const [reload, setReload] = useState(false);
  const { user } = useAuthContext();
  const [textFieldValue, setTextFieldValue] = useState("");

  // Custom hooks for fetching friend requests, friends, and searching users
  const {
    incoming,
    outgoing,
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

  // Function to trigger reloading of data
  const handleReload = () => {
    setReload(!reload); // Toggle the reload state to trigger re-fetching
  };

  const pending =
    isPendingFriendRequests || isPendingFriendRequests || isPendingSearchUsers;
  const allDefined = friends && searchUsers && incoming && outgoing;

  return (
    <>
      <div className="home-container-search">
        <div
          className="background-image-search"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        <div className="overlay-search"></div>
        <div className="friends-wrapper">
          <h1 className="featured-heading">Movies are better with friends.</h1>

          <div className="friends-card">
            <div className="friends-card-content">
              <div className="tab-section">
                <StyledTabs
                  value={tabIndex}
                  onChange={(e, index) => {
                    setTabIndex(index);
                    handleReload();
                  }}
                >
                  <StyledTab label="Friends" />
                  <StyledTab label="Requests" />
                  <StyledTab label="Add Friend" />
                </StyledTabs>
              </div>
              <div className="remainingContent">
                <div className="centralizer">
                  <TabPanel value={tabIndex} index={2}>
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
                  </TabPanel>
                </div>
                <div
                  className={`content-section ${
                    tabIndex == 2 ? `` : `long-section`
                  }`}
                >
                  <TabPanel value={tabIndex} index={0}>
                    {errorFriends ? (
                      <div>{errorFriends}</div>
                    ) : (
                      <>
                        {isPendingFriends ? (
                          <div>
                            <CircularProgress color="secondary" />
                          </div>
                        ) : (
                          <>
                            {friends && friends.length ? (
                              friends.map((friend) => {
                                return (
                                  <>
                                    <Card sx={commonCardStyles}>
                                      <FriendListCard username={friend}>
                                        <></>
                                      </FriendListCard>
                                    </Card>
                                  </>
                                );
                              })
                            ) : (
                              <NoResults message={"No Friends :("} />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </TabPanel>
                  <TabPanel value={tabIndex} index={1}>
                    {errorFriendRequests ? (
                      <div>{errorFriendRequests}</div>
                    ) : (
                      <>
                        {isPendingFriendRequests ? (
                          <div>
                            <CircularProgress color="secondary" />
                          </div>
                        ) : (
                          <>
                            {incoming && incoming.length ? (
                              incoming.map((friendRequest) => {
                                return (
                                  <>
                                    <Card sx={commonCardStyles}>
                                      <FriendRequestListCard
                                        onDecline={async () => {
                                          await declineFriendRequest(
                                            user.username,
                                            friendRequest
                                          );
                                          handleReload();
                                        }}
                                        onAccept={async () => {
                                          await acceptFriendRequest(
                                            user.username,
                                            friendRequest
                                          );
                                          handleReload();
                                        }}
                                        username={friendRequest}
                                      />
                                    </Card>
                                  </>
                                );
                              })
                            ) : (
                              <NoResults message={"No Friend Requests"} />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </TabPanel>
                  <TabPanel value={tabIndex} index={2}>
                    {errorSearchUsers ? (
                      <div>{errorSearchUsers}</div>
                    ) : (
                      <>
                        {pending ? (
                          <div>
                            <CircularProgress color="secondary" />
                          </div>
                        ) : (
                          <>
                            {allDefined && searchUsers.length ? (
                              searchUsers
                                .filter(
                                  (user1) => !(friends.includes(user1.username) || user.username ===user1.username)
                                )
                                .map((friend) => {
                                  const status = outgoing.includes(
                                    friend.username
                                  )
                                  return (
                                    <>
                                      <Card sx={commonCardStyles}>
                                        <SendRequestListCard
                                          onSend={() => {
                                            addFriend(
                                              user.username,
                                              friend.username
                                            );
                                            handleReload();
                                          }}
                                          username={friend.username}
                                          status={status}
                                        />
                                      </Card>
                                    </>
                                  );
                                })
                            ) : (
                              <NoResults message={"No Results"} />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </TabPanel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Friends;
