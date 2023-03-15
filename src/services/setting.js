import axios from "axios";
import constants from "../utils/constants";

export default class {
	static get = async token => {
		let result = { data: null, error: null };
		const headers = {};
		headers[constants.TOKEN_NAME] = token;

		await axios
			.get(`${process.env.REACT_APP_API_URL}/settings`, {
				headers: headers
			})
			.then(resp => {
				if (resp.status === 200) {
					result.data = resp.data;
				}
			})
			.catch(err => {
				result.error = err.response.data;
			});

		return result;
	};

	static update = async (token, data) => {
		let result = { data: null, error: null };
		const headers = {};
		headers[constants.TOKEN_NAME] = token;

		await axios
			.post(`${process.env.REACT_APP_API_URL}/settings`, data, {
				headers: headers
			})
			.then(resp => {
				if (resp.status === 200) {
					result.data = resp.data;
				}
			})
			.catch(err => {
				result.error = err.response.data;
			});

		return result;
	};
}
