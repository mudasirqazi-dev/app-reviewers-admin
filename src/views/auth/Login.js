import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../services/user";
import utils from "../../utils/utils";
import useStore from "../../store/store";
import {
	Button,
	Text,
	Password,
	Error,
	Success,
	Heading,
	LinkButton
} from "../../controls";
import { Login as LoginIcon } from "@mui/icons-material";
import { Container } from "@mui/material";

function Login() {
	const { setIsLoggedIn, setIsLoading, setUser, setToken } = useStore(
		state => state
	);
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleSubmit = e => {
		e.preventDefault();

		setErrorMessage("");
		setSuccessMessage("");

		if (!email || email.length === 0) {
			setErrorMessage(`Email address is required.`);
			return;
		} else {
			if (!utils.isValidEmail(email)) {
				setErrorMessage(`Please provide a valid email address.`);
				return;
			}
		}
		if (!password || password.length === 0) {
			setErrorMessage(`Password is required.`);
			return;
		}

		setIsLoading(true);
		userService.login({ email, password }).then(result => {
			if (result.error) {
				setErrorMessage(result.error);
				setIsLoading(false);
				return;
			}

			const data = result.data;
			setErrorMessage("");
			setSuccessMessage(`Login successful! Redirecting...`);

			setIsLoading(false);
			setIsLoggedIn(true);
			setToken(data.token);
			setUser(data.user);
			navigate("/");
		});
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 10 }}>
			<Heading text="Sign In" sx={{ mt: 10, mb: 3 }} />
			<Text label="Email address" value={email} onChange={setEmail} />
			<Password
				label="Password"
				value={password}
				onChange={setPassword}
			/>
			<Button
				text="Sign In"
				onClick={handleSubmit}
				sx={{ mt: 2, mb: 2 }}
				icon={<LoginIcon />}
			/>
			<Error text={errorMessage} />
			<Success text={successMessage} />
			<LinkButton label="Forgot your password?" text="Reset" to="/fp" />
		</Container>
	);
}

export default Login;
