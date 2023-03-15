import { Button as MdButton } from "@mui/material";

function Button({ text, variant, onClick, color, icon, ...rest }) {
	return (
		<MdButton
			variant={variant || "contained"}
			onClick={onClick}
			color={color || "primary"}
			size="large"
			fullWidth
			startIcon={icon ? icon : null}
			style={{ minHeight: 50 }}
			{...rest}
		>
			{text}
		</MdButton>
	);
}

export default Button;
