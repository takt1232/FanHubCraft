/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  DialogActions,
  MenuItem,
  Select,
  DialogContent,
  DialogTitle,
  Dialog,
  useMediaQuery,
} from "@mui/material";
import { useSelector } from "react-redux";
import UserImage from "components/UserImage";
import { useTheme } from "@emotion/react";
import FlexBetween from "components/FlexBetween";
import { EditOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ManageUserContent = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 900px)");

  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const [banUser, setBanUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [banDuration, setBanDuration] = useState("");
  const [banReason, setBanReason] = useState("");
  const [banDetails, setBanDetails] = useState("");
  const [bannedUsers, setBannedUsers] = useState([]);

  // Function to handle opening the modal
  const handleOpenModal = (user) => {
    setBanUser(user);
    setOpenModal(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setBanUser(null);
    setBanDuration("");
    setBanReason("");
    setBanDetails("");
    setOpenModal(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to handle banning a user
  const handleBanUser = async (userId) => {
    let durationMilliseconds = 0;

    // Calculate ban duration in milliseconds based on the selected option
    switch (banDuration) {
      case "1 Day":
        durationMilliseconds = 1 * 24 * 60 * 60 * 1000; // 1 day in milliseconds
        break;
      case "3 Days":
        durationMilliseconds = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
        break;
      case "7 Days":
        durationMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        break;
      // Add other cases for different duration options
      default:
        // Handle other cases or no selection if needed
        break;
    }
    const banStart = new Date(); // Get the current date/time as the ban start date
    const banEnd = new Date(banStart.getTime() + durationMilliseconds);

    const requestBody = {
      userId: userId,
      banStart: banStart,
      banEnd: banEnd,
      banReason: banReason,
      banDetails: banDetails,
    };

    const response = await fetch(`http://localhost:3001/users/ban`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to ban user");
    }
    // Add your logic here to perform the ban action
    // Reset the form values after performing the action if needed
    setBanUser(null);
    setBanDuration("");
    setBanReason("");
    setBanDetails("");
    setOpenModal(false); // Close the modal after banning the user
  };

  // Function to fetch banned users and their ban end dates
  const fetchBannedUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/users/banned/user", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const bannedUsersData = await response.json();
        setBannedUsers(bannedUsersData);
      } else {
        throw new Error("Failed to fetch banned users");
      }
    } catch (error) {
      console.error("Error fetching banned users:", error);
    }
  };

  useEffect(() => {
    fetchBannedUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        (
          user.firstName.toLowerCase() +
          " " +
          user.lastName.toLowerCase()
        ).includes(query.toLowerCase()) ||
        user._id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page on new search
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleView = (userId) => {
    navigate(`/profile/${userId}`);
    navigate(0);
  };

  // Function to calculate remaining time for ban countdown
  const calculateTimeRemaining = (userId) => {
    const bannedUser = bannedUsers.find((b_user) => b_user.userId === userId);

    if (bannedUser) {
      const now = new Date().getTime();
      const endTime = new Date(bannedUser.banEnd).getTime();
      const timeRemaining = endTime - now;

      // Check if the ban has already ended
      if (timeRemaining <= 0) {
        return "Ban expired";
      }

      // Calculate days, hours, minutes, seconds
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    return ""; // Return empty string if user is not banned or user ID not found
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="0.5rem"
      padding="1rem"
      ml={isNonMobileScreens ? "320px" : "60px"}
      mt="70px"
    >
      <TextField
        label="Search Users"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: "1rem", width: "300px" }}
      />
      <Box display="flex" flexWrap="wrap" justifyContent="space-between">
        {currentUsers.map((user) => (
          <Card
            key={user._id}
            style={{
              width: "calc(50% - 1rem)", // Adjust the width to fit two columns with a small gap
              marginBottom: "1rem",
              height: "310px",
              boxSizing: "border-box", // Include padding and border in the width calculation
            }}
          >
            <CardContent>
              <Box display="flex" flexDirection="row" gap="0.5rem">
                <UserImage image={user.picturePath} />
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="0.2rem"
                  justifyContent="center"
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Name: {user.firstName + " " + user.lastName}
                  </Typography>
                  <Typography variant="body2" color={medium}>
                    ID: {user._id}
                  </Typography>
                  <Typography variant="body2" color={medium}>
                    Location: {user.location}
                  </Typography>
                </Box>
              </Box>
              {bannedUsers.some((b_user) => b_user.userId === user._id) && (
                <Box>
                  <Typography variant="body2" color="red">
                    Ban Remaining: {calculateTimeRemaining(user._id)}
                  </Typography>
                </Box>
              )}
              <Box p="1rem 0">
                <Typography
                  fontSize="1rem"
                  color={main}
                  fontWeight="500"
                  mb="1rem"
                >
                  Social Profiles
                </Typography>

                <FlexBetween gap="1rem" mb="0.5rem">
                  <FlexBetween gap="1rem">
                    <img src="../../assets/twitter.png" alt="twitter" />
                    <Box>
                      <Typography color={main} fontWeight="500">
                        Twitter
                      </Typography>
                      <Typography color={medium}>Social Network</Typography>
                    </Box>
                  </FlexBetween>
                  <EditOutlined sx={{ color: main }} />
                </FlexBetween>

                <FlexBetween gap="1rem">
                  <FlexBetween gap="1rem">
                    <img src="../../assets/linkedin.png" alt="linkedin" />
                    <Box>
                      <Typography color={main} fontWeight="500">
                        Linkedin
                      </Typography>
                      <Typography color={medium}>Network Platform</Typography>
                    </Box>
                  </FlexBetween>
                  <EditOutlined sx={{ color: main }} />
                </FlexBetween>
              </Box>
              <FlexBetween>
                {/* View Button */}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleView(user._id)}
                >
                  View
                </Button>
                {/* Ban Button */}
                {bannedUsers.some((b_user) => b_user.userId === user._id) ? (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleOpenModal(user)}
                    disabled
                  >
                    Ban
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleOpenModal(user)}
                  >
                    Ban
                  </Button>
                )}
              </FlexBetween>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginTop="1rem"
      >
        {pageNumbers.map((number) => (
          <Button key={number} onClick={() => paginate(number)}>
            {number}
          </Button>
        ))}
      </Box>
      {/* Modal for banning user */}
      {banUser && (
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>User Ban Details</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">
              User Name: {banUser.firstName + " " + banUser.lastName}
            </Typography>
            <Box display="flex" flexDirection="column" gap="1rem">
              {/* Select for Ban Duration */}
              <Select
                value={banDuration}
                onChange={(e) => setBanDuration(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Ban Duration
                </MenuItem>
                <MenuItem value="1 Day">1 Day</MenuItem>
                <MenuItem value="3 Days">3 Days</MenuItem>
                <MenuItem value="7 Days">7 Days</MenuItem>
                {/* Add other duration options */}
              </Select>
              {/* Select for Ban Reason */}
              <Select
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Ban Reason
                </MenuItem>
                <MenuItem value="Violation of Community Guidelines">
                  Violation of Community Guidelines
                </MenuItem>
                <MenuItem value="Inappropriate Behavior">
                  Inappropriate Behavior
                </MenuItem>
                {/* Add other reason options */}
              </Select>
              <Typography variant="subtitle1">Ban Details:</Typography>
              {/* TextField for Ban Details */}
              <TextField
                label="Ban Details"
                variant="outlined"
                multiline
                rows={4}
                value={banDetails}
                onChange={(e) => setBanDetails(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button variant="contained" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleBanUser(banUser._id)}
            >
              Ban User
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ManageUserContent;
