import React from "react";
import { Snackbar, Alert, Slide, AlertTitle } from "@mui/material";
import { CheckCircleTwoTone } from "@mui/icons-material";

function ToastSuccess({ open, onClose, title = "Success!", body }) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={3000}
			onClose={onClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			TransitionComponent={Slide}
		>
			<Alert
				severity="success"
				variant="standard"
				icon={<CheckCircleTwoTone fontSize="large" />}
				sx={{ width: "100%" }}
			>
				<AlertTitle>{title}</AlertTitle>
				{body}
			</Alert>
		</Snackbar>
	);
}

export default ToastSuccess;
