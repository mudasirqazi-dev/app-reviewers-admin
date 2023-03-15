import React, { useState } from "react";
import userService from "../../services/user";
import useStore from "../../store/store";
import { Button, Password, Error, Success, Heading } from "../../controls";
import { Key } from "@mui/icons-material";
import { Container } from "@mui/material";

function ChangePassword() {
	const { token, setIsLoading } = useStore(state => state);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleSubmit = e => {
		e.preventDefault();

		setErrorMessage("");
		setSuccessMessage("");

		if (!newPassword || !repeatPassword || !currentPassword) {
			setErrorMessage(`Please provide all fields.`);
			return;
		}

		if (newPassword !== repeatPassword) {
			setErrorMessage(`New password did not match.`);
			return;
		}

		setIsLoading(true);
		userService
			.updatePassword(token, { currentPassword, newPassword })
			.then(result => {
				if (result.error) {
					setErrorMessage(result.error);
					setIsLoading(false);
					return;
				}

				setIsLoading(false);
				setErrorMessage("");
				setSuccessMessage(
					`Password updated successfully! Use new password to login next time.`
				);
			});
	};

	return (
		<Container maxWidth="sm">
			<Heading text="Update your password" sx={{ mt: 2, mb: 3 }} />
			<Password
				label="Current Password"
				value={currentPassword}
				onChange={setCurrentPassword}
			/>
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
				text="Update Password"
				onClick={handleSubmit}
				sx={{ mt: 2, mb: 2 }}
				icon={<Key />}
			/>
			<Error text={errorMessage} />
			<Success text={successMessage} />
		</Container>
	);
}

export default ChangePassword;
