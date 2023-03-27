import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Text from "../controls/Text";
import useStore from "../store/store";
import nameService from "../services/name";

export default function DialogForAppName({ obj, open, onClose, onSuccess }) {
  let [newName, setNewName] = useState("");
  const { token, setIsLoading, setErrorMessage, setSuccessMessage } = useStore(
    (state) => state
  );

  useEffect(() => {
    setNewName(obj?.name);
  }, [obj]);

  const editName = () => {
    if (setNewName === "") {
      setErrorMessage("Please enter user name.");
      return;
    }

    setIsLoading(true);
    nameService
      .update(token, { id: obj?._id, name: newName })
      .then((res) => {
        if (res.error) {
          setErrorMessage(res.error);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        setNewName("");
        setSuccessMessage("App name has been updated.");
        onSuccess();
      })
      .catch((err) => {
        setErrorMessage(err);
      });
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Edit Name</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            Enter new name for app.
          </DialogContentText>

          <Text
            label="Enter name"
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
