import React from "react";
import {
	Box,
	Table,
	TableContainer,
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

function TablePaginationActions(props) {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;
	const lastPage = Math.ceil(count / rowsPerPage) - 1;
	const handleFirstPageButtonClick = e => onPageChange(e, 0);
	const handleBackButtonClick = e => onPageChange(e, page - 1);
	const handleNextButtonClick = e => onPageChange(e, page + 1);
	const handleLastPageButtonClick = e =>
		onPageChange(e, Math.max(0, lastPage));

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
				disabled={page >= lastPage}
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
				disabled={page >= lastPage}
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

function CustomTable({
	rowsPerPage,
	setPage,
	page,
	setRowsPerPage,
	headers,
	data,
	isDone,
	count
}) {
	const emptyRows = rowsPerPage - data?.length;
	const handleChangePage = (e, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = e => {
		const newRowsPerPage = parseInt(e.target.value);
		if (newRowsPerPage === count) {
			setPage(0);
			setRowsPerPage(count);
			return;
		}
		setRowsPerPage(newRowsPerPage);
		const newPage = Math.min(
			page,
			Math.floor(data?.length / newRowsPerPage)
		);
		setPage(newPage);
	};

	return (
		<>
			{isDone && data?.length > 0 && (
				<TableContainer>
					<Table size="small">
						<TableHead>
							<TableRow>
								{headers?.map((elem, idx) => {
									return (
										<TableCell
											component="th"
											scope="row"
											key={idx}
											align={elem.align}
										>
											{elem.title}
										</TableCell>
									);
								})}
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.map(row => (
								<TableRow
									key={row._id}
									sx={{
										"&:last-child td, &:last-child th": {
											border: 0
										}
									}}
								>
									{headers?.map((elem, idx) => (
										<TableCell
											key={`${row._id}-${idx}`}
											align={elem.align}
										>
											{elem.formatter(row) || "-"}
										</TableCell>
									))}
								</TableRow>
							))}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: 33 * emptyRows
									}}
								>
									<TableCell colSpan={headers?.length} />
								</TableRow>
							)}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TablePagination
									count={count}
									page={page}
									rowsPerPage={rowsPerPage}
									rowsPerPageOptions={[
										10,
										20,
										30,
										{
											label: "All",
											value: count
										}
									]}
									colSpan={7}
									SelectProps={{
										inputProps: {
											"aria-label": "rows per page"
										},
										native: true
									}}
									onPageChange={handleChangePage}
									onRowsPerPageChange={
										handleChangeRowsPerPage
									}
									ActionsComponent={TablePaginationActions}
								/>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
			)}
			{isDone && data?.length === 0 && (
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
		</>
	);
}

export default CustomTable;
