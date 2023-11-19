import { Box, useMediaQuery } from "@mui/material";
import NavBar from "scenes/navbar";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const EditProfilePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px");
  const { _id, picturePath } = useSelector((state) => state.user);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isNonMobileScreens) {
        setIsScrolled(window.scrollY > 140);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isNonMobileScreens]);

  return <>Manage Profile</>;
};

export default EditProfilePage;
