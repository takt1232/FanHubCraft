import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined
} from "@mui/icons-material";
import { 
    Box, 
    Divider, 
    Typography, 
    InputBase, 
    useTheme, 
    Button, 
    IconButton, 
    useMediaQuery 
} from "@mui/material";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import DialogMessage from "components/DialogMessage";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "scenes/navbar";
import { useParams } from "react-router-dom";
import { setPosts } from "state";

const EditPost = () => {
    const dispatch = useDispatch();
    const { postId, userPicturePath } = useParams();
    const [isPostSuccessDialogOpen, setIsPostSuccessDialogOpen] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const _id = useSelector((state) => state.user._id);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const handleClosePostSuccessDialog = () => {
        setIsPostSuccessDialogOpen(false);
    };

    const handleUpdatePost = async () => {
        const formData = new FormData();
        formData.append("userId", _id);

        // Extract tags from the post description
        const extractedTags = post.match(/#[a-zA-Z0-9]+/g);
        if (extractedTags) {
            const cleanedTags = extractedTags.map(tag => tag.slice(1)); // Remove "#" symbol
            formData.append("tags", JSON.stringify(cleanedTags)); // Send tags as a JSON string
        }

        formData.append("description", post);
        if (image) {
            formData.append("picture", image);
            formData.append("picturePath", image.name);
        }

        const response = await fetch(`http://localhost:3001/posts/${postId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
            "Content-Type": "application/json"
        });
        const posts = await response.json();
        dispatch(setPosts({ posts }));
        setImage(null);
        setPost("")
        setIsPostSuccessDialogOpen(true);
    };

    const fetchPostInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts/${postId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("data: ", data);
          const description = data[0].description;
          console.log("description: ", description);

          const picturePath = data[0].picturePath;
          console.log("picturePath: ", picturePath);
          setPost(description);
          setImage(picturePath);
        } else {
          console.error("Error fetching post information");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching post information:", error);
        setIsLoading(false);
      }
    };

    useEffect(() => {
        fetchPostInfo()
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading) {
        return <div>Loading...</div>; // Render a loading state
    }

    return (
        <>
        <NavBar />
            <WidgetWrapper mt="1rem">
                <FlexBetween gap="1rem">
                    <UserImage image={userPicturePath} />
                    {post && 
                        <InputBase
                            placeholder="What's your Recommendation"
                            onChange={(e) => setPost(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); 
                                    setPost(prevPost => prevPost + '\n'); 
                                }
                            }}
                            value={post}
                            sx={{
                                width: "100%",
                                backgroundColor: "2rem",
                                borderRadius: "2rem",
                                padding: "1rem 2rem"
                            }}

                            multiline 
                        />
                    }
                    {!post && (<HourglassEmptyIcon />)}
                </FlexBetween>
                {isImage && (
                    <Box
                        border={`1px solid ${medium}`}
                        borderRadius="5px"
                        mt= "1rem"
                        p="1rem"
                    >
                    <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false}
                        onDrop={(acceptedFiles) =>
                        setImage(acceptedFiles[0])
                        }
                    >
                        {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                            <Box
                                {...getRootProps()}
                                border={`2px dashed ${palette.primary.main}`}
                                p="1rem"
                                width="100%"
                                sx={{ "&:hover": { cursor: "pointer" } }}
                            >
                                <input {...getInputProps()} />
                                {!image ? (
                                <p>Add Image Here</p>
                                ) : (
                                <FlexBetween>
                                    <Typography>{image.name}</Typography>
                                    <EditOutlined />
                                </FlexBetween>
                                )}
                            </Box>
                            {image && (
                                <IconButton
                                    onClick={() => setImage(null)}
                                    sx={{ width: "15%"}}
                                >
                                    <DeleteOutlined />
                                </IconButton>
                            )}
                        </FlexBetween>
                        )}
                    </Dropzone>
                    </Box>
                )}

                <Divider sx={{ margin: "1.25rem 0"}} />

                <FlexBetween>
                    <FlexBetween 
                    gap="0.25rem"
                    onClick={() => setIsImage(!isImage)}
                    >
                        <ImageOutlined sx={{ color:mediumMain}} />
                        <Typography 
                            color={mediumMain}
                            sx={{ "&:hover": { cursor: "pointer", color: medium }}}
                        >
                            Image
                        </Typography>
                    </FlexBetween>

                    {isNonMobileScreens ? (
                        <>
                        <FlexBetween gap="0.25rem">
                            <GifBoxOutlined sx={{ color:mediumMain}} />
                            <Typography color={mediumMain}>Clip</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <AttachFileOutlined sx={{ color:mediumMain}} />
                            <Typography color={mediumMain}>Attachment</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <MicOutlined sx={{ color:mediumMain}} />
                            <Typography color={mediumMain}>Audio</Typography>
                        </FlexBetween>
                        </>
                    ) : (
                            <FlexBetween gap="0.25rem">
                                <MoreHorizOutlined sx={{ color: mediumMain}} />
                            </FlexBetween>
                        )}

                        <Button
                            disabled={!post}
                            onClick={handleUpdatePost}
                            sx={{
                                color: palette.background.alt,
                                backgroundColor: palette.primary.main,
                                borderRadius: "3rem"
                            }}
                        >
                            UPDATE
                        </Button>
                </FlexBetween>
            </WidgetWrapper>
            <DialogMessage
            open={isPostSuccessDialogOpen}
            handleClose={handleClosePostSuccessDialog}
            title="Post Successful"
            content="Your post was successfully submitted!"
        />
      </>
    )
}

export default EditPost;
