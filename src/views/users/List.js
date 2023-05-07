import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/store";
import userServices from "../../services/user";
import { Button, LinkButton, Text } from "../../controls";
import moment from "moment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Grid, Typography, Box, Paper, IconButton } from "@mui/material";
import Confirm from "../../components/Confirm";
import DFForm from "../../components/DialogForCreate";
import DFCredits from "../../components/DialogForCredits";
import DFEdit from "../../components/DialogForEdit";
import DFRestorePassword from "../../components/DialogForRestorePassword";
import CustomTable from "../../components/Table";
import utils from "../../utils/utils";

function List() {
  const [openToDeleteUser, setOpenToDeleteUser] = useState(false);
  const [openToBlockUser, setOpenToBlockUser] = useState(false);
  const [openToActivateUser, setOpenToActivateUser] = useState(false);
  const [openToRestorePassword, setOpenToRestorePassword] = useState(false);
  const [openToCreate, setOpenToCreate] = useState(false);
  const [openToEdit, setOpenToEdit] = useState(false);
  const [openForPoints, setOpenForPoints] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [obj, setObj] = useState(null);
  const navigate = useNavigate();

  const { token, isLoggedIn, setIsLoading, setErrorMessage } = useStore(
    (state) => state
  );

  const [keyword, setKeyword] = useState("");
  const [list, setList] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const headers = [
    {
      title: "Name",
      key: "name",
      align: "left",
      formatter: (k) => (
        <LinkButton text={k.name} to={`/user/${k._id}`}></LinkButton>
      ),
    },
    {
      title: "Email",
      key: "email",
      align: "left",
      formatter: (k) => k["email"],
    },
    {
      title: "Active",
      key: "active",
      align: "center",
      formatter: (k) =>
        k.active ? (
          <Typography>Active</Typography>
        ) : (
          <Typography color="error">Inactive</Typography>
        ),
    },
    {
      title: "Blocked",
      key: "blocked",
      align: "center",
      formatter: (k) =>
        k.blocked ? (
          <Typography color="error">Blocked</Typography>
        ) : (
          <Typography>Active</Typography>
        ),
    },
    {
      title: "Points",
      key: "points",
      align: "center",
      formatter: (k) => utils.formatToNumber(k.points),
    },
    {
      title: "Joined",
      key: "joined",
      align: "center",
      formatter: (k) => moment(k.joined).format("DD MMM YYYY"),
    },
    {
      title: "Actions",
      key: "userName",
      align: "left",
      formatter: (row) => (
        <>
          <IconButton onClick={(event) => handleClick(event, row)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  const handleClick = (event, obj) => {
    setAnchorEl(event.currentTarget);
    setObj(obj);
  };

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, []);

  useEffect(() => {
    reload();
  }, [keyword, page, rowsPerPage]);

  const reload = async () => {
    if (!keyword) setIsLoading(true);
    userServices
      .get(token, { keyword, page: page, limit: rowsPerPage })
      .then((result) => {
        if (result.error) {
          setErrorMessage(result.error);
          setIsLoading(false);
          return;
        }
        setList(result.data.results);
        setCount(result.data.count);
        setIsDone(true);
        setAnchorEl(null);
        setObj(null);
        setIsLoading(false);
      });
  };

  const handleDeleteUser = () => {
    userServices
      .deleteUserById(obj?._id)
      .then((res) => {
        if (res.error) {
          setErrorMessage(res.error);
          setIsLoading(false);
          return;
        }
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
        open={openToDeleteUser}
        onNo={() => {
          setOpenToDeleteUser(false);
          setObj(null);
          setAnchorEl(null);
        }}
        onYes={() => {
          setOpenToDeleteUser(false);
          handleDeleteUser();
        }}
        title="Are you sure and want to delete this user?"
        body="This action can not be undone!"
      />
      {/* Confirm dialog for updating if user is blocked or not */}
      <Confirm
        open={openToBlockUser}
        onNo={() => {
          setOpenToBlockUser(false);
          setObj(null);
          setAnchorEl(null);
        }}
        onYes={() => {
          setOpenToBlockUser(false);
          updateIsUserBlocked();
        }}
        body="Are you sure and want to update user's block status?"
      />
      {/* Confirm dialog for updating if user is active or not */}
      <Confirm
        open={openToActivateUser}
        onNo={() => {
          setOpenToActivateUser(false);
          setObj(null);
          setAnchorEl(null);
        }}
        onYes={() => {
          setOpenToActivateUser(false);
          updateIsUserActive();
        }}
        body="Are you sure and want to update user's active status?"
      />

      {/* Open Dialog for restoring password */}
      <DFRestorePassword
        open={openToRestorePassword}
        obj={obj}
        onClose={() => {
          setObj(null);
          setOpenToRestorePassword(false);
          setAnchorEl(null);
        }}
        onSuccess={() => {
          setObj(null);
          setOpenToRestorePassword(false);
          reload();
        }}
      />

      {/* Open Dialog for creating new user */}
      <DFForm
        open={openToCreate}
        onClose={() => {
          setObj(null);
          setOpenToCreate(false);
          setAnchorEl(null);
        }}
        obj={obj}
        onSuccess={() => {
          setObj(null);
          setOpenToCreate(false);
          reload();
        }}
      />

      {/* Open Dialog for editing user name */}
      <DFEdit
        obj={obj}
        open={openToEdit}
        onClose={() => {
          setObj(null);
          setOpenToEdit(false);
          setAnchorEl(null);
        }}
        onSuccess={() => {
          setObj(null);
          setOpenToEdit(false);
          reload();
        }}
      />

      {/* Open Dialog for adding points */}
      <DFCredits
        open={openForPoints}
        obj={obj}
        onClose={() => {
          setObj(null);
          setOpenForPoints(false);
          setAnchorEl(null);
        }}
        onSuccess={() => {
          setObj(null);
          setOpenForPoints(false);
          reload();
        }}
      />

      {/* Menu For options */}
      <Menu
        id={`longMenu_${obj?._id}`}
        MenuListProps={{
          "aria-labelledby": `longButton_${obj?._id}`,
        }}
        anchorEl={anchorEl}
        keepMounted={false}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
          setObj(null);
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenToEdit(true);
          }}
        >
          Edit name
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenForPoints(true);
          }}
        >
          Add credits
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenToActivateUser(true);
          }}
        >
          {obj?.active ? "Deactivate" : "Activate"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenToBlockUser(true);
          }}
        >
          {obj?.blocked ? "Unblock user" : "Block user"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenToRestorePassword(true);
          }}
        >
          Restore password
        </MenuItem>
        <MenuItem
          sx={{
            color: "red",
          }}
          onClick={() => {
            setOpenToDeleteUser(true);
          }}
        >
          Delete
        </MenuItem>
      </Menu>

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
              setOpenToCreate(true);
            }}
            text="Create user"
            width={200}
          ></Button>
        </Grid>

        <Grid item xs={12} md={12}>
          <Box component={Paper} sx={{ p: 2 }}>
            <Text
              label="Type to search list"
              value={keyword}
              onChange={setKeyword}
            />
            {isDone && (
              <CustomTable
                isDone={isDone}
                data={list}
                headers={headers}
                count={count}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default List;
