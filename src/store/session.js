import Keys from "./keys";

class Session {
	static set = (key, value) => localStorage.setItem(key, value);
	static setStringified = (key, value) =>
		localStorage.setItem(key, JSON.stringify(value));
	static get = key => localStorage.getItem(key);
	static getParsed = key =>
		localStorage.getItem(key)
			? JSON.parse(localStorage.getItem(key) || "")
			: false;
	static remove = key => localStorage.removeItem(key);
	static logout = () => {
		for (const [key, value] of Object.entries(Keys)) {
			localStorage.removeItem(value);
		}
	};
}

export default Session;
