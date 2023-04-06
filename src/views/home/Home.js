import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import { QueryStats, Loyalty, Groups, Payments } from "@mui/icons-material";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import dataService from "../../services/stats";
import MyCharts from "./Charts";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function BasicCard({ color, number, icon, text }) {
  return (
    <Card sx={{ bgcolor: `${color}`, textAlign: "center" }}>
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Box>{icon}</Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2">{number}</Typography>
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
  let [users, setUsers] = useState("");
  let [payments, setPayments] = useState("");
  let [searches, setSearches] = useState("");
  const navigate = useNavigate();
  const [htmlString, setHtmlString] = useState("");

  const { token, isLoggedIn, setErrorMessage, setIsLoading } = useStore(
    (state) => state
  );

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");

    dataService.get(token).then((r) => {
      if (r.error) {
        setErrorMessage(r.error);
        setIsLoading(false);
        return;
      }
      if (r.data) {
        setUsers(r.data.users);
        setPayments(r.data.payments);
        setSearches(r.data.searches);
        setIsLoading(false);
      }
    });
  }, []);

  const printDocument = () => {
    fetch("./template.html")
      .then((response) => response.text())
      .then((data) => {
        setHtmlString(data);
        html2canvas(data).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF();
          pdf.addImage(imgData, "JPEG", 0, 0);
          pdf.save("download.pdf");
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12} md={12}>
          <Typography component="p" variant="h4">
            Dashboard
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <BasicCard
            number={users}
            icon={<Groups color="warning" sx={{ fontSize: 60 }} />}
            text="Total users"
            color="#FEF6E1"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <BasicCard
            number={payments}
            icon={<Payments color="error" sx={{ fontSize: 60 }} />}
            text="Payments till date (in USD)"
            color="#FEE5E1"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <BasicCard
            number={20}
            icon={<Loyalty sx={{ fontSize: 60, color: "#5E72FF" }} />}
            text="Active subscriptions"
            color="#EEF0FF"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <BasicCard
            number={searches}
            icon={<QueryStats color="success" sx={{ fontSize: 60 }} />}
            text="Searches till date"
            color="#DDFFDA"
          />
        </Grid>

        <Grid item xs={12} md={12} sx={{ p: 2, m: 4 }}>
          <MyCharts />
        </Grid>
      </Grid>
    </>
  );
}
// F6A5C0, B0E0E6, F0D6AD, D1D1D1;
export default Home;
