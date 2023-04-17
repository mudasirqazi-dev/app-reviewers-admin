import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import {
  AppsTwoTone,
  CreditScoreTwoTone,
  Groups2TwoTone,
  QueryStatsTwoTone,
} from "@mui/icons-material";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import statsService from "../../services/stats";
import Payments from "./charts/Payments";
import Utils from "../../utils/utils";
import Searches from "./charts/Searches";

function BasicCard({ color, number, icon, text }) {
  return (
    <Card sx={{ bgcolor: `${color}`, textAlign: "center" }}>
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Box>{icon}</Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ fontWeight: "light" }}>
              {Utils.formatToNumber(number) || 0}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="p">{text}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function Home() {
  let [users, setUsers] = useState(0);
  let [payments, setPayments] = useState(0);
  let [apps, setApps] = useState(0);
  let [searches, setSearches] = useState(0);
  const navigate = useNavigate();

  const { token, isLoggedIn, setErrorMessage, setIsLoading } = useStore(
    (state) => state
  );

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");

    statsService.get(token).then((r) => {
      if (r.error) {
        setErrorMessage(r.error);
        setIsLoading(false);
        return;
      }
      if (r.data) {
        setUsers(r.data.users);
        setPayments(r.data.payments);
        setApps(r.data.apps);
        setSearches(r.data.searches);
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={12}>
        <Typography component="p" variant="h4">
          Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <Typography component="p" variant="h5">
          Statistics
        </Typography>
      </Grid>

      <Grid item xs={12} sm={12} md={6} lg={3}>
        <BasicCard
          number={users}
          icon={<Groups2TwoTone color="warning" sx={{ fontSize: 60 }} />}
          text="Total users"
          color="#FEF6E1"
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6} lg={3}>
        <BasicCard
          number={payments}
          icon={<CreditScoreTwoTone color="error" sx={{ fontSize: 60 }} />}
          text="Payments till date ($)"
          color="#FEE5E1"
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6} lg={3}>
        <BasicCard
          number={apps}
          icon={<AppsTwoTone sx={{ fontSize: 60, color: "#5E72FF" }} />}
          text="Total apps"
          color="#EEF0FF"
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6} lg={3}>
        <BasicCard
          number={searches}
          icon={<QueryStatsTwoTone color="success" sx={{ fontSize: 60 }} />}
          text="Searches till date"
          color="#DDFFDA"
        />
      </Grid>

      <Payments />
      <Searches />
    </Grid>
  );
}

export default Home;
