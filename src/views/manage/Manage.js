import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Tabs, Tab, Box } from "@mui/material";
import Costs from "../manage/Costs";
import Names from "../manage/Names";

function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		"aria-controls": `vertical-tabpanel-${index}`
	};
}

function Manage() {
	const navigate = useNavigate();
	const { token, user, isLoggedIn, setIsLoading } = useStore(state => state);
	const [value, setValue] = useState(0);

	useEffect(() => {
		if (!isLoggedIn) navigate("/login");
	}, []);

	const handleChange = (e, ne) => setValue(ne);

	return (
		<Grid container spacing={2} sx={{ p: 2, pt: 2 }}>
			<Grid item xs={12} md={12}>
				<Typography component="p" variant="h4">
					Manage
				</Typography>
			</Grid>
			<Grid item xs={12} md={12}>
				<Box
					sx={{
						flexGrow: 1,
						bgcolor: "background.paper",
						display: "flex",
						height: "auto"
					}}
				>
					<Tabs
						orientation="vertical"
						variant="scrollable"
						value={value}
						onChange={handleChange}
						aria-label="Vertical tabs example"
						sx={{
							borderRight: 1,
							borderColor: "divider",
							width: "200px"
						}}
					>
						<Tab label="Cost" {...a11yProps(0)} />
						<Tab label="App Names" {...a11yProps(1)} />
					</Tabs>
					<TabPanel value={value} index={0}>
						<Costs />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<Names />
					</TabPanel>
				</Box>
			</Grid>
		</Grid>
	);
}

export default Manage;
