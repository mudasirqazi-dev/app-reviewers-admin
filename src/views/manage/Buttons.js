import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { Text, Button } from "../../controls";
import settingService from "../../services/setting";
import { SaveTwoTone } from "@mui/icons-material";

function Buttons() {
  const navigate = useNavigate();
  const {
    token,
    user,
    isLoggedIn,
    setIsLoading,
    setErrorMessage,
    setSuccessMessage,
  } = useStore((state) => state);
  const [buttons, setButtons] = useState("");

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");

    setIsLoading(true);
    settingService.get(token).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setButtons(result.data.buttons);
    });
  }, []);

  const hanldeSubmit = (e) => {
    setIsLoading(true);
    settingService.updateButtons(token, { buttons }).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setSuccessMessage("Data updated successfully!");
    });
  };

  return (
    <Grid container spacing={2} sx={{ p: 2, pt: 2 }}>
      <Grid item xs={12} md={12}>
        <Typography component="p" variant="h5">
          Purchase Buttons
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <Text
          value={buttons}
          onChange={setButtons}
          label="Purchase Buttons"
          multiline
          minRows={3}
          helperText="Semicolon ( ; ) separated list of buttons prices"
        />
        <Button
          text="Save Changes"
          icon={<SaveTwoTone />}
          sx={{ mt: 2 }}
          onClick={hanldeSubmit}
        />
      </Grid>
    </Grid>
  );
}

export default Buttons;
