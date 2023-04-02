import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import {
  QueryStats,
  GroupAdd,
  AccountBalance,
  Loyalty,
} from "@mui/icons-material";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import userService from "../../services/user";

function BasicCard({ color, number, icon, text }) {
  return (
    <Card sx={{ bgcolor: `${color}` }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item sx={4} md={4}>
            <Box sx={{ pl: 3, pt: 1 }}>{icon}</Box>
          </Grid>
          <Grid item sx={8} md={8}>
            <Grid container spacing={2}>
              <Grid item sx={12} md={12}>
                <Typography variant="h2">{number}</Typography>
              </Grid>

              <Grid item sx={12} md={12}>
                <Typography variant="p">{text}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function Home() {
  let [totalUsers, setTotalUsers] = useState("");
  const navigate = useNavigate();
  const { token, isLoggedIn, setErrorMessage, setIsLoading } = useStore(
    (state) => state
  );

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");

    userService.getTotalUsers(token).then((r) => {
      if (r.error) {
        setErrorMessage(r.error);
        setIsLoading(false);
        return;
      }
      if (r.data) {
        setTotalUsers(r.data);
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12} md={12}>
          <Typography component="p" variant="h4">
            Dashboard
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <BasicCard
            number={20}
            icon={<GroupAdd color="error" sx={{ fontSize: 60 }} />}
            text="Total users"
            color="#F6A5C0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <BasicCard
            number={20}
            icon={<AccountBalance color="info" sx={{ fontSize: 60 }} />}
            text="Payments till date"
            color="#B0E0E6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <BasicCard
            number={20}
            icon={<Loyalty color="warning" sx={{ fontSize: 60 }} />}
            text="Active subscriptions"
            color="#F0D6AD"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <BasicCard
            number={22220}
            icon={<QueryStats color="disabled" sx={{ fontSize: 60 }} />}
            text="Searches till date"
            color="#D1D1D1"
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
