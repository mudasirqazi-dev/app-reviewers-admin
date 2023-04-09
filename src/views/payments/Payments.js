import React, { useEffect, useState, useRef, createRef } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import paymentServices from "../../services/payment";
import moment from "moment";
import { CSVLink } from "react-csv";
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
	LastPage,
	KeyboardArrowRight,
	KeyboardArrowLeft,
	FirstPage,
	Download
} from "@mui/icons-material";
import { LinkButton, Text, Button } from "../../controls";
import { useTheme } from "@mui/material/styles";
import DateRangePicker from "../../controls/DateRangePicker";
import Utils from "../../utils/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
				{theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
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
				{theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
			</IconButton>
		</Box>
	);
}

function Payments() {
	const navigate = useNavigate();
	const [keyword, setKeyword] = useState("");

	const { token, isLoggedIn, setIsLoading, setErrorMessage } = useStore(
		state => state
	);
	const [isDone, setIsDone] = useState(false);
	const [payments, setPayments] = useState([]);
	const [arr, setArr] = useState([
		moment().startOf("month").format("YYYY-MM-DD"),
		moment().endOf("month").format("YYYY-MM-DD")
	]);
	const csvLinkRef = useRef();

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - payments?.length) : 0;
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
		paymentServices.get(token, { keyword, from, to }).then(result => {
			if (result.error) {
				setErrorMessage(result.error);
				setIsLoading(false);
				return;
			}
			setPayments(result.data);
			setIsDone(true);
			setIsLoading(false);
		});
	};

	const getCsvData = () => {
		const headers = [
			{ label: "User Name", key: "userName" },
			{ label: "Amount (USD)", key: "amount" },
			{ label: "BTC", key: "btc" },
			{ label: "Date", key: "date" }
		];

		const csvData = [
			headers.map(header => header.label),
			...payments?.map(item => headers.map(header => item[header.key]))
		];

		return csvData;
	};

	const handleExport = () => csvLinkRef.current.link.click();

	const handleCreateInvoice = data => {
		try {
			let html = Utils.getInvoiceHtml();
			html = Utils.replaceAll(`{name}`, data?.userName, html);
			html = Utils.replaceAll(
				`{invoiceNumber}`,
				moment(data?.date).format("X"),
				html
			);
			html = Utils.replaceAll(
				`{date}`,
				moment(data?.date).format("DD MMMM YYYY"),
				html
			);
			html = Utils.replaceAll(
				`{description}`,
				`Credits purchased with amount ${Utils.formatToCurrency(
					data?.amount,
					"$"
				)}`,
				html
			);
			html = Utils.replaceAll(
				`{amount}`,
				Utils.formatToCurrency(data?.amount, "$"),
				html
			);

			var HTMLStringContainer = document.createElement("div");
			HTMLStringContainer.setAttribute("id", "invoiceTemplateId");
			HTMLStringContainer.innerHTML = html;
			HTMLStringContainer.style.fontSize = "30px";
			document.body.append(HTMLStringContainer);
			html2canvas(document.getElementById("invoiceTemplateId")).then(
				canvas => {
					try {
						const imgData = canvas.toDataURL("image/jpeg");
						const pdf = new jsPDF("p", "px", "a4");
						const imgProps = pdf.getImageProperties(imgData);
						const pdfWidth = pdf.internal.pageSize.getWidth();
						const pdfHeight =
							(imgProps.height * pdfWidth) / imgProps.width;
						pdf.addImage(
							imgData,
							"JPEG",
							0,
							0,
							pdfWidth,
							pdfHeight
						);
						pdf.save("download.pdf");
						document.getElementById("invoiceTemplateId").remove();
					} catch {
						setErrorMessage("Something went wrong.");
					}
				}
			);
		} catch {
			setErrorMessage("Something went wrong.");
		}
	};

	return (
		<Grid container spacing={2} sx={{ p: 2 }}>
			<Grid item xs={12} md={12}>
				<Typography component="p" variant="h4">
					Payments
				</Typography>
			</Grid>

			<Grid item xs={12} md={12}>
				<Box component={Paper} sx={{ p: 2 }}>
					<Grid container>
						<Grid item variant="h6" xs={6} md={6}>
							<Text
								label="Type to search payments"
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
					<Typography variant="p" sx={{ float: "left", pt: 1 }}>
						Total purchases:{" "}
						{payments?.length > 0
							? Utils.formatToCurrency(
									payments?.reduce((a, b) => a + b.amount, 0),
									"$"
							  )
							: "$0"}{" "}
						|{" "}
						{payments?.length > 0
							? Utils.formatBtcToCurrency(
									payments?.reduce(
										(a, b) => a + parseFloat(b.btc),
										0
									),
									" BTC"
							  )
							: "0 BTC"}
					</Typography>

					{payments?.length > 0 && (
						<Button
							sx={{ float: "right" }}
							icon={<Download />}
							text="Export"
							onClick={handleExport}
							width={120}
						></Button>
					)}

					<CSVLink
						ref={csvLinkRef}
						data={getCsvData()}
						filename={"payments-data.csv"}
					></CSVLink>

					{isDone && payments?.length > 0 && (
						<TableContainer sx={{ mt: 3 }}>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell
											component="th"
											scope="row"
											align="left"
										>
											User ({payments?.length} records)
										</TableCell>
										<TableCell
											component="th"
											scope="row"
											align="center"
										>
											Date
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
										<TableCell
											component="th"
											scope="row"
											align="right"
										></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{(rowsPerPage > 0
										? payments?.slice(
												page * rowsPerPage,
												page * rowsPerPage + rowsPerPage
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
												<LinkButton
													text={row?.userName}
													to={`/user/${row?.userId}`}
												/>
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
											<TableCell
												component="td"
												scope="row"
												align="right"
											>
												<Button
													size="small"
													variant="text"
													width={100}
													icon={<Download />}
													text="Invoice"
													onClick={() =>
														handleCreateInvoice(row)
													}
												>
													Invoice
												</Button>
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
					)}
					{isDone && payments?.length === 0 && (
						<TableContainer>
							<Table size="small" sx={{ mt: 2 }}>
								<TableBody>
									<TableRow>
										<TableCell>No data found.</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Box>
			</Grid>
		</Grid>
	);
}

export default Payments;
