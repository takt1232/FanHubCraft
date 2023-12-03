import { Box } from "@mui/material";
import { styled } from "@mui/system";

const Card = styled(Box)(({ theme }) => ({
  padding: "1rem",
  backgroundColor: theme.palette.background.alt,
  borderRadius: "0.75rem",
  width: "300px",
  height: "auto",
}));

export default Card;
