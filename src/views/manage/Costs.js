import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { Button, Number } from "../../controls";
import { SaveTwoTone } from "@mui/icons-material";
import settingService from "../../services/setting";
import ToastError from "../../components/ToastError";
import ToastSuccess from "../../components/ToastSuccess";

function Home() {
	const navigate = useNavigate();
	const {
		token,
		user,
		isLoggedIn,
		setIsLoading,
		setErrorMessage,
		setSuccessMessage
	} = useStore(state => state);

	const [] = useState("");
	const [cost, setCost] = useState("");
	const [initialBalance, setInitialBalance] = useState("");

	useEffect(() => {
		if (!isLoggedIn) navigate("/login");

		setIsLoading(true);
		settingService.get(token).then(result => {
			if (result.error) {
				setErrorMessage(result.error);
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
			setCost(result.data.cost);
			setInitialBalance(result.data.initialBalance);
		});
	}, []);

	const hanldeSubmit = e => {
		if (isNaN(cost) || isNaN(initialBalance)) {
			setErrorMessage("Please provide valid number values.");
			return;
		}

		setIsLoading(true);
		settingService.update(token, { cost, initialBalance }).then(result => {
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
		<>
			<Grid container spacing={2} sx={{ p: 2 }}>
				<Grid item xs={12} md={12}>
					<Typography component="p" variant="h5">
						Update Costs
					</Typography>
				</Grid>
				<Grid item xs={12} md={12}>
					<Number
						label="Cost / Record"
						value={cost}
						onChange={setCost}
						helperText="This cost is for each record found in the search."
					/>
					<Number
						label="Initial Balance"
						value={initialBalance}
						onChange={setInitialBalance}
						helperText="Initial credits balance a user gets when he sign up."
					/>
					<Button
						text="Save Changes"
						icon={<SaveTwoTone />}
						sx={{ mt: 2 }}
						onClick={hanldeSubmit}
					/>
				</Grid>
			</Grid>
		</>
	);
}

export default Home;
