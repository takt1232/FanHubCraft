/* eslint-disable no-unused-vars */
import { Close } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import YesNoDialogMessage from "./YesNoDialogMessage";
import { useState } from "react";
import EditPostWidget from "scenes/widgets/EditPostWidget";
import { setPosts } from "state";

const Friend = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  postId,
  status = "view",
}) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [editPost, setEditPost] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const { palette } = useTheme();
  const theme = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Fetch the updated list of posts after deleting the specific post
        const updatedResponse = await fetch(`http://localhost:3001/posts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (updatedResponse.ok) {
          const updatedPosts = await updatedResponse.json();
          dispatch(setPosts({ posts: updatedPosts }));
        } else {
          console.error("Error fetching updated posts");
        }
      } else {
        console.error("Error deleting post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleConfirmDialogOpen = (action) => {
    setDialogAction(action);
    setIsConfirmDialogOpen(true);
  };

  const handleEdit = () => {
    setEditPost(true);
    document.body.style.overflow = "hidden";
  };

  const handleClose = () => {
    setEditPost(false); // Close the modal by setting the state variable to false
    document.body.style.overflow = "auto";
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleDialogAction = () => {
    if (dialogAction === "edit") {
      handleEdit();
    } else if (dialogAction === "delete") {
      handleDelete();
    }

    setIsConfirmDialogOpen(false);
  };

  return (
    <>
      <FlexBetween>
        <FlexBetween gap="1rem">
          <UserImage image={userPicturePath} size="55px" />
          <Box
            onClick={() => {
              navigate(`/profile/${friendId}`);
              navigate(0);
            }}
          >
            <Typography
              color={main}
              variant="h5"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {name}
            </Typography>
            <Typography color={medium} fontSize="0.75rem">
              {subtitle}
            </Typography>
          </Box>
        </FlexBetween>
        {friendId === _id && status === "post" && (
          <FlexBetween gap="0.5rem">
            <IconButton
              fontSize="5px"
              onClick={handleEdit}
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
              <EditIcon sx={{ color: "black" }} />
            </IconButton>
            <IconButton
              fontSize="5px"
              onClick={() => handleConfirmDialogOpen("delete")}
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
              <DeleteOutlineIcon sx={{ color: "black" }} />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>
      {editPost && (
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
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <EditPostWidget postId={postId} />
        </Box>
      )}
      {dialogAction === "edit" ? (
        <YesNoDialogMessage
          open={isConfirmDialogOpen}
          handleClose={handleConfirmDialogClose}
          handleNo={handleConfirmDialogClose}
          handleYes={handleDialogAction}
          title="Edit Post"
          content="Do you want to edit this post?"
        />
      ) : dialogAction === "delete" ? (
        <YesNoDialogMessage
          open={isConfirmDialogOpen}
          handleClose={handleConfirmDialogClose}
          handleNo={handleConfirmDialogClose}
          handleYes={handleDialogAction}
          title="Delete Post"
          content="Do you want to delete this post?"
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Friend;
