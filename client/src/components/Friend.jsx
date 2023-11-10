import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import YesNoDialogMessage from "./YesNoDialogMessage";
import { useState } from "react";

const Friend = ({ friendId, name, subtitle, userPicturePath, postId }) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        window.location.reload();
      } else {
        // If deletion fails, you can show an error message or handle it as needed.
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

  const handleEdit = () => {
    navigate(`/post/${postId}/${userPicturePath}`);
    navigate(0);
  };

  return (
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
      {friendId !== _id && (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
      {friendId === _id && (
        <FlexBetween gap="0.5rem">
          <IconButton fontSize="5px" onClick={() => handleConfirmDialogOpen("edit")} sx={{ backgroundColor: primaryLight, p: "0.6rem" }}>
              <EditIcon sx={{ color: "green" }}/>
          </IconButton>
          <IconButton fontSize="5px" onClick={() => handleConfirmDialogOpen("delete")} sx={{ backgroundColor: primaryLight, p: "0.6rem" }}>
              <DeleteOutlineIcon sx={{ color: "red" }}/>
          </IconButton>
        </FlexBetween>
      )}
      {dialogAction === "edit"
        ? (<YesNoDialogMessage open={isConfirmDialogOpen} handleClose={handleConfirmDialogClose} handleNo={handleConfirmDialogClose} handleYes={handleDialogAction} title="Edit Post" content="Do you want to edit this post?" />)
        : dialogAction === "delete"
        ? (<YesNoDialogMessage open={isConfirmDialogOpen} handleClose={handleConfirmDialogClose} handleNo={handleConfirmDialogClose} handleYes={handleDialogAction} title="Delete Post" content="Do you want to delete this post?" />)
        : ""}
    </FlexBetween>
  );
};

export default Friend;
