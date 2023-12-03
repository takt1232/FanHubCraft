/* eslint-disable no-unused-vars */
import { Box, useMediaQuery } from "@mui/material";
import SideBar from "../widgets/SideBar";
import TopBar from "../widgets/TopBar";
import ManagePostContent from "./Content";

const ManagePostsPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px");

  return (
    <>
      <Box display="flex" flexDirection="row">
        <SideBar />
        <Box display="flex" flexDirection="column" width="100%">
          <TopBar />
          <ManagePostContent />
        </Box>
      </Box>
    </>
  );
};

export default ManagePostsPage;
