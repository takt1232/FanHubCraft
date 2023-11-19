import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DialogMessage from "components/DialogMessage";

import Friend from "components/Friend";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import UserImage from "components/UserImage";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { useNavigate } from "react-router-dom";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  postPicturePath,
  userPicturePath,
  likes,
  tags,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [reviewUsers, setReviewUsers] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserPicturePath = useSelector(
    (state) => state.user.picturePath
  );
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [openMissingBothDialog, setOpenMissingBothDialog] = useState(false);
  const [openMissingRateDialog, setOpenMissingRateDialog] = useState(false);
  const [openMissingCommentDialog, setOpenMissingCommentDialog] =
    useState(false);

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const getReviewForPost = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/reviews`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      const reviewsData = data.map(async (review) => {
        const userResponse = await fetch(
          `http://localhost:3001/users/${review.userId}`, // Assuming this is your user endpoint
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userData = await userResponse.json();

        return {
          userId: review.userId,
          rating: review.rating,
          comment: review.comment,
          postId: review.postId,
          picturePath: userData.picturePath,
          name: userData.firstName + " " + userData.lastName, // Include user data in the review object
        };
      });

      // Wait for all user data fetches to complete
      const reviewsWithData = await Promise.all(reviewsData);

      setReviewUsers(reviewsWithData);
    } catch (error) {
      console.error("Error reading reviews:", error);
    }
  };

  const addReview = async (comment, rate) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/addReview`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loggedInUserId,
          comment: comment,
          rating: rate,
          postId: postId,
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
        getReviewForPost(postId);
      } else {
        console.error("Error adding review:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleToggleComments = () => {
    setIsComments(!isComments);
    if (!isComments) {
      getReviewForPost(postId);
    }
  };

  const renderStars = (rating) => {
    const maxRating = 5;
    const fullStars = Math.floor(rating);

    const starIcons = [];

    for (let i = 0; i < fullStars; i++) {
      starIcons.push(<StarIcon key={`star-${i}`} fontSize="1rem" />);
    }

    const remainingStars = maxRating - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      starIcons.push(
        <StarBorderIcon key={`border-star-${i}`} fontSize="1rem" />
      );
    }

    return starIcons;
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const renderRateStars = () => {
    const maxRating = 5;
    const starIcons = [];

    for (let i = 1; i <= maxRating; i++) {
      starIcons.push(
        i <= rating ? (
          <StarIcon key={`star-${i}`} onClick={() => handleStarClick(i)} />
        ) : (
          <StarBorderIcon
            key={`star-${i}`}
            onClick={() => handleStarClick(i)}
          />
        )
      );
    }

    return starIcons;
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      reviewValidation();
    }
  };

  const reviewValidation = () => {
    if (rating === 0 && comment === "") {
      setOpenMissingBothDialog(true); // Open dialog if both rating and comment are empty
    } else if (rating === 0) {
      setOpenMissingRateDialog(true); // Open dialog if rating is not selected
    } else if (comment.length === 0) {
      setOpenMissingCommentDialog(true); // Open dialog if comment is empty
    } else {
      addReview(comment, rating);
      setRating(0);
      setComment("");
    }
  };

  const handleCloseDialog = () => {
    setOpenMissingBothDialog(false);
    setOpenMissingRateDialog(false);
    setOpenMissingCommentDialog(false);
  };

  useEffect(() => {
    getReviewForPost(postId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <WidgetWrapper m="2rem 0">
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
          postId={postId}
          status="post"
        />
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        {tags && (
          <Box display="flex" flexDirection="row" gap="0.5rem" mt="0.5rem">
            {tags.map((tag, i) => (
              <Typography color={primary} key={i}>
                #{tag}
              </Typography>
            ))}
          </Box>
        )}
        {postPicturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${postPicturePath}`}
          />
        )}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>

            <FlexBetween gap="0.3rem">
              <IconButton onClick={handleToggleComments}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{reviewUsers.length}</Typography>
            </FlexBetween>
          </FlexBetween>

          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
        {isComments && reviewUsers.length >= 0 && (
          <Box mt="0.5rem">
            {reviewUsers.map((review, i) => (
              <Box key={`${review}-${i}`}>
                <Divider />
                <FlexBetween paddingTop="1rem">
                  <FlexBetween>
                    {review.userId ? (
                      review.picturePath ? (
                        <UserImage image={review.picturePath} size="35px" />
                      ) : (
                        <UserImage image="" size="35px" />
                      )
                    ) : (
                      <HourglassEmptyIcon />
                    )}
                    <Box>
                      <FlexBetween width="100%" height="100%">
                        <Box display="flex" flexDirection="row">
                          <Typography
                            sx={{
                              color: "grey",
                              m: "0.5rem 0",
                              pl: "1rem",
                            }}
                          >
                            Review by
                          </Typography>
                          <Typography
                            sx={{
                              color: primary,
                              m: "0.5rem 0",
                              pl: "1rem",
                              "&:hover": {
                                color: palette.secondary.light,
                                cursor: "pointer",
                              },
                            }}
                            onClick={() => {
                              navigate(`/profile/${review.userId}`);
                              navigate(0);
                            }}
                          >
                            {review.userId && review.name}
                          </Typography>
                        </Box>
                        <Box marginLeft="2rem">
                          {renderStars(review.rating).map((star, index) => (
                            <span key={index}>{star}</span>
                          ))}
                        </Box>
                      </FlexBetween>
                      <Box>
                        <Typography sx={{ color: main, pl: "1rem" }}>
                          {review.comment}
                        </Typography>
                      </Box>
                    </Box>
                  </FlexBetween>
                </FlexBetween>
                <Divider />
              </Box>
            ))}
            <FlexBetween gap="1rem" paddingTop="1rem">
              <FlexBetween width="100%" gap="1rem">
                <UserImage image={loggedInUserPicturePath} size="35px" />
                <TextField
                  fullWidth
                  id="standard-basic"
                  variant="standard"
                  placeholder="Comment"
                  value={comment}
                  onChange={handleCommentChange}
                  onKeyUp={handleEnterKeyPress}
                />
              </FlexBetween>
              <Box width="9rem">{renderRateStars()}</Box>
              <SendIcon
                sx={{
                  color: primary,
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  reviewValidation();
                }}
              />
            </FlexBetween>
          </Box>
        )}
      </WidgetWrapper>
      <DialogMessage
        open={openMissingBothDialog}
        handleClose={handleCloseDialog}
        title="Rate and Comment"
        content="Please add a rate and comment"
      />
      <DialogMessage
        open={openMissingRateDialog}
        handleClose={handleCloseDialog}
        title="Rate"
        content="Please add a rate"
      />
      <DialogMessage
        open={openMissingCommentDialog}
        handleClose={handleCloseDialog}
        title="Comment"
        content="Please add a comment"
      />
    </>
  );
};

export default PostWidget;
