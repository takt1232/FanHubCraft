/* eslint-disable no-unused-vars */
import { Box, useMediaQuery } from "@mui/material";
import TopBar from "../widgets/TopBar";
import SideBar from "../widgets/SideBar";
import Content from "./Content";

const AdminHomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px");

  return (
    <>
      <Box display="flex" flexDirection="row">
        <SideBar />
        <Box display="flex" flexDirection="column" width="100%">
          <TopBar />
          <Content />
        </Box>
      </Box>
    </>
  );
};

export default AdminHomePage;
