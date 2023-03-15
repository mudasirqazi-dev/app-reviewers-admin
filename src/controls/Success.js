import { Typography } from "@mui/material";

function Success({ text, ...rest }) {
	return text ? (
		<Typography
			variant="body1"
			color="green"
			{...rest}
			sx={{ mt: 2, mb: 2 }}
		>
			{text}
		</Typography>
	) : (
		<></>
	);
}

export default Success;
