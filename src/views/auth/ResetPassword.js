import React, { useState } from "react";
import userService from "../../services/user";
import utils from "../../utils/utils";
import useStore from "../../store/store";
import {
	Button,
	Password,
	Error,
	Success,
	Heading,
	LinkButton
} from "../../controls";
import { KeyOff } from "@mui/icons-material";
import { Container } from "@mui/material";

function ResetPassword() {
	const { setIsLoading } = useStore(state => state);
	const [newPassword, setNewPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleSubmit = e => {
		e.preventDefault();

		if (!newPassword || !repeatPassword) {
			setErrorMessage(`Please provide all fields.`);
			return;
		}

		if (newPassword !== repeatPassword) {
			setErrorMessage(`Password and Repeat password does not match.`);
			return;
		}

		const token = utils.getUrlParam(window.location.href, "token", "");
		if (!token || token.length !== 36) {
			setErrorMessage(`Invalid token provided in the URL.`);
			return;
		}

		setIsLoading(true);
		userService.resetPassword(token, newPassword).then(result => {
			if (result.error) {
				setErrorMessage(result.error);
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
			setErrorMessage("");
			setSuccessMessage(
				`Password updated successfully! Use new password to login.`
			);
		});
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 10 }}>
			<Heading text="Reset your Password" sx={{ mt: 10, mb: 3 }} />
			<Password
				label="New Password"
				value={newPassword}
				onChange={setNewPassword}
			/>
			<Password
				label="Repeat Password"
				value={repeatPassword}
				onChange={setRepeatPassword}
			/>
			<Button
				text="Reset Password"
				onClick={handleSubmit}
				sx={{ mt: 2, mb: 2 }}
				icon={<KeyOff />}
			/>
			<Error text={errorMessage} />
			<Success text={successMessage} />
			<LinkButton label="Want to try login?" text="Sign In" to="/login" />
		</Container>
	);
}

export default ResetPassword;
