import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import searchServices from "../../services/search";
import moment from "moment";
import { Grid, Typography, Box, Paper } from "@mui/material";
import { Text, DateRangePicker, LinkButton } from "../../controls";
import CustomTable from "../../components/Table";
import utils from "../../utils/utils";

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
  const [searches, setSearches] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const headers = [
    {
      title: "Users",
      key: "userName",
      align: "left",
      formatter: (k) => (
        <LinkButton text={k.userName} to={`/user/${k.userId}`}></LinkButton>
      ),
    },
    {
      title: "Keyword",
      key: "keyword",
      align: "left",
      formatter: (k) => k["keyword"],
    },
    {
      title: "Credits",
      key: "cost",
      align: "center",
      formatter: (k) => utils.formatToNumber(k.cost),
    },
    {
      title: "Results",
      key: "results",
      align: "center",
      formatter: (k) => utils.formatToNumber(k.results),
    },
    {
      title: "Date",
      key: "date",
      align: "center",
      formatter: (k) => moment(k.date).format("DD MMM YYYY"),
    },
  ];

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, []);

  useEffect(() => {
    reload();
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
      </Grid>
    </>
  );
}

export default Searches;
