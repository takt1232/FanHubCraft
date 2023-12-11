/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useSelector } from "react-redux";
import UserImage from "components/UserImage";
import { useTheme } from "@emotion/react";
import FlexBetween from "components/FlexBetween";
import { useNavigate } from "react-router-dom";
import DialogMessage from "components/DialogMessage";
import YesNoDialogMessage from "components/YesNoDialogMessage";

const ManagePostContent = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 900px)");

  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [originalList, setOriginalList] = useState([]);
  const [filterType, setFilterType] = useState("Post");
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const indexOfLastUser = currentPage * postsPerPage;
  const indexOfFirstUser = indexOfLastUser - postsPerPage;
  const currentFiltered = filtered.slice(indexOfFirstUser, indexOfLastUser);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [postDeleteId, setPostDeleteId] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(false);

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setOpenDeleteModal(false);
    setDeleteStatus(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const deletePost = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postDeleteId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const result = await response.json();
    setDeleteStatus(true);
  };

  const mergeUserAndPostInfo = async () => {
    try {
      const users = await fetchUsers();
      const posts = await fetchPosts();

      // Create a new array by merging user and post information
      const mergedList = users.flatMap((user) => {
        const userPosts = posts.filter((post) => post.userId === user._id);
        return userPosts.map((post) => ({
          name: `${user.firstName} ${user.lastName}`,
          userId: user._id,
          userPicturePath: user.picturePath,
          postPicturePath: post.picturePath,
          location: user.location,
          postId: post._id,
          description: post.description,
          tags: post.tags,
        }));
      });

      setFiltered(mergedList);
      setOriginalList(mergedList);
    } catch (error) {
      setFiltered([]); // Return an empty array in case of an error
      setOriginalList([]); // Return an empty array in case of an error
    }
  };

  useEffect(() => {
    mergeUserAndPostInfo();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filterResult = originalList.filter(
      (result) =>
        result.name.toLowerCase().includes(query.toLowerCase()) ||
        result.userId.toLowerCase().includes(query.toLowerCase()) ||
        result.postId.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        (result.tags && result.tags.some((tag) => tag.toLowerCase() === query))
    );

    setFiltered(filterResult);
    setCurrentPage(1); // Reset to first page on new search
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filtered.length / postsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleView = (postId) => {
    navigate(`/admin/view/post/${postId}`);
    navigate(0);
  };

  const handleOpenDeleteModal = (postId) => {
    setOpenDeleteModal(true);
    setPostDeleteId(postId);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        gap="0.5rem"
        padding="1rem"
        ml={isNonMobileScreens ? "320px" : "60px"}
        mt="70px"
      >
        <TextField
          label="Search Post"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: "1rem", width: "300px" }}
        />
        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          {currentFiltered.map((filter) => (
            <Card
              key={filter.postId}
              style={{
                width: "calc(50% - 1rem)",
                marginBottom: "1rem",
                height: "380px",
                boxSizing: "border-box",
              }}
            >
              <CardContent>
                <Box display="flex" flexDirection="row" gap="0.5rem">
                  <UserImage image={filter.userPicturePath} />
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="0.2rem"
                    justifyContent="center"
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      Name: {filter.name}
                    </Typography>
                    <Typography variant="body2" color={medium}>
                      ID: {filter.userId}
                    </Typography>
                    <Typography variant="body2" color={medium}>
                      Location: {filter.location}
                    </Typography>
                  </Box>
                </Box>
                <Box p="1rem 0" height="130px" overflow="hidden">
                  <Typography fontSize="1rem" color={main} fontWeight="500">
                    POST
                  </Typography>
                  <Typography variant="body2" color={medium}>
                    PostId: {filter.postId}
                  </Typography>
                  <Typography variant="body2" color={medium}>
                    Description: {filter.description}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="center"
                  width="100%"
                  height="100%"
                >
                  <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    p="1rem"
                    width="100px"
                    height="100px"
                  >
                    <img
                      src={`http://localhost:3001/assets/${filter.postPicturePath}`}
                      alt="Uploaded"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                </Box>
                <FlexBetween style={{ mt: "1rem" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleView(filter.postId)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleOpenDeleteModal(filter.postId)}
                  >
                    Delete
                  </Button>
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
      </Box>
      <DialogMessage
        open={deleteStatus}
        handleClose={handleCloseModal}
        title="Delete Success"
        content="The post was successfully deleted"
      />
      <YesNoDialogMessage
        open={openDeleteModal}
        handleClose={handleCloseModal}
        handleNo={handleCloseModal}
        handleYes={deletePost}
        title="Delete Post"
        content="Do you want to delete this post?"
      />
    </>
  );
};

export default ManagePostContent;
