import "./assets/css/style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/home/Home";
import Users from "./views/usersList/UsersList";
import useStore from "./store/store";
import Loading from "./components/Loading";
import Login from "./views/auth/Login";
import ForgetPassword from "./views/auth/ForgetPassword";
import ResetPassword from "./views/auth/ResetPassword";
import Profile from "./views/user/Profile";
import ChangePassword from "./views/user/ChangePassword";
import Header from "./components/Header";
import Manage from "./views/manage/Manage";
import ToastError from "./components/ToastError";
import ToastSuccess from "./components/ToastSuccess";
import ToastInfo from "./components/ToastInfo";

function App() {
	const {
		isLoading,
		isLoggedIn,
		user,
		errorMessage,
		setErrorMessage,
		successMessage,
		setSuccessMessage,
		infoMessage,
		setInfoMessage
	} = useStore(state => state);

	return (
		<Router>
			{isLoading === true && <Loading />}
			<ToastError
				open={errorMessage?.length > 0}
				onClose={() => setErrorMessage("")}
				body={errorMessage}
			/>
			<ToastSuccess
				open={successMessage?.length > 0}
				onClose={() => setSuccessMessage("")}
				body={successMessage}
			/>
			<ToastInfo
				open={infoMessage?.length > 0}
				onClose={() => setInfoMessage("")}
				body={infoMessage}
			/>
			{isLoggedIn && user && <Header />}
			<Routes>
				<Route exact path="/login" element={<Login />} />
				<Route exact path="/fp" element={<ForgetPassword />} />
				<Route exact path="/rp" element={<ResetPassword />} />
				<Route exact path="/" element={<Home />} />
				<Route exact path="/users" element={<Users />} />
				<Route exact path="/profile" element={<Profile />} />
				<Route exact path="/settings" element={<ChangePassword />} />
				<Route exact path="/manage" element={<Manage />} />
			</Routes>
		</Router>
	);
}

export default App;
