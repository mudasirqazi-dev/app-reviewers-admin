import React from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/store";
import {
	Grid,
	Typography,
	Box,
	Table,
	TableContainer,
	Paper,
	TableBody,
	TableRow,
	TableCell
} from "@mui/material";
import {
	PersonOutlineTwoTone,
	AccessTimeTwoTone,
	EmailTwoTone
} from "@mui/icons-material";
import moment from "moment";

function Profile(props) {
	const navigate = useNavigate();
	const { token, user, setUser, setIsLoading } = useStore(state => state);

	return (
		<Grid container spacing={2} sx={{ p: 2, pt: 2 }}>
			<Grid item xs={12} md={12}>
				<Typography component="p" variant="h4">
					Profile
				</Typography>
			</Grid>
			<Grid item xs={12} md={6}>
				<TableContainer component={Paper}>
					<Table>
						<TableBody>
							<TableRow
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0
									}
								}}
							>
								<TableCell align="right">
									<PersonOutlineTwoTone />
								</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="left"
								>
									{user.name}
								</TableCell>
							</TableRow>
							<TableRow
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0
									}
								}}
							>
								<TableCell align="right">
									<AccessTimeTwoTone />
								</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="left"
								>
									Member since:{" "}
									{moment(user.joined).format("DD MMMM YYYY")}
								</TableCell>
							</TableRow>
							<TableRow
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0
									}
								}}
							>
								<TableCell align="right">
									<EmailTwoTone />
								</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="left"
								>
									{user.email}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
			<Grid item xs={12} md={6}></Grid>
		</Grid>
	);
}

export default Profile;
