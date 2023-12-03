/* eslint-disable no-unused-vars */
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const [bgImages, setBgImages] = useState([
    "http://localhost:3001/assets/login-bg.jpeg",
    "http://localhost:3001/assets/login-bg1.jpeg",
  ]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentBgIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
        setFadeIn(true);
      }, 500); // Adjust this timeout value to match your transition duration
    }, 10000); // Change the interval to 10 seconds (10000 milliseconds)

    return () => clearInterval(intervalId);
  }, [bgImages]);

  return (
    <>
      <Box
        position="absolute"
        width="100%"
        height="100%"
        zIndex="0"
        overflow="hidden"
      >
        <img
          src={bgImages[currentBgIndex]}
          alt={`login-bg${currentBgIndex + 1}.jpg`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(5px)",
            transition: "opacity 0.5s ease-in-out", // Transition effect
            opacity: fadeIn ? 1 : 0,
          }}
        />
      </Box>
      <Box zIndex="1" position="relative">
        <Box
          width="100%"
          backgroundColor={theme.palette.background.alt}
          p="1rem 6%"
          textAlign="center"
          boxShadow="4px 4px 10px 5px rgba(0, 0, 0, 0.1)"
        >
          <Typography fontWeight="bold" fontSize="32px" color="primary">
            FanHubCraft
          </Typography>
        </Box>

        <Box
          width={isNonMobileScreens ? "50%" : "93%"}
          p="2rem"
          m="2rem auto"
          borderRadius="1.5rem"
          backgroundColor={theme.palette.background.alt}
          boxShadow="4px 4px 10px 5px rgba(0, 0, 0, 0.1)"
        >
          <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
            Welcome to FanHubCraft, Your Ultimate Destination for Anime and
            Gaming Enthusiasts!
          </Typography>
          <Form />
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
