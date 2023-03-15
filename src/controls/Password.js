import { useState } from "react";
import {
	OutlinedInput,
	InputAdornment,
	IconButton,
	InputLabel,
	FormControl
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";

function Password({ label, value, onChange }) {
	const [showText, setShowText] = useState(false);
	return (
		<FormControl
			variant="outlined"
			fullWidth
			style={{ marginTop: 10, marginBottom: 10 }}
		>
			<InputLabel>{label}</InputLabel>
			<OutlinedInput
				label={label}
				color="primary"
				type={showText ? "text" : "password"}
				value={value}
				onChange={e => onChange(e.target.value)}
				endAdornment={
					<InputAdornment position="end">
						<IconButton
							aria-label="Toggle password visibility"
							onClick={() => setShowText(!showText)}
							onMouseDown={e => e.preventDefault()}
							edge="end"
						>
							{showText ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
				}
			/>
		</FormControl>
	);
}

export default Password;
