import { Typography } from "@mui/material";

function Heading({ text, ...rest }) {
	return text ? (
		<Typography variant="h4" {...rest}>
			{text}
		</Typography>
	) : (
		<></>
	);
}

export default Heading;
