import React, { useEffect, useState } from "react";
import moment from "moment";
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
  IconButton,
} from "@mui/material";
import {
  LastPage as LastPageIcon,
  KeyboardArrowRight,
  KeyboardArrowLeft,
  FirstPage as FirstPageIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Utils from "../utils/utils";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const lastPage = Math.ceil(count / rowsPerPage) - 1;
  const handleFirstPageButtonClick = (e) => onPageChange(e, 0);
  const handleBackButtonClick = (e) => onPageChange(e, page - 1);
  const handleNextButtonClick = (e) => onPageChange(e, page + 1);

  const handleLastPageButtonClick = (e) =>
    onPageChange(e, Math.max(0, lastPage));

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
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
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function CustomTable(props) {
  const [data, setData] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [count, setCount] = useState(0);
  const [headers, setHeader] = useState([]);

  const excludedProperties = [
    // for searches
    "_id",
    "userId",
    "type",
    "__v",
    // for users
    "password",
    "type",
    // for payments
  ];

  const emptyRows = props.rowsPerPage - data.length;
  const handleChangePage = (e, newPage) => props.setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    const newRowsPerPage = parseInt(e.target.value);
    if (newRowsPerPage === count) {
      props.setPage(0);
      props.setRowsPerPage(count);
      return;
    }
    props.setRowsPerPage(newRowsPerPage);
    const newPage = Math.min(
      props.page,
      Math.floor(data.length / newRowsPerPage)
    );
    props.setPage(newPage);
  };

  useEffect(() => {
    setIsDone(props.isDone);
    setData(props.data);
    setCount(props.count);
    setHeader(props.headers);
  }, [isDone]);

  return (
    <>
      {isDone && data.length > 0 && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {headers.map((elem, idx) => {
                  return (
                    <TableCell
                      component="th"
                      scope="row"
                      key={idx}
                      align="left"
                    >
                      {elem}
                      {idx === 0 ? ` (${count} records)` : ""}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow
                  key={row._id}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  {Object.entries(row).map(([key, value]) => {
                    if (excludedProperties.includes(key)) {
                      return null;
                    }
                    if (key === "date" || key === "joined") {
                      return (
                        <TableCell key={`${row._id}-${key}`}>
                          {moment(row?.date).format("DD MMM YYYY")}
                        </TableCell>
                      );
                    }
                    if (key === "active") {
                      return (
                        <TableCell key={`${row._id}-${key}`}>
                          {value === true ? (
                            "Active"
                          ) : (
                            <span style={{ color: "red" }}>Inactive</span>
                          )}
                        </TableCell>
                      );
                    }
                    if (key === "blocked") {
                      return (
                        <TableCell key={`${row._id}-${key}`}>
                          {value === true ? (
                            <span style={{ color: "red" }}>Blocked</span>
                          ) : (
                            "Not-Blocked"
                          )}
                        </TableCell>
                      );
                    }
                    return value !== undefined && value !== null ? (
                      <TableCell key={`${row._id}-${key}`}>{value}</TableCell>
                    ) : null;
                  })}
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={count}
                  page={props.page}
                  rowsPerPage={props.rowsPerPage}
                  rowsPerPageOptions={[
                    10,
                    20,
                    30,
                    {
                      label: "All",
                      value: count,
                    },
                  ]}
                  colSpan={7}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
      {isDone && data.length === 0 && (
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
