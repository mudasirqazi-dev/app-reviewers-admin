import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { Text, Button } from "../../controls";
import nameService from "../../services/name";
import { SaveTwoTone } from "@mui/icons-material";

function Names() {
	const navigate = useNavigate();
	const {
		token,
		user,
		isLoggedIn,
		setIsLoading,
		setErrorMessage,
		setSuccessMessage
	} = useStore(state => state);
	const [names, setNames] = useState("");

	useEffect(() => {
		if (!isLoggedIn) navigate("/login");

		setIsLoading(true);
		nameService.get(token).then(result => {
			if (result.error) {
				setErrorMessage(result.error);
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
			setNames(result.data.names);
		});
	}, []);

	const hanldeSubmit = e => {
		setIsLoading(true);
		nameService.update(token, { names }).then(result => {
			if (result.error) {
				setErrorMessage(result.error);
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
			setSuccessMessage("Data updated successfully!");
		});
	};

	return (
		<Grid container spacing={2} sx={{ p: 2, pt: 2 }}>
			<Grid item xs={12} md={12}>
				<Typography component="p" variant="h5">
					App Names
				</Typography>
			</Grid>
			<Grid item xs={12} md={12}>
				<Text
					value={names}
					onChange={setNames}
					label="App Names"
					multiline
					minRows={3}
					helperText="Semicolon ( ; ) separated list of application names."
				/>
				<Button
					text="Save Changes"
					icon={<SaveTwoTone />}
					sx={{ mt: 2 }}
					onClick={hanldeSubmit}
				/>
			</Grid>
		</Grid>
	);
}

export default Names;
