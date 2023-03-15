import { create } from "zustand";
import Session from "./session";
import Keys from "./keys";

const useStore = create(set => ({
	isLoggedIn: Session.get(Keys.isLoggedIn) || false,
	setIsLoggedIn: t => {
		Session.set(Keys.isLoggedIn, t);
		set(() => ({ isLoggedIn: t }));
	},
	isLoading: false,
	setIsLoading: t => {
		set(() => ({ isLoading: t }));
	},
	token: Session.get(Keys.token) || false,
	setToken: t => {
		Session.set(Keys.token, t);
		set(() => ({ token: t }));
	},
	user: Session.getParsed(Keys.user) || false,
	setUser: t => {
		Session.setStringified(Keys.user, t);
		set(() => ({ user: t }));
	},
	errorMessage: "",
	setErrorMessage: t => {
		set(() => ({ errorMessage: t }));
	},
	successMessage: "",
	setSuccessMessage: t => {
		set(() => ({ successMessage: t }));
	},
	infoMessage: "",
	setInfoMessage: t => {
		set(() => ({ infoMessage: t }));
	}
}));

export default useStore;
