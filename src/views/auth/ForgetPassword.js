import React, { useState } from "react";
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
import { LockOpenOutlined } from "@mui/icons-material";
import { Container } from "@mui/material";

function ForgetPassword() {
	const { setIsLoading } = useStore(state => state);
	const [email, setEmail] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleSubmit = e => {
		e.preventDefault();
		if (!email || email.length === 0) {
			setErrorMessage(`Email is required.`);
			return;
		} else {
			if (!utils.isValidEmail(email)) {
				setErrorMessage(`Please provide a valid email address.`);
				return;
			}
		}

		setIsLoading(true);
		userService.forgotPassword(email).then(result => {
			if (result.error) {
				setErrorMessage(result.error);
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
			setErrorMessage("");
			setSuccessMessage(
				`Email sent containing password reset information.`
			);
		});
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 10 }}>
			<Heading text="Forgot Password?" sx={{ mt: 10, mb: 3 }} />
			<Text label="Email address" value={email} onChange={setEmail} />
			<Button
				text="Send Email"
				onClick={handleSubmit}
				sx={{ mt: 2, mb: 2 }}
				icon={<LockOpenOutlined />}
			/>
			<Error text={errorMessage} />
			<Success text={successMessage} />
			<LinkButton label="Want to try login?" text="Sign In" to="/login" />
		</Container>
	);
}

export default ForgetPassword;
