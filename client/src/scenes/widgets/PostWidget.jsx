import { 
    ChatBubbleOutlineOutlined, 
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
} from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';
import {
    Box,
    Divider,
    IconButton,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Friend from "components/Friend";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import UserImage from "components/UserImage";
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
    comments,
    tags,
}) => {
    const [isComments, setIsComments] = useState(false);
    const [commentUsers, setCommentUsers] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const loggedInUserPicturePath = useSelector((state) => state.user.picturePath);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    const patchLike = async () => {
        const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        body: JSON.stringify({ userId: loggedInUserId })
        });
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
    };

    // Fetch user details for all unique user IDs in comments
    const fetchCommentUsers = async () => {
        for (const comment of comments) {
            const userId = comment.userId;
            if (!commentUsers[userId]) {
                const response = await fetch(`http://localhost:3001/users/${userId}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (data.firstName && data.lastName && data.picturePath) {
                    const userName = `${data.firstName} ${data.lastName}`;
                    setCommentUsers(prevUsers => ({
                        ...prevUsers,
                        [userId]: { name: userName, picturePath: data.picturePath }
                    }));
                }
            }
        }
    };

    const addComment = async (commentText) => {
        try {
            const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
                method: "POST",
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    userId: loggedInUserId,
                    commentText: commentText
                })
            });

            if (response.ok) {
                const updatedPost = await response.json();
                dispatch(setPost({ post: updatedPost }));
            } else {
                console.error("Error adding comment:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleToggleComments = () => {
        setIsComments(!isComments);
        if (!isComments) {
            fetchCommentUsers(postId);
        }
    };

    useEffect(() => {
        fetchCommentUsers(postId);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <WidgetWrapper m="2rem 0">
            <Friend 
                friendId={postUserId}
                name={name}
                subtitle={location}
                userPicturePath={userPicturePath}
                postId={postId}   
            />
            <Typography color={main} sx={{ mt: "1rem" }}>
                {description}
            </Typography>
            {tags && (
                <Box display="flex" flexDirection="row" gap="0.5rem" mt="0.5rem">
                    {tags.map((tag, i) => (
                        <Typography color={primary} key={i}>#{tag}</Typography>
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
                            ): (
                                <FavoriteBorderOutlined />
                            )}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={handleToggleComments}>
                            <ChatBubbleOutlineOutlined />
                        </IconButton>
                        <Typography>{comments.length}</Typography>
                    </FlexBetween>

                </FlexBetween>

                <IconButton>
                    <ShareOutlined />
                </IconButton>
            </FlexBetween>
            {isComments && (
            <Box mt="0.5rem">
                {comments.map((comment, i) => (
                    <Box key={`${name}-${i}`}>
                        <Divider />
                        <FlexBetween paddingTop="1rem">
                            <FlexBetween>
                                {commentUsers[comment.userId] ? (
                                    commentUsers[comment.userId].picturePath ? (
                                        <UserImage
                                            image={commentUsers[comment.userId].picturePath}
                                            size="35px"
                                        />
                                    ) : (
                                        <UserImage
                                            image=""
                                            size="35px"
                                        />
                                    )
                                ) : (
                                    <HourglassEmptyIcon />
                                )}
                                <Box>
                                    <Box onClick={() => {
                                        navigate(`/profile/${comment.userId}`);
                                        navigate(0);
                                    }}>
                                        <Typography sx={{ color: primary, m: "0.5rem 0", pl: "1rem", "&:hover": { color: palette.primary.light, cursor: "pointer" }, }}>
                                            {commentUsers[comment.userId] && commentUsers[comment.userId].name}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                                            {comment.commentText}
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
                        <TextField fullWidth id="standard-basic" variant="standard" placeholder="Comment" onKeyUp={(e) => {
                                    if (e.key === "Enter") {
                                        addComment(e.target.value);
                                        e.target.value = "";
                                    }
                                }}/>
                    </FlexBetween>
                    <SendIcon sx={{ color: primary, "&:hover": { color: palette.primary.light, cursor: "pointer" },}} onClick={() => {
                        const commentInput = document.getElementById('standard-basic');
                        const commentValue = commentInput.value;
                        
                        addComment(commentValue);
                        commentInput.value = "";
                        // You can also set focus back to the input if desired
                        commentInput.focus();
                    }} 
                    />
                </FlexBetween>
            </Box>
        )}

        </WidgetWrapper>
    )
};

export default PostWidget;
