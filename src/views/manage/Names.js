import React, { useEffect, useState, useRef } from "react";
import useStore from "../../store/store";
import nameService from "../../services/name";
import { SaveTwoTone } from "@mui/icons-material";
import CSVReader from "react-csv-reader";
import MdButton from "../../controls/Button";

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
} from "@mui/material";
import {
  LastPage as LastPageIcon,
  KeyboardArrowRight,
  KeyboardArrowLeft,
  FirstPage as FirstPageIcon,
} from "@mui/icons-material";
import { Button, Text } from "../../controls";
import { useTheme } from "@mui/material/styles";
import Confirm from "../../components/Confirm";
import DialogForAppName from "../../components/DialogForAppName";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const handleFirstPageButtonClick = (e) => onPageChange(e, 0);
  const handleBackButtonClick = (e) => onPageChange(e, page - 1);
  const handleNextButtonClick = (e) => onPageChange(e, page + 1);

  const handleLastPageButtonClick = (e) =>
    onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

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
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function Names() {
  const [records, setRecords] = useState([]);
  const [name, setName] = useState("");
  const [names, setNames] = useState("");

  const [openForDelete, setOpenForDelete] = useState(false);
  const [openForEdit, setOpenForEdit] = useState(false);

  const [obj, setObj] = useState(null);
  const [keyword, setKeyword] = useState("");
  const fileInputRef = useRef(null);

  const {
    token,
    isLoggedIn,
    setIsLoading,
    setErrorMessage,
    setSuccessMessage,
    setInfoMessage,
  } = useStore((state) => state);

  const [isDone, setIsDone] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - names.length) : 0;
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setPage(0);
  };

  useEffect(() => {
    reload();
  }, [keyword]);

  const reload = async () => {
    if (!keyword) setIsLoading(true);

    nameService.get(token, { keyword }).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }
      setNames(result.data);
      setIsDone(true);
      setIsLoading(false);
    });
  };

  const hanldeSubmit = (e) => {
    if (name.length <= 2) {
      setErrorMessage("Name should at least be three characters long.");
      return;
    }
    setIsLoading(true);

    if (name.includes(";")) {
      let arr = name
        .split(";")
        .map((elem) => elem.trim())
        .filter((k) => k.length > 0)
        .map((k) => {
          return {
            name: k,
          };
        });
      createMany(arr);
      return;
    }

    nameService.create(token, { name: name }).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setName("");
      reload();
      setSuccessMessage("Name has been added successfully!");
    });
  };

  const handleFile = (data, fileInfo) => {
    if (fileInfo.type === "text/csv" || fileInfo.type === "text/plain") {
      const newRecords = data.flat().filter(Boolean);
      setRecords(newRecords);
    } else {
      setErrorMessage("Please select a text or CSV file.");
    }
  };

  const addRecords = () => {
    createMany(records);
  };

  const createMany = (arr) => {
    if (arr.length === 0) return;
    nameService.createMany(token, arr).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      reload();
      setName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (result.data.saved === 0) {
        setInfoMessage("All the data in this file already exists.");
        return;
      }
      setSuccessMessage(
        `Data has been added successfully. ${result.data.saved} records saved.`
      );
    });
  };

  const deleteName = () => {
    nameService
      .delete(token, obj?._id)
      .then((res) => {
        if (res.error) {
          setErrorMessage(res.error);
          setIsLoading(false);
          return;
        }

        setObj(null);
        setSuccessMessage("App deleted successfully.");
        reload();
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  return (
    <>
      {/* Confirm dialog for deleting app */}
      <Confirm
        open={openForDelete}
        onNo={() => {
          setOpenForDelete(false);
          setObj(null);
        }}
        onYes={() => {
          setOpenForDelete(false);
          deleteName();
        }}
        title="Are you sure and want to delete this app?"
        body="This action can not be undone!"
      />

      {/* Open Dialog for editing app name */}
      <DialogForAppName
        open={openForEdit}
        obj={obj}
        onClose={() => {
          setObj(null);
          setOpenForEdit(false);
        }}
        onSuccess={() => {
          setObj(null);
          setOpenForEdit(false);
          reload();
        }}
      />

      <Grid container spacing={2} sx={{ p: 2, pt: 2 }}>
        <Grid item xs={12} md={6}>
          <Box component={Paper} sx={{ p: 2 }}>
            <Typography component="p" variant="h5">
              App Name
            </Typography>
            <Text
              value={name}
              onChange={setName}
              label="App name"
              multiline
              minRows={3}
              helperText="Enter app names and press the button to save. You can save single as well as multiple names at once. If multiple, give semicolon ; separated names"
            />
            <Button
              text="Save Changes"
              icon={<SaveTwoTone />}
              sx={{ mt: 2 }}
              onClick={hanldeSubmit}
            />
          </Box>

          <Box component={Paper} sx={{ p: 2, mt: 2 }}>
            <Typography component="p" variant="h5">
              Upload a file
            </Typography>
            <Typography
              component="p"
              variant="p"
              sx={{ mt: 1, mb: 2, color: "grey" }}
            >
              Select a text or csv file to upload data
            </Typography>

            <CSVReader
              cssClass="csv-reader-input"
              onFileLoaded={handleFile}
              parserOptions={{ header: true, skipEmptyLines: true }}
              accept=".csv,.txt"
              ref={fileInputRef}
              inputId="ObiWan"
              inputName="ObiWan"
            />

            <MdButton
              text="Upload file"
              icon={<SaveTwoTone />}
              sx={{ mt: 2 }}
              onClick={addRecords}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box component={Paper} sx={{ p: 2 }}>
            <Typography component="p" variant="h5">
              Apps List
            </Typography>
            <Text
              label="Type to search apps"
              value={keyword}
              onChange={setKeyword}
            />
            {isDone && names.length > 0 && (
              <>
                <TableContainer sx={{ mt: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell component="th" scope="row" align="left">
                          Names ({names.length} records)
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          align="center"
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? names.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : names
                      ).map((row) => (
                        <TableRow
                          key={row._id}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell component="td" scope="row" align="left">
                            {row?.name}
                          </TableCell>
                          <TableCell component="td" scope="row" align="right">
                            <Button
                              text="Edit"
                              size="small"
                              variant="text"
                              height={20}
                              width={50}
                              onClick={() => {
                                setObj(row);
                                setOpenForEdit(true);
                              }}
                            ></Button>
                            <Button
                              text="Delete"
                              size="small"
                              variant="text"
                              height={20}
                              width={50}
                              onClick={() => {
                                setObj(row);
                                setOpenForDelete(true);
                              }}
                            ></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: 53 * emptyRows,
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
                              value: -1,
                            },
                          ]}
                          colSpan={2}
                          count={names?.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
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
              </>
            )}
            {isDone && names.length === 0 && (
              <Typography sx={{ mt: 1 }}>No data found.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Names;
