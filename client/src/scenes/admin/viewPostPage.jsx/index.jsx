/* eslint-disable no-unused-vars */
import { Box, useMediaQuery } from "@mui/material";
import SideBar from "../widgets/SideBar";
import TopBar from "../widgets/TopBar";
import AdminViewPostContent from "./Content";

const AdminViewPostPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px");

  return (
    <>
      <Box display="flex" flexDirection="row">
        <SideBar />
        <Box display="flex" flexDirection="column" width="100%">
          <TopBar />
          <AdminViewPostContent />
        </Box>
      </Box>
    </>
  );
};

export default AdminViewPostPage;
