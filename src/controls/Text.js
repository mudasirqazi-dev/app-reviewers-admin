import { TextField } from "@mui/material";

function Text({ label, value, onChange, ...rest }) {
	return (
		<TextField
			variant="outlined"
			label={label}
			value={value}
			onChange={e => onChange(e.target.value)}
			fullWidth
			color="primary"
			type="text"
			style={{ marginTop: 10, marginBottom: 10 }}
			{...rest}
		></TextField>
	);
}

export default Text;
