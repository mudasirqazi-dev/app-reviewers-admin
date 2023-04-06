import validator from "validator";
import moment from "moment";
import axios from "axios";
import { validate as uuidValidate } from "uuid";

const getUrlVars = (url) => {
  var vars = {};
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default class {
  static isValidEmail = (email) => validator.isEmail(email);

  static getUrlParam = (url, parameter, defaultvalue) => {
    let urlparameter = defaultvalue;
    if (url.indexOf(parameter) > -1) {
      urlparameter = getUrlVars(url)[parameter];
    }
    return urlparameter;
  };

  static getIp = async () => {
    const ipResponse = await axios.get(`https://api.ipify.org/?format=json`);
    const ip = (ipResponse && ipResponse.data && ipResponse.data.ip) || "";
    return ip;
  };

  static formatToCurrency = (amount, currency) => {
    if (!amount) return;
    return (
      currency +
      parseFloat(amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        .replace(".00", "")
    );
  };

  static formatBtcToCurrency = (amount, currency) => {
    if (!amount) return;
    return parseFloat(amount).toFixed(8) + currency;
  };

  static formatToNumber = (amount) => {
    if (!amount) return;
    return parseFloat(amount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
      .replace(".00", "");
  };

  static isValidUuid = (uid) => uuidValidate(uid);

  static replaceAll = (oldString, newString, fullString) =>
    fullString.split(oldString).join(newString);

  static getInvoiceHtml = () => `<!DOCTYPE html>
  <html>
  
  <head>
      <title>Invoice</title>
  </head>
  
  <body style="font-family: Roboto;">
  
      <div style="background-color: black; color: white; padding: 5px 20px">
          <h1>App Reviewers
              <span style="float: right">Invoice</span>
          </h1>
      </div>
  
      <div style="margin: 10px 20px">
          <p>Here is the details and amount of your payments</p>
      </div>
  
      <table style="width:90%; margin: 5% 5%;">
          <tr>
              <th style="text-align: left">Bill to: </th>
              <th style="text-align: right">Invoice #</th>
              <th style="text-align: right">Invoice Date</th>
          </tr>
          <tr>
              <td>{name}</td>
              <td style="text-align: right">{invoiceNumber}</td>
              <td style="text-align: right">{date}</td>
          </tr>
      </table>
  
      <table style="width:90%; border: 1px solid black; border-collapse: collapse;  margin: 12% 5%;">
          <tr style="border: 1px solid black; background-color: #ddd;">
              <th style="border: 1px solid black; padding: 10px;">Description</th>
              <th style="border: 1px solid black;">Amount</th>
          </tr>
          <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 10px;">{description}</td>
              <td style="border: 1px solid black; text-align: right; padding: 10px;">{amount}</td>
          </tr>
          <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 10px;"><b>Total</b></td>
              <td style="border: 1px solid black; background-color: #ddd; text-align: right; padding: 10px;"><b>{amount}</b></td>
          </tr>
      </table>
  
      <div style="margin: 20% 5%;">
          <p>Thank you for doing bussiness with us.</p>
      </div>
  </body>
  
  </html>`;
}
