import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const YesNoDialogMessage = ({ open, handleClose, handleNo, handleYes, title="Not Set", content="Content Not Set" }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{content}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNo}>No</Button>
        <Button onClick={handleYes}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default YesNoDialogMessage;
