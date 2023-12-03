/* eslint-disable no-unused-vars */
import { useTheme } from "@emotion/react";
import React, { useState } from "react";
import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "state";

const SideBar = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 900px)");
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.background.light;
  const alt = theme.palette.background.alt;

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      {isNonMobileScreens ? (
        <Box
          position="fixed"
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="320px"
          height="100vh"
          backgroundColor={alt}
          boxShadow="0px 0px 10px 5px rgba(0, 0, 0, 0.1)"
          zIndex="100"
          transition="width 0.3s ease-in-out"
        >
          <Box
            display="flex"
            flexDirection="column"
            gap="1rem"
            width="100%"
            padding="1rem"
          >
            <Box
              display="flex"
              flexDirection="row"
              gap="0.5rem"
              alignItems="center"
            >
              <Typography
                padding="1rem"
                fontWeight="bold"
                fontSize="clamp(1rem, 2rem, 2.25rem)"
                color="primary"
                onClick={() => navigate("/admin/home")}
                sx={{
                  "&:hover": {
                    color: primaryLight,
                    cursor: "pointer",
                  },
                }}
              >
                FanHubCraft
              </Typography>
              <IconButton onClick={handleToggleSidebar}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Divider width="90%" />
            <Box
              display="flex"
              flexDirection="column"
              width="100%"
              padding="1rem"
              gap="2rem"
            >
              <Typography
                display="flex"
                alignItems="center"
                gap="1rem"
                fontWeight="bold"
                fontSize="clamp(0.75rem, 1rem, 1.50rem)"
                onClick={() => navigate("/admin/manage/users")}
                sx={{
                  "&:hover": {
                    color: primaryLight,
                    cursor: "pointer",
                  },
                }}
              >
                <PeopleAltIcon />
                Manage Users
              </Typography>
              <Typography
                display="flex"
                alignItems="center"
                gap="1rem"
                fontWeight="bold"
                fontSize="clamp(0.75rem, 1rem, 1.50rem)"
                onClick={() => navigate("/admin/manage/posts")}
                sx={{
                  "&:hover": {
                    color: primaryLight,
                    cursor: "pointer",
                  },
                }}
              >
                <ArticleIcon />
                Manage Posts
              </Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap="1rem"
            width="100%"
            padding="1rem"
            marginTop="100px"
          >
            <PowerSettingsNewIcon />
            <Typography
              fontWeight="bold"
              fontSize="clamp(0.75rem, 1rem, 1.50rem)"
              onClick={() => dispatch(setLogout())}
              sx={{
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
              }}
            >
              Log Out
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          position="fixed"
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="60px"
          height="100vh"
          backgroundColor={alt}
          boxShadow="0px 0px 10px 5px rgba(0, 0, 0, 0.1)"
          zIndex="100"
          transition="width 0.3s ease-in-out"
        >
          <Box>
            <Box padding="1rem">
              <IconButton onClick={handleToggleSidebar}>
                <MenuIcon fontSize="40px" />
              </IconButton>
            </Box>
            <Divider width="90%" />
            <Box padding="1rem">
              <IconButton onClick={() => navigate("/admin/manage/users")}>
                <PeopleAltIcon />
              </IconButton>
              <IconButton onClick={() => navigate("/admin/manage/posts")}>
                <ArticleIcon />
              </IconButton>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap="1rem"
            width="100%"
            padding="1rem"
            marginTop="100px"
          >
            <IconButton onClick={() => dispatch(setLogout())}>
              <PowerSettingsNewIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SideBar;
