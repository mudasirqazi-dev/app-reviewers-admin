import React from "react";
import { Link as MdLink } from "@mui/material";
import { Link } from "react-router-dom";

const LinkBehavior = React.forwardRef((props, ref) => (
	<Link ref={ref} to={props.href} {...props} />
));

function LinkButton({ label, text, to }) {
	return (
		<div>
			{label}
			<MdLink
				underline="hover"
				href={to}
				component={LinkBehavior}
				color="primary"
				style={{ marginLeft: label?.length > 0 ? 5 : 0 }}
			>
				{text}
			</MdLink>
		</div>
	);
}

export default LinkButton;
