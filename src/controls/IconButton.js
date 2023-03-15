import { IconButton as MdButton } from "@mui/material";

function IconButton({ onClick, color, icon }) {
	return (
		<MdButton onClick={onClick} color={color} size="large">
			{icon}
		</MdButton>
	);
}

export default IconButton;
