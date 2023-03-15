import React from "react";
import { Snackbar, Alert, Slide, AlertTitle } from "@mui/material";
import { InfoTwoTone } from "@mui/icons-material";

function ToastInfo({ open, onClose, title = "Info", body }) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={3000}
			onClose={onClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			TransitionComponent={Slide}
		>
			<Alert
				severity="info"
				variant="standard"
				icon={<InfoTwoTone fontSize="large" />}
				sx={{ width: "100%" }}
			>
				<AlertTitle>{title}</AlertTitle>
				{body}
			</Alert>
		</Snackbar>
	);
}

export default ToastInfo;
