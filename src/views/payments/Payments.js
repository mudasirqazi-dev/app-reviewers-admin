import React, { useEffect, useState, useRef } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import paymentServices from "../../services/payment";
import moment from "moment";
import { CSVLink } from "react-csv";
import { Grid, Typography, Box, Paper, IconButton } from "@mui/material";
import {
  LastPage,
  KeyboardArrowRight,
  KeyboardArrowLeft,
  FirstPage,
  Download,
} from "@mui/icons-material";
import { LinkButton, Text, Button, DateRangePicker } from "../../controls";
import { useTheme } from "@mui/material/styles";
import Utils from "../../utils/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CustomTable from "../../components/Table";
import utils from "../../utils/utils";

function Payments() {
  const navigate = useNavigate();
  const { token, isLoggedIn, setIsLoading, setErrorMessage } = useStore(
    (state) => state
  );
  const csvLinkRef = useRef();
  const [arr, setArr] = useState([
    moment().startOf("month").format("YYYY-MM-DD"),
    moment().endOf("month").format("YYYY-MM-DD"),
  ]);

  const [keyword, setKeyword] = useState("");
  const [payments, setPayments] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const headers = [
    {
      title: "User Name",
      key: "userName",
      align: "left",
      formatter: (k) => (
        <LinkButton text={k.userName} to={`/user/${k.userId}`}></LinkButton>
      ),
    },
    {
      title: "Date",
      key: "date",
      align: "center",
      formatter: (k) => moment(k.date).format("DD MMM YYYY"),
    },
    {
      title: "Amount",
      key: "amount",
      align: "right",
      formatter: (k) => utils.formatToCurrency(k.amount, "$"),
    },
    {
      title: "BTC",
      key: "btc",
      align: "right",
      formatter: (k) => utils.formatBtcToCurrency(k.btc, ""),
    },
    {
      title: "",
      key: "userName",
      align: "right",
      formatter: (row) => (
        <>
          <Button
            size="small"
            variant="text"
            width={100}
            icon={<Download />}
            text="Invoice"
            onClick={() => handleCreateInvoice(row)}
          >
            Invoice
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, []);

  useEffect(() => {
    reload();
  }, [keyword, arr]);

  const reload = async () => {
    if (!keyword) setIsLoading(true);
    let from = arr[0];
    let to = arr[1];
    paymentServices.get(token, { keyword, from, to }).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }
      setPayments(result.data.results);
      setCount(result.data.count);
      setIsDone(true);
      setIsLoading(false);
    });
  };

  const getCsvData = () => {
    const headers = [
      { label: "User Name", key: "userName" },
      { label: "Amount (USD)", key: "amount" },
      { label: "BTC", key: "btc" },
      { label: "Date", key: "date" },
    ];

    const csvData = [
      headers.map((header) => header.label),
      ...payments?.map((item) => headers.map((header) => item[header.key])),
    ];

    return csvData;
  };

  const handleExport = () => csvLinkRef.current.link.click();

  const handleCreateInvoice = (data) => {
    try {
      let html = Utils.getInvoiceHtml();
      html = Utils.replaceAll(`{name}`, data?.userName, html);
      html = Utils.replaceAll(
        `{invoiceNumber}`,
        moment(data?.date).format("X"),
        html
      );
      html = Utils.replaceAll(
        `{date}`,
        moment(data?.date).format("DD MMMM YYYY"),
        html
      );
      html = Utils.replaceAll(
        `{description}`,
        `Credits purchased with amount ${Utils.formatToCurrency(
          data?.amount,
          "$"
        )}`,
        html
      );
      html = Utils.replaceAll(
        `{amount}`,
        Utils.formatToCurrency(data?.amount, "$"),
        html
      );

      var HTMLStringContainer = document.createElement("div");
      HTMLStringContainer.setAttribute("id", "invoiceTemplateId");
      HTMLStringContainer.innerHTML = html;
      HTMLStringContainer.style.fontSize = "30px";
      document.body.append(HTMLStringContainer);
      html2canvas(document.getElementById("invoiceTemplateId")).then(
        (canvas) => {
          try {
            const imgData = canvas.toDataURL("image/jpeg");
            const pdf = new jsPDF("p", "px", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("download.pdf");
            document.getElementById("invoiceTemplateId").remove();
          } catch {
            setErrorMessage("Something went wrong.");
          }
        }
      );
    } catch {
      setErrorMessage("Something went wrong.");
    }
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={12}>
        <Typography component="p" variant="h4">
          Payments
        </Typography>
      </Grid>

      <Grid item xs={12} md={12}>
        <Box component={Paper} sx={{ p: 2 }}>
          <Grid container>
            <Grid item variant="h6" xs={8} md={8}>
              <Text
                label="Type to search payments"
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
          <Typography variant="p" sx={{ float: "left", pt: 1 }}>
            Total purchases:{" "}
            {payments?.length > 0
              ? Utils.formatToCurrency(
                  payments?.reduce((a, b) => a + b.amount, 0),
                  "$"
                )
              : "$0"}{" "}
            |{" "}
            {payments?.length > 0
              ? Utils.formatBtcToCurrency(
                  payments?.reduce((a, b) => a + parseFloat(b.btc), 0),
                  " BTC"
                )
              : "0 BTC"}
          </Typography>

          {payments?.length > 0 && (
            <Button
              sx={{ float: "right" }}
              icon={<Download />}
              text="Export"
              onClick={handleExport}
              width={120}
            ></Button>
          )}

          <CSVLink
            ref={csvLinkRef}
            data={getCsvData()}
            filename={"payments-data.csv"}
          ></CSVLink>

          {isDone && (
            <CustomTable
              isDone={isDone}
              data={payments}
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
  );
}

export default Payments;
