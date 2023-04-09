import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "../../store/store";
import {
	PersonOutlineTwoTone,
	AccessTimeTwoTone,
	EmailTwoTone
} from "@mui/icons-material";
import moment from "moment";
import CreditCardTwoToneIcon from "@mui/icons-material/CreditCardTwoTone";
import FunctionsTwoToneIcon from "@mui/icons-material/FunctionsTwoTone";
import userService from "../../services/user";

import {
	Grid,
	Typography,
	Box,
	Table,
	TableContainer,
	Paper,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TableFooter,
	TablePagination,
	IconButton
} from "@mui/material";
import {
	LastPage as LastPageIcon,
	KeyboardArrowRight,
	KeyboardArrowLeft,
	FirstPage as FirstPageIcon
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Utils from "../../utils/utils";

function TablePaginationActions(props) {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;
	const handleFirstPageButtonClick = e => onPageChange(e, 0);
	const handleBackButtonClick = e => onPageChange(e, page - 1);
	const handleNextButtonClick = e => onPageChange(e, page + 1);

	const handleLastPageButtonClick = e =>
		onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === "rtl" ? (
					<LastPageIcon />
				) : (
					<FirstPageIcon />
				)}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowRight />
				) : (
					<KeyboardArrowLeft />
				)}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowLeft />
				) : (
					<KeyboardArrowRight />
				)}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === "rtl" ? (
					<FirstPageIcon />
				) : (
					<LastPageIcon />
				)}
			</IconButton>
		</Box>
	);
}

function Profile() {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [payments, setPayments] = useState([]);

	const { id } = useParams();

	const { setIsLoading, isLoggedIn, setErrorMessage } = useStore(
		state => state
	);

	const [isDone, setIsDone] = useState(false);

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - payments.length) : 0;
	const handleChangePage = (e, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = e => {
		setRowsPerPage(parseInt(e.target.value));
		setPage(0);
	};

	useEffect(() => {
		if (!isLoggedIn) navigate("/login");
		setIsLoading(true);

		if (!id) return;
		userService.getById(id).then(r => {
			if (r.error) {
				setErrorMessage(r.error);
				setIsLoading(false);
				return;
			}
			if (r.data) {
				setUser(r.data.user);
				setPayments(r.data.payments);
				setIsDone(true);
				setIsLoading(false);
			}
		});
	}, []);

	return (
		<>
			<Grid container spacing={2} sx={{ p: 2, pt: 2 }}>
				{isDone && user && (
					<>
						<Grid item xs={12} md={12}>
							<Typography component="p" variant="h4">
								User Profile
							</Typography>
						</Grid>
						<Grid item xs={12} md={5}>
							<TableContainer component={Paper}>
								<Table>
									<TableBody>
										<TableRow
											sx={{
												"&:last-child td, &:last-child th":
													{
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
												"&:last-child td, &:last-child th":
													{
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
										<TableRow
											sx={{
												"&:last-child td, &:last-child th":
													{
														border: 0
													}
											}}
										>
											<TableCell align="right">
												<CreditCardTwoToneIcon />
											</TableCell>
											<TableCell
												component="th"
												scope="row"
												align="left"
											>
												Credits: {user.points}
											</TableCell>
										</TableRow>
										<TableRow
											sx={{
												"&:last-child td, &:last-child th":
													{
														border: 0
													}
											}}
										>
											<TableCell align="right">
												<FunctionsTwoToneIcon />
											</TableCell>
											<TableCell
												component="th"
												scope="row"
												align="left"
											>
												Total:{" "}
												{payments.reduce(
													(acc, obj) =>
														acc +
														parseFloat(obj?.amount),
													0
												)}{" "}
												USD |{" "}
												{payments
													.reduce(
														(acc, obj) =>
															acc +
															parseFloat(
																obj?.btc
															),
														0
													)
													.toFixed(2)}{" "}
												BTC
											</TableCell>
										</TableRow>
										<TableRow
											sx={{
												"&:last-child td, &:last-child th":
													{
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
												{moment(user.joined).format(
													"DD MMMM YYYY"
												)}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</Grid>
					</>
				)}

				<Grid item xs={12} md={7}>
					{isDone && payments.length > 0 && (
						<>
							<TableContainer component={Paper}>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell
												component="th"
												scope="row"
												align="left"
											>
												Date ({payments.length} records)
											</TableCell>
											<TableCell
												component="th"
												scope="row"
												align="right"
											>
												Amount
											</TableCell>
											<TableCell
												component="th"
												scope="row"
												align="right"
											>
												BTC
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{(rowsPerPage > 0
											? payments.slice(
													page * rowsPerPage,
													page * rowsPerPage +
														rowsPerPage
											  )
											: payments
										).map(row => (
											<TableRow
												key={row._id}
												sx={{
													"&:last-child td, &:last-child th":
														{
															border: 0
														}
												}}
											>
												<TableCell
													component="td"
													scope="row"
													align="left"
												>
													{moment(row?.date).format(
														"DD MMM YYYY"
													)}
												</TableCell>
												<TableCell
													component="td"
													scope="row"
													align="right"
												>
													{Utils.formatToCurrency(
														row?.amount,
														"$"
													)}
												</TableCell>
												<TableCell
													component="td"
													scope="row"
													align="right"
												>
													{row?.btc}
												</TableCell>
											</TableRow>
										))}
										{emptyRows > 0 && (
											<TableRow
												style={{
													height: 53 * emptyRows
												}}
											>
												<TableCell colSpan={1} />
											</TableRow>
										)}
									</TableBody>
									<TableFooter>
										<TableRow>
											<TablePagination
												rowsPerPageOptions={[
													10,
													20,
													30,
													{
														label: "All",
														value: -1
													}
												]}
												colSpan={7}
												count={payments?.length}
												rowsPerPage={rowsPerPage}
												page={page}
												SelectProps={{
													inputProps: {
														"aria-label":
															"rows per page"
													},
													native: true
												}}
												onPageChange={handleChangePage}
												onRowsPerPageChange={
													handleChangeRowsPerPage
												}
												ActionsComponent={
													TablePaginationActions
												}
											/>
										</TableRow>
									</TableFooter>
								</Table>
							</TableContainer>
						</>
					)}
					{isDone && payments.length === 0 && (
						<Typography sx={{ mt: 1 }}>
							User has no payment history yet.
						</Typography>
					)}
				</Grid>
			</Grid>
		</>
	);
}

export default Profile;
