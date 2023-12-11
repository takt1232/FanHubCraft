/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Divider,
  InputBase,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";
import { ImageOutlined } from "@mui/icons-material";
import { setPosts } from "state";
import DialogMessage from "components/DialogMessage";

const EditPostWidget = ({ postId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [postEdit, setPostEdit] = useState("");
  const [postData, setPostData] = useState(null);
  const [loadingAnimation, setLoadingAnimation] = useState(true);
  const theme = useTheme();
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const [image, setImage] = useState(null);
  const [uploadedPicturePath, setUploadedPicturePath] = useState(null);
  const [isPostSuccessDialogOpen, setIsPostSuccessDialogOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const getPost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPostData(data);
      setPostEdit(data.description);
      setLoadingAnimation(false); // Stop the loading animation
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleImageSelectEdit = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const formData = new FormData();
      formData.append("picture", file);
      formData.append("picturePath", file.name);

      const response = await fetch(`http://localhost:3001/upload/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        // You might need to handle progress events here
      });

      if (response.ok) {
        // Handle successful upload, update UI with the uploaded image
        const uploadedImage = await response.json();
        setUploadedPicturePath(uploadedImage);
        setLoading(false);
      }
    }
  };

  const handlePostEdit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Extract tags from the post description
      const extractedTags = postEdit.match(/#[a-zA-Z0-9]+/g);
      if (extractedTags) {
        const cleanedTags = extractedTags.map((tag) => tag.slice(1)); // Remove "#" symbol
        formData.append("tags", JSON.stringify(cleanedTags)); // Send tags as a JSON string
      }

      formData.append("description", postEdit);
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }

      const response = await fetch(
        `http://localhost:3001/posts/${postId}/update`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (response.ok) {
        // Fetch the updated list of posts after editing
        const updatedResponse = await fetch(`http://localhost:3001/posts`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (updatedResponse.ok) {
          const updatedPosts = await updatedResponse.json();
          dispatch(setPosts({ posts: updatedPosts }));
          setIsPostSuccessDialogOpen(true);
          setLoading(false);
        } else {
          console.error("Error fetching updated posts");
          setLoading(false);
        }
      } else {
        console.error("Error editing post");
        setLoading(false);
      }
    } catch (err) {
      console.log("Error: ", err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  const handleClosePostSuccessDialog = () => {
    setIsPostSuccessDialogOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    // Create an interval to toggle the loading animation
    const interval = setInterval(() => {
      setLoadingAnimation((prev) => !prev);
    }, 200); // Change the value to set the interval duration

    // Clear the interval when component unmounts or when the data fetching is done
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {!postData && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          borderRadius="10px"
          width="400px"
          height="auto"
          backgroundColor={theme.palette.background.alt}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            marginBottom="1rem"
          >
            <Typography>Loading Please wait...</Typography>
            {loadingAnimation ? (
              <HourglassTopIcon color="primary" fontSize="large" />
            ) : (
              <HourglassBottomIcon color="primary" fontSize="large" />
            )}
          </Box>
        </Box>
      )}
      {postData && (
        <>
          <WidgetWrapper>
            <Typography fontSize="1rem">Edit Post</Typography>
            <FlexBetween gap="1rem">
              <Typography fontSize="1rem" color={medium}>
                Description:
              </Typography>
              <InputBase
                placeholder="Description"
                onChange={(e) => setPostEdit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setPostEdit((prevPost) => prevPost + "\n");
                  }
                }}
                value={postEdit}
                sx={{
                  width: "100%",
                  backgroundColor: "2rem",
                  borderRadius: "2rem",
                }}
                multiline
              />
            </FlexBetween>
            <Box
              display="flex"
              justifyContent="center"
              width="100%"
              height="100%"
            >
              <Box
                border={`1px solid ${medium}`}
                borderRadius="5px"
                mt="1rem"
                p="1rem"
                width="200px"
                height="200px"
              >
                {uploadedPicturePath ? (
                  <img
                    src={`http://localhost:3001/assets/${uploadedPicturePath}`}
                    alt="Uploaded"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : postData.picturePath ? (
                  <img
                    src={`http://localhost:3001/assets/${postData.picturePath}`}
                    alt="Uploaded"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                  >
                    <Typography>No Picture</Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Divider sx={{ margin: "1.25rem 0" }} />

            <FlexBetween>
              <label htmlFor="upload-image-edit" style={{ cursor: "pointer" }}>
                <FlexBetween gap="0.25rem">
                  <ImageOutlined sx={{ color: mediumMain }} />
                  <Typography
                    color={mediumMain}
                    sx={{
                      "&:hover": { cursor: "pointer", color: medium },
                    }}
                  >
                    Image
                  </Typography>
                </FlexBetween>
              </label>
              <input
                id="upload-image-edit"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageSelectEdit}
                style={{ display: "none" }}
              />

              <Button
                disabled={!postEdit}
                onClick={handlePostEdit}
                sx={{
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main,
                  borderRadius: "3rem",
                }}
              >
                EDIT
              </Button>
            </FlexBetween>
          </WidgetWrapper>
          <DialogMessage
            open={isPostSuccessDialogOpen}
            handleClose={handleClosePostSuccessDialog}
            title="Edit Successful"
            content="Your post was successfully edited!"
          />
        </>
      )}
      {loading && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          borderRadius="10px"
          width="400px"
          height="auto"
          backgroundColor={theme.palette.background.alt}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            marginBottom="1rem"
          >
            <Typography>Loading Please wait...</Typography>
            {loadingAnimation ? (
              <HourglassTopIcon color="primary" fontSize="large" />
            ) : (
              <HourglassBottomIcon color="primary" fontSize="large" />
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default EditPostWidget;
