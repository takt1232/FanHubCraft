/* eslint-disable no-unused-vars */
import { useTheme } from "@emotion/react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ArticleIcon from "@mui/icons-material/Article";
import FlexBetween from "components/FlexBetween";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Content = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 900px)");
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.background.light;
  const alt = theme.palette.background.alt;

  const [userCount, setUserCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);

  const fetchUserCount = async () => {
    try {
      const response = await fetch("http://localhost:3001/stats/count/user", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUserCount(data.userCount); // Assuming your API response has a 'userCount' field
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  const fetchPostCount = async () => {
    try {
      const response = await fetch("http://localhost:3001/stats/count/post", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPostsCount(data.postCount); // Assuming your API response has a 'userCount' field
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching posts count:", error);
    }
  };

  useEffect(() => {
    fetchUserCount();
    fetchPostCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="0.5rem"
      padding="1rem"
      ml={isNonMobileScreens ? "320px" : "60px"}
      mt="70px"
    >
      <Typography
        fontWeight="bold"
        fontSize="clamp(1rem, 1.5rem, 2rem)"
        color="primary"
      >
        Admin Page
      </Typography>
      <FlexBetween>
        <Card>
          <FlexBetween>
            <FlexBetween style={{ gap: "1rem", color: "primary" }}>
              <PeopleIcon style={{ fontSize: "2rem" }} />
              <Typography
                fontWeight="bold"
                fontSize="clamp(0.75rem, 1rem, 1.5rem)"
              >
                Users:
              </Typography>
            </FlexBetween>
            <Typography
              fontWeight="bold"
              fontSize="clamp(0.75rem, 1rem, 1.5rem)"
            >
              {userCount}
            </Typography>
          </FlexBetween>
        </Card>
        <Card>
          <FlexBetween>
            <FlexBetween style={{ gap: "1rem", color: "primary" }}>
              <ArticleIcon style={{ fontSize: "2rem" }} />
              <Typography
                fontWeight="bold"
                fontSize="clamp(0.75rem, 1rem, 1.5rem)"
              >
                Posts:
              </Typography>
            </FlexBetween>
            <Typography
              fontWeight="bold"
              fontSize="clamp(0.75rem, 1rem, 1.5rem)"
            >
              {postsCount}
            </Typography>
          </FlexBetween>
        </Card>
      </FlexBetween>
    </Box>
  );
};

export default Content;
