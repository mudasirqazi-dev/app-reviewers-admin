import React from "react";
import { Snackbar, Alert, Slide, AlertTitle } from "@mui/material";
import { HighlightOffTwoTone } from "@mui/icons-material";

function ToastError({ open, onClose, title = "Error!", body }) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={3000}
			onClose={onClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			TransitionComponent={Slide}
		>
			<Alert
				severity="error"
				variant="standard"
				icon={<HighlightOffTwoTone fontSize="large" />}
				sx={{ width: "100%" }}
			>
				<AlertTitle>{title}</AlertTitle>
				{body}
			</Alert>
		</Snackbar>
	);
}

export default ToastError;
