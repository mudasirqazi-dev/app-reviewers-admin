import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import searchServices from "../../services/search";
import moment from "moment";
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
	IconButton,
	Select,
	MenuItem
} from "@mui/material";
import {
	LastPage as LastPageIcon,
	KeyboardArrowRight,
	KeyboardArrowLeft,
	FirstPage as FirstPageIcon
} from "@mui/icons-material";
import { LinkButton, Text, Button } from "../../controls";
import { useTheme } from "@mui/material/styles";
import DateRangePicker from "../../controls/DateRangePicker";
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

function Searches() {
	const navigate = useNavigate();
	const [keyword, setKeyword] = useState("");
	const [interval, setInterval] = useState("0");
	const [searches, setSearches] = useState([]);
	const [arr, setArr] = useState([
		moment().startOf("month").format("YYYY-MM-DD"),
		moment().endOf("month").format("YYYY-MM-DD")
	]);

	const { token, isLoggedIn, setIsLoading, setErrorMessage } = useStore(
		state => state
	);

	const [isDone, setIsDone] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - searches.length) : 0;
	const handleChangePage = (e, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = e => {
		setRowsPerPage(parseInt(e.target.value));
		setPage(0);
	};

	useEffect(() => {
		if (!isLoggedIn) navigate("/login");
	}, []);

	useEffect(() => {
		reload();
	}, [keyword, arr]);

	const reload = async () => {
		if (!keyword) setIsLoading(true);
		let from = arr[0];
		let to = arr[1];
		searchServices.get(token, { keyword, from, to }).then(result => {
			if (result.error) {
				setErrorMessage(result.error);
				setIsLoading(false);
				return;
			}
			setSearches(result.data);
			setIsDone(true);
			setIsLoading(false);
		});
	};

	const handleIntervalChange = event => {
		setInterval(event.target.value);
		switch (event.target.value) {
			case "0":
				setArr(["", ""]);
				break;
			case "daily":
				setArr([
					moment().format("YYYY-MM-DD"),
					moment().format("YYYY-MM-DD")
				]);
				break;
			case "weekly":
				const startOfWeek = moment().startOf("week");
				const endOfWeek = moment().endOf("week");
				setArr([startOfWeek.toDate(), endOfWeek.toDate()]);
				break;
			case "monthly":
				const startOfMonth = moment().startOf("month");
				const endOfMonth = moment().endOf("month");
				setArr([startOfMonth.toDate(), endOfMonth.toDate()]);
				break;
			default:
				setArr([null, null]);
				break;
		}
	};

	return (
		<>
			<Grid container spacing={2} sx={{ p: 2 }}>
				<Grid item xs={12} md={12}>
					<Typography component="p" variant="h4">
						Searches
					</Typography>
				</Grid>

				<Grid item xs={12} md={12}>
					<Box component={Paper} sx={{ p: 2 }}>
						<Grid container>
							<Grid item variant="h6" xs={6} md={6}>
								<Text
									label="Type to search keyword or user-name"
									value={keyword}
									onChange={setKeyword}
								/>
							</Grid>
							<Grid item xs={1} md={1}></Grid>
							<Grid item xs={5} md={5}>
								<DateRangePicker arr={arr} setArr={setArr} />
							</Grid>
						</Grid>
					</Box>
				</Grid>

				<Grid item xs={12} md={12}>
					<Box component={Paper} sx={{ p: 2 }}>
						{isDone && searches.length > 0 && (
							<TableContainer>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell
												component="th"
												scope="row"
												align="left"
											>
												User ({searches.length} records)
											</TableCell>
											<TableCell
												component="th"
												scope="row"
												align="left"
											>
												Keyword
											</TableCell>
											<TableCell
												component="th"
												scope="row"
												align="right"
											>
												Cost
											</TableCell>
											<TableCell
												component="th"
												scope="row"
												align="right"
											>
												Results
											</TableCell>
											<TableCell
												component="th"
												scope="row"
												align="center"
											>
												Date
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{(rowsPerPage > 0
											? searches.slice(
													page * rowsPerPage,
													page * rowsPerPage +
														rowsPerPage
											  )
											: searches
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
													<LinkButton
														text={row?.userName}
														to={`/user/${row?.userId}`}
													/>
												</TableCell>
												<TableCell
													component="td"
													scope="row"
													align="left"
												>
													{row?.keyword}
												</TableCell>
												<TableCell
													component="td"
													scope="row"
													align="right"
												>
													{row?.type === "Paid"
														? Utils.formatToCurrency(
																row?.cost,
																"$"
														  )
														: "Free"}
												</TableCell>
												<TableCell
													component="td"
													scope="row"
													align="right"
												>
													{row?.results}
												</TableCell>
												<TableCell
													component="td"
													scope="row"
													align="center"
												>
													{moment(row?.date).format(
														"DD MMM YYYY"
													)}
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
												count={searches?.length}
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
						)}
						{isDone && searches.length === 0 && (
							<TableContainer>
								<Table size="small" sx={{ mt: 2 }}>
									<TableBody>
										<TableRow>
											<TableCell>
												No data found.
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						)}
					</Box>
				</Grid>
			</Grid>
		</>
	);
}

export default Searches;
