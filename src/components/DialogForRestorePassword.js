import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Password from "../controls/Password";
import userServices from "../services/user";
import useStore from "../store/store";

export default function DialogForRestorePassword({
  obj,
  open,
  onClose,
  onSuccess,
}) {
  let [newPassword, setNewPassword] = useState("");
  let [repeatPassword, setRepeatPassword] = useState("");

  const { setErrorMessage, token, setIsLoading, setSuccessMessage } = useStore(
    (state) => state
  );

  const editPassword = () => {
    if (!newPassword || !repeatPassword) {
      setErrorMessage(`Please provide all fields.`);
      return;
    }
    if (newPassword !== repeatPassword) {
      setErrorMessage("Password and Repeat password does not match.");
      return;
    }

    setIsLoading(true);
    userServices
      .restorePassword(token, { userId: obj?._id, newPassword: newPassword })
      .then((res) => {
        if (res.error) {
          setErrorMessage(res.error);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        setNewPassword("");
        setRepeatPassword("");
        setSuccessMessage("Password has been restored.");
        onSuccess();
      })
      .catch((err) => {
        setErrorMessage(err);
      });
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Restore Password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            Please enter new password for user.
          </DialogContentText>

          <Password
            label="Enter new password"
            value={newPassword}
            onChange={setNewPassword}
          />
          <Password
            label="Repeat password"
            value={repeatPassword}
            onChange={setRepeatPassword}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setNewPassword("");
              setRepeatPassword("");
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button onClick={editPassword}>Restore</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
