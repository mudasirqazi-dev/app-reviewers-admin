import { Typography } from "@mui/material";

function Error({ text, ...rest }) {
	return text ? (
		<Typography variant="body1" color="red" {...rest} sx={{ mt: 2, mb: 2 }}>
			{text}
		</Typography>
	) : (
		<></>
	);
}

export default Error;
