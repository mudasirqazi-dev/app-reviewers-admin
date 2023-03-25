import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import userServices from "../../services/user";
import moment from "moment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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
import FormDialog from "../../components/DialogForCreate";
import DialogForCredits from "../../components/DialogForCredits";
import DialogForEdit from "../../components/DialogForEdit";
import DialogForRestorePassword from "../../components/DialogForRestorePassword";

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

function Users() {
  const [
    openConfirmDialogForDeletingUser,
    setOpenConfirmDialogForDeletingUser,
  ] = useState(false);
  const [
    openConfirmDialogForBlockingUser,
    setOpenConfirmDialogForBlockingUser,
  ] = useState(false);
  const [
    openConfirmDialogForActivatingUser,
    setOpenConfirmDialogForActivatingUser,
  ] = useState(false);
  const [
    openConfirmDialogForRestoringPassword,
    setOpenConfirmDialogForRestoringPassword,
  ] = useState(false);

  const [openForCreate, setOpenForCreate] = useState(false);
  const [openForEdit, setOpenForEdit] = useState(false);
  const [openForPoints, setOpenForPoints] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [obj, setObj] = useState(null);
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const { token, isLoggedIn, setIsLoading, setErrorMessage } = useStore(
    (state) => state
  );
  const [isDone, setIsDone] = useState(false);
  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setPage(0);
  };

  const handleClick = (event, obj) => {
    setAnchorEl(event.currentTarget);
    setObj(obj);
  };

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, []);

  useEffect(() => {
    reload();
  }, [keyword]);

  const reload = async () => {
    if (!keyword) setIsLoading(true);
    userServices.get(token, { keyword }).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }
      setUsers(result.data);
      setIsDone(true);
      setIsLoading(false);
    });
  };

  const deleteUser = () => {
    userServices
      .deleteUserById(obj?._id)
      .then((res) => {
        if (res.error) {
          setErrorMessage(res.error);
          setIsLoading(false);
          return;
        }

        setObj(null);
        reload();
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  const updateIsUserBlocked = () => {
    let id = obj?._id;
    let newStatus = obj.blocked ? false : true;
    userServices
      .updateIsUserBlocked(token, { userId: id, newStatus })
      .then((res) => {
        if (res.error) {
          setErrorMessage(res.error);
          setIsLoading(false);
          return;
        }

        setObj(null);
        reload();
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  const updateIsUserActive = () => {
    let id = obj?._id;
    let newStatus = obj.active ? false : true;
    userServices
      .updateIsUserActive(token, { userId: id, newStatus })
      .then((res) => {
        if (res.error) {
          setErrorMessage(res.error);
          setIsLoading(false);
          return;
        }

        setObj(null);
        reload();
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  return (
    <>
      {/* Confirm dialog for deleting user */}
      <Confirm
        open={openConfirmDialogForDeletingUser}
        onNo={() => {
          setOpenConfirmDialogForDeletingUser(false);
          setObj(null);
        }}
        onYes={() => {
          setOpenConfirmDialogForDeletingUser(false);
          deleteUser();
        }}
        title="Are you sure and want to delete this user?"
        body="This action can not be undone!"
      />
      {/* Confirm dialog for updating if user is blocked or not */}
      <Confirm
        open={openConfirmDialogForBlockingUser}
        onNo={() => {
          setOpenConfirmDialogForBlockingUser(false);
          setObj(null);
        }}
        onYes={() => {
          setOpenConfirmDialogForBlockingUser(false);
          updateIsUserBlocked();
        }}
        body="Are you sure and want to update user's block status?"
      />
      {/* Confirm dialog for updating if user is active or not */}
      <Confirm
        open={openConfirmDialogForActivatingUser}
        onNo={() => {
          setOpenConfirmDialogForActivatingUser(false);
          setObj(null);
        }}
        onYes={() => {
          setOpenConfirmDialogForActivatingUser(false);
          updateIsUserActive();
        }}
        body="Are you sure and want to update user's active status?"
      />

      {/* Open Dialog for restoring password */}
      <DialogForRestorePassword
        open={openConfirmDialogForRestoringPassword}
        obj={obj}
        onClose={() => {
          setObj(null);
          setOpenConfirmDialogForRestoringPassword(false);
        }}
        onSuccess={() => {
          setObj(null);
          setOpenConfirmDialogForRestoringPassword(false);
          reload();
        }}
      />

      {/* Open Dialog for creating new user */}
      <FormDialog
        open={openForCreate}
        onClose={() => {
          setObj(null);
          setOpenForCreate(false);
        }}
        obj={obj}
        onSuccess={() => {
          setObj(null);
          setOpenForCreate(false);
          reload();
        }}
      />

      {/* Open Dialog for editing user name */}
      <DialogForEdit
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

      {/* Open Dialog for adding points */}
      <DialogForCredits
        open={openForPoints}
        obj={obj}
        onClose={() => {
          setObj(null);
          setOpenForPoints(false);
        }}
        onSuccess={() => {
          setObj(null);
          setOpenForPoints(false);
          reload();
        }}
      />

      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={8} md={8}>
          <Typography component="p" variant="h4">
            Users
          </Typography>
        </Grid>
        <Grid
          sx={{ display: "flex", justifyContent: "flex-end" }}
          item
          xs={4}
          md={4}
        >
          <Button
            onClick={() => {
              setObj(null);
              setOpenForCreate(true);
            }}
            text="Create user"
            width={200}
          ></Button>
        </Grid>

        <Grid item xs={12} md={12}>
          <Box component={Paper} sx={{ p: 2 }}>
            <Typography variant="h5" xs={12} md={12}>
              Search users
            </Typography>

            <Text
              label="Type to search users"
              value={keyword}
              onChange={setKeyword}
            />
            {isDone && users.length > 0 && (
              <>
                <TableContainer sx={{ mt: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell component="th" scope="row" align="left">
                          Users ({users.length} records)
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          Email
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          Joined
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          Status
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          Engaged / Blocked
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          Credits
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? users.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : users
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
                          <TableCell component="td" scope="row" align="center">
                            {row?.email}
                          </TableCell>
                          <TableCell component="td" scope="row" align="center">
                            {moment(row?.joined).format("DD MMM YYYY")}
                          </TableCell>
                          <TableCell component="td" scope="row" align="center">
                            {row?.active ? (
                              <Typography>Active</Typography>
                            ) : (
                              <Typography color="error">Inactive</Typography>
                            )}
                          </TableCell>
                          <TableCell component="td" scope="row" align="center">
                            {row?.blocked ? (
                              <Typography color="error">Blocked</Typography>
                            ) : (
                              <Typography>Engaged</Typography>
                            )}
                          </TableCell>
                          <TableCell component="td" scope="row" align="center">
                            {row?.points}
                          </TableCell>
                          <TableCell component="td" scope="row" align="center">
                            <IconButton
                              aria-label={`more${row?._id}`}
                              id={`longButton_${row?._id}`}
                              aria-controls={
                                open ? `longMenu_${row?._id}` : undefined
                              }
                              aria-expanded={open ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={(event) => handleClick(event, row)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              id={`longMenu_${row?._id}`}
                              MenuListProps={{
                                "aria-labelledby": `longButton_${row?._id}`,
                              }}
                              anchorEl={anchorEl}
                              keepMounted
                              open={Boolean(anchorEl && obj?._id === row._id)}
                              onClose={() => setAnchorEl(null)}
                            >
                              <MenuItem
                                onClick={() => {
                                  setOpenForEdit(true);
                                }}
                              >
                                Edit
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  setOpenForPoints(true);
                                }}
                              >
                                Add Credits
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  setOpenConfirmDialogForActivatingUser(true);
                                }}
                              >
                                {row?.active ? "Deactivate" : "Activate"}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  setOpenConfirmDialogForBlockingUser(true);
                                }}
                              >
                                {row?.blocked ? "Engage User" : "Block User"}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  setOpenConfirmDialogForRestoringPassword(
                                    true
                                  );
                                }}
                              >
                                Restore Password
                              </MenuItem>
                              <MenuItem
                                sx={{ color: "red" }}
                                onClick={() => {
                                  setOpenConfirmDialogForDeletingUser(true);
                                }}
                              >
                                Delete
                              </MenuItem>
                            </Menu>
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
                          colSpan={7}
                          count={users?.length}
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
            {isDone && users.length === 0 && (
              <Typography sx={{ mt: 1 }}>No data found.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Users;
