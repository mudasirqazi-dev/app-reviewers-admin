import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Text from "../controls/Text";
import useStore from "../store/store";
import userServices from "../services/user";
import moment from "moment";
import Password from "../controls/Password";
import Utils from "../utils/utils";

export default function FormDialog({ open, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token, setErrorMessage, setIsLoading, setSuccessMessage } = useStore(
    (state) => state
  );

  const clear = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const createUser = () => {
    if (name === "" || email === "" || password === "") {
      setErrorMessage("All fields are required. Please fill the data.");
      return;
    }

    if (!Utils.isValidEmail(email)) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    const obj = {
      name,
      email,
      password,
      joined: moment().format(),
      type: "user",
    };
    setIsLoading(true);
    userServices
      .signup(token, obj)
      .then((res) => {
        if (res.error) {
          setErrorMessage(res.error);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        setSuccessMessage("User has been created successfully.");
        onSuccess();
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  return (
    <div>
      <Dialog open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <DialogTitle>Create user</DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the users data to create a new user. All fields are required.
          </DialogContentText>

          <Text label="Full name" value={name} onChange={setName} />
          <Text label="Email address" value={email} onChange={setEmail} />
          <Password
            label="Initial password"
            value={password}
            onChange={setPassword}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              clear();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button onClick={createUser}>Create User</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
