import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { Button, Number } from "../../controls";
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
  const [button, setButton] = useState("");

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
      setButton(result.data.subscription);
    });
  }, []);

  const hanldeSubmit = (e) => {
    setIsLoading(true);
    settingService
      .updateSubscription(token, { subscription: button })
      .then((result) => {
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
          Subscription Amount
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <Number
          value={button}
          onChange={setButton}
          label="Subscription Amount"
          multiline
          minRows={3}
          helperText="Add monthly subscription price"
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
