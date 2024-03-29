import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

function Loading() {
  return (
    <Backdrop
      sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 2 }}
      open={true}
    >
      <CircularProgress
        color="inherit"
        size={70}
        thickness={1.5}
        variant="indeterminate"
      />
    </Backdrop>
  );
}

export default Loading;
