import validator from "validator";
import moment from "moment";
import axios from "axios";
import { validate as uuidValidate } from "uuid";

const getUrlVars = url => {
	var vars = {};
	url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		vars[key] = value;
	});
	return vars;
};

export default class {
	static isValidEmail = email => validator.isEmail(email);

	static getUrlParam = (url, parameter, defaultvalue) => {
		let urlparameter = defaultvalue;
		if (url.indexOf(parameter) > -1) {
			urlparameter = getUrlVars(url)[parameter];
		}
		return urlparameter;
	};

	static getIp = async () => {
		const ipResponse = await axios.get(
			`https://api.ipify.org/?format=json`
		);
		const ip = (ipResponse && ipResponse.data && ipResponse.data.ip) || "";
		return ip;
	};

	static formatToCurrency = (amount, currency) => {
		return (
			currency +
			amount
				.toFixed(2)
				.replace(/\d(?=(\d{3})+\.)/g, "$&,")
				.replace(".00", "")
		);
	};

	static formatToNumber = amount => {
		return parseFloat(amount)
			.toFixed(2)
			.replace(/\d(?=(\d{3})+\.)/g, "$&,")
			.replace(".00", "");
	};

	static isValidUuid = uid => uuidValidate(uid);

	static replaceAll = (oldString, newString, fullString) =>
		fullString.split(oldString).join(newString);
}
