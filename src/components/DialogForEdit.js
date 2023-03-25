import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Text from "../controls/Text";
import userServices from "../services/user";
import useStore from "../store/store";

export default function DialogForEdit({ obj, open, onClose, onSuccess }) {
  let [newName, setNewName] = useState("");
  const { setErrorMessage, token, setIsLoading, setSuccessMessage } = useStore(
    (state) => state
  );

  useEffect(() => {
    setNewName(obj?.name || "");
  }, [obj]);

  const editName = () => {
    if (setNewName === "") {
      setErrorMessage("Please enter user name.");
      return;
    }

    setIsLoading(true);
    userServices
      .updateName(token, { userId: obj?._id, name: newName })
      .then((res) => {
        if (res.error) {
          setErrorMessage(res.error);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        setNewName("");
        setSuccessMessage("User name has been updated.");
        onSuccess();
      })
      .catch((err) => {
        setErrorMessage(err);
      });
  };

  return (
    <div>
      <Dialog open={open} sx={{ width: "100%" }}>
        <DialogTitle>Edit Name</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            Please enter new name for user.
          </DialogContentText>

          <Text
            label="Enter points"
            value={newName}
            onChange={setNewName}
            prefix=""
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setNewName("");
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button onClick={editName}>Edit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
