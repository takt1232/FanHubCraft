import { Box, useMediaQuery } from "@mui/material";
import NavBar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import { useSelector } from "react-redux";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useState, useEffect } from "react";
import AnimePostsWidget from "scenes/widgets/AnimePostsWidget";

const AnimeHomePage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px");
    const { _id, picturePath } = useSelector((state) => state.user);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if(isNonMobileScreens) {
                setIsScrolled(window.scrollY > 140);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isNonMobileScreens]);

    return (
    <>
    <Box>
        <NavBar />
        <Box
            width="100%"
            padding="2rem 6%"
            display={isNonMobileScreens ? "flex": "block" }
            gap="0.5rem"
            justifyContent="space-between"
        >
            <Box flexBasis={isNonMobileScreens ? "26%" : undefined }
                 display={isScrolled ? "flex": "none"}
            >
            </Box>
            <Box flexBasis={isNonMobileScreens ? "26%" : undefined }
                 position={(isScrolled && isNonMobileScreens) ? "fixed" : "static"}
                 top={(isScrolled && isNonMobileScreens) ? "1.5rem" : "auto"}
                 width={(isScrolled && isNonMobileScreens) ? "23%" : "auto"}
                 height="auto"
            >
                <UserWidget userId={_id} picturePath={picturePath} />
            </Box>
            <Box
                flexBasis={isNonMobileScreens ? "42%" : undefined }
                mt={isNonMobileScreens ? undefined : "2rem"}
            >
                <MyPostWidget picturePath={picturePath} />
                <AnimePostsWidget userId={_id} />
            </Box>
            {isNonMobileScreens && (
            <>
            <Box flexBasis="26%"
                 position={isScrolled ? "fixed" : "static"}
                 top={isScrolled ? "1rem" : "auto"}
                 right={isScrolled ? "5rem" : "auto"}
                 width={isScrolled ? "22%" : "auto"}
                 height="auto"
            >
                <Box m="2rem 0" />
                <FriendListWidget userId={_id} />
            </Box>
            <Box flexBasis="26%"
                 display={isScrolled ? "flex": "none"}
            >
                <Box m="2rem 0" />
            </Box>
            </>
            )}
        </Box>
    </Box>
    </>
    );
};

export default AnimeHomePage;
