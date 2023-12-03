/* eslint-disable no-unused-vars */
import { ImageOutlined } from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import UserImage from "components/UserImage";
import DialogMessage from "components/DialogMessage";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isPostSuccessDialogOpen, setIsPostSuccessDialogOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const theme = useTheme();
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const [uploadedPicture, setUploadedPicture] = useState(null);
  const [loadingAnimation, setLoadingAnimation] = useState(true);
  const [loading, setLoading] = useState(false);

  const smallScreen = useMediaQuery("(min-width: 500px)");

  const handleImageSelect = async (e) => {
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
        setUploadedPicture(uploadedImage);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handlePost = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("userId", _id);

    // Extract tags from the post description
    const extractedTags = post.match(/#[a-zA-Z0-9]+/g);
    if (extractedTags) {
      const cleanedTags = extractedTags.map((tag) => tag.slice(1)); // Remove "#" symbol
      formData.append("tags", JSON.stringify(cleanedTags)); // Send tags as a JSON string
    }

    formData.append("description", post);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }

    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    setLoading(false);
    setImage(null);
    setPost("");
    setUploadedPicture("");
    setIsPostSuccessDialogOpen(true);
  };

  const handleClosePostSuccessDialog = () => {
    setIsPostSuccessDialogOpen(false);
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
      <WidgetWrapper>
        <Box display="flex" flexDirection="row" alignItems="center" gap="1rem">
          <UserImage image={picturePath} />
          <Box sx={{ width: 300, height: 100 }}>
            <InputBase
              placeholder="What's your Recommendation"
              onChange={(e) => setPost(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setPost((prevPost) => prevPost + "\n");
                }
              }}
              value={post}
              sx={{
                width: "100%",
                height: "100%",
                border: `1px solid ${medium}`,
                padding: "1rem 2rem",
              }}
              multiline={smallScreen} // Conditionally apply multiline based on smallScreen
              maxRows={4}
            />
          </Box>
        </Box>
        {uploadedPicture && (
          <>
            <Divider sx={{ margin: "1.25rem 0" }} />
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
                <img
                  src={`http://localhost:3001/assets/${uploadedPicture}`}
                  alt="Uploaded"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>
          </>
        )}
        <Divider sx={{ margin: "1.25rem 0" }} />

        <FlexBetween>
          <label htmlFor="upload-image" style={{ cursor: "pointer" }}>
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
            id="upload-image"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageSelect}
            style={{ display: "none" }}
          />

          <Button
            disabled={!post}
            onClick={handlePost}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            POST
          </Button>
        </FlexBetween>
      </WidgetWrapper>
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

      <DialogMessage
        open={isPostSuccessDialogOpen}
        handleClose={handleClosePostSuccessDialog}
        title="Post Successful"
        content="Your post was successfully uploaded!"
      />
    </>
  );
};

export default MyPostWidget;
