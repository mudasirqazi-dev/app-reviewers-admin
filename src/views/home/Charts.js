import Chart from "chart.js";
import { Select, MenuItem } from "@mui/material";
// import { CategoryScale } from "chart.js";
import { useEffect, useState } from "react";
import useStore from "../../store/store";
import paymentServices from "../../services/payment";
import moment from "moment";

// Chart.register(CategoryScale);

function MyCharts() {
  const [arr, setArr] = useState(["2023-01-01", "2023-06-01"]);
  const [keyword, setKeyword] = useState("");
  const [payments, setPayments] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [dates, setDates] = useState([]);
  const [interval, setInterval] = useState("0");

  const { token, isLoggedIn, setIsLoading, setErrorMessage } = useStore(
    (state) => state
  );

  useEffect(() => {
    if (!keyword) setIsLoading(true);
    let from = arr[0];
    let to = arr[1];
    paymentServices.get(token, { keyword, from, to }).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }
      let k = [];
      let m = [];
      result.data.forEach((item) => {
        k.push(moment(item.date).format("DD MMM YYYY"));
        m.push(item.amount);
      });
      setDates(k);
      setAmounts(m);

      setPayments(result.data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    let k = [];
    let m = [];
    payments.forEach((item) => {
      k.push(moment(item.date).format("DD MMM YYYY"));
      m.push(item.amount);
    });
    setDates(k);
    setAmounts(m);
  }, [interval]);

  useEffect(() => {
    if (dates.length > 0) {
      const ctx = document.getElementById("chartBar").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: dates,
          datasets: [
            {
              target: "origin",
              above: "rgb(255, 0, 0)",
              below: "rgb(0, 0, 255)",
              label: "Amount($) ",
              data: amounts,
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 0.5,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [dates]);

  const handleFilterChange = (event) => {
    const filter = event.target.value;
    if (filter === "weekly") {
      setPayments(
        payments.filter(
          (item) => new Date(item.date).week() === new Date().week()
        )
      );
    } else if (filter === "monthly") {
      setPayments(
        payments.filter(
          (item) => new Date(item.date).getMonth() === new Date().getMonth()
        )
      );
    } else if (filter === "yearly") {
      setPayments(
        payments.filter(
          (item) =>
            new Date(item.date).getFullYear() === new Date().getFullYear()
        )
      );
    }
  };

  return (
    <>
      <h1 sx={{ float: "left" }}>Payments</h1>
      <Select
        value={interval}
        onChange={handleFilterChange}
        sx={{ width: "200px", float: "right" }}
      >
        <MenuItem value="0">All time</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
        <MenuItem value="yearly">Yearly</MenuItem>
      </Select>
      {dates.length > 1 && <canvas id="chartBar"></canvas>}
    </>
  );
}

export default MyCharts;
