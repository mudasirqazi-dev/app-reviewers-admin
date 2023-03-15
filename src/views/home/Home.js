import React, { useEffect } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";

function Home() {
	const navigate = useNavigate();
	const { token, user, isLoggedIn, setIsLoading } = useStore(state => state);

	useEffect(() => {
		if (!isLoggedIn) navigate("/login");
	}, []);

	return (
		<>
			<Grid container spacing={2} sx={{ p: 2, pt: 2 }}>
				<Grid item xs={12} md={12}>
					<Typography component="p" variant="h4">
						Dashboard
					</Typography>
				</Grid>
			</Grid>
		</>
	);
}

export default Home;
