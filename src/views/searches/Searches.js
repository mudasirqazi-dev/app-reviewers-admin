import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import searchServices from "../../services/search";
import userServices from "../../services/user";
import paymentServices from "../../services/payment";
import moment from "moment";
import { Grid, Typography, Box, Paper } from "@mui/material";
import { Text, DateRangePicker } from "../../controls";
import CustomTable from "../../components/Table";

function Searches() {
  const navigate = useNavigate();
  const [arr, setArr] = useState([
    moment("01-01-2023").format("YYYY-MM-DD"),
    moment().endOf("month").format("YYYY-MM-DD"),
  ]);

  const { token, isLoggedIn, setIsLoading, setErrorMessage } = useStore(
    (state) => state
  );

  const [keyword, setKeyword] = useState("");
  // for searches
  const [searches, setSearches] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [headers, setHeaders] = useState([
    "Users",
    "Credits",
    "Keyword",
    "Results",
    "Date",
  ]);

  // for users
  const [users, setUsers] = useState([]);
  const [isDone1, setIsDone1] = useState(false);
  const [count1, setCount1] = useState(0);
  const [page1, setPage1] = useState(0);
  const [rowsPerPage1, setRowsPerPage1] = useState(10);
  const [headers1, setHeaders1] = useState([
    "Name",
    "Email",
    "Active",
    "Blocked",
    "Joined",
    "Points",
  ]);

  // for payments
  const [payments, setPayments] = useState([]);
  const [isDone2, setIsDone2] = useState(false);
  const [count2, setCount2] = useState(0);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(10);
  const [headers2, setHeaders2] = useState(["User Id", "Amount", "Date"]);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, []);

  useEffect(() => {
    reload();
    getUsers();
    getPayments();
  }, [keyword, arr, page, rowsPerPage]);

  const reload = async () => {
    setIsDone(false);
    if (!keyword) setIsLoading(true);
    let from = arr[0];
    let to = arr[1];
    setSearches([]);
    searchServices
      .get(token, { keyword, from, to, page: page, limit: rowsPerPage })
      .then((result) => {
        if (result.error) {
          setErrorMessage(result.error);
          setIsLoading(false);
          return;
        }
        setSearches(result.data.results);
        setCount(result.data.count);
        setIsDone(true);
        setIsLoading(false);
      });
  };

  const getUsers = async () => {
    setIsDone1(false);
    if (!keyword) setIsLoading(true);
    let from = arr[0];
    let to = arr[1];
    setUsers([]);
    userServices
      .get(token, { keyword, from, to, page: page1, limit: rowsPerPage1 })
      .then((result) => {
        if (result.error) {
          setErrorMessage(result.error);
          setIsLoading(false);
          return;
        }
        setUsers(result.data.results);
        setCount1(result.data.count);
        setIsDone1(true);
        setIsLoading(false);
      });
  };

  const getPayments = async () => {
    setIsDone2(false);
    if (!keyword) setIsLoading(true);
    let from = arr[0];
    let to = arr[1];
    setPayments([]);
    paymentServices
      .get(token, { keyword, from, to, page: page2, limit: rowsPerPage2 })
      .then((result) => {
        if (result.error) {
          setErrorMessage(result.error);
          setIsLoading(false);
          return;
        }
        setPayments(result.data.results);
        setCount2(result.data.count);
        setIsDone2(true);
        setIsLoading(false);
      });
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
              <Grid item variant="h6" xs={8} md={8}>
                <Text
                  label="Type to search keyword or user-name"
                  value={keyword}
                  onChange={setKeyword}
                />
              </Grid>
              <Grid item xs={4} md={4} sx={{ pl: 2 }}>
                <DateRangePicker arr={arr} setArr={setArr} />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={12}>
          <Box component={Paper} sx={{ p: 2 }}>
            {isDone && (
              <CustomTable
                isDone={isDone}
                data={searches}
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

        <Grid item xs={12} md={12}>
          <Box component={Paper} sx={{ p: 2 }}>
            {isDone1 && (
              <CustomTable
                isDone={isDone1}
                data={users}
                headers={headers1}
                count={count1}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
              />
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={12}>
          <Box component={Paper} sx={{ p: 2 }}>
            {isDone2 && (
              <CustomTable
                isDone={isDone2}
                data={payments}
                headers={headers2}
                count={count2}
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

export default Searches;
