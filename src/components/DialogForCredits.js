import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import userServices from "../services/user";
import useStore from "../store/store";
import Number from "../controls/Number";

export default function DialogForCredits({ obj, open, onClose, onSuccess }) {
  let [newCredits, setNewCredits] = useState("");
  const { setErrorMessage, token, setIsLoading, setSuccessMessage } = useStore(
    (state) => state
  );

  const addCredits = () => {
    if (newCredits === 0) {
      setErrorMessage("Points must be non-zero.");
      return;
    }

    setIsLoading(true);
    userServices
      .addPoints(token, { userId: obj?._id, points: newCredits })
      .then((res) => {
        if (res.error) {
          setErrorMessage(res.error);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        setNewCredits("");
        setSuccessMessage("User balance has been updated.");
        onSuccess();
      })
      .catch((err) => {
        setErrorMessage(err);
      });
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Add Credits</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            Enter the credits you want to add. These will be added to the users
            current balance.
          </DialogContentText>

          <Number
            label="Enter credits"
            value={newCredits}
            onChange={setNewCredits}
            prefix=""
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setNewCredits("");
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button onClick={addCredits}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
