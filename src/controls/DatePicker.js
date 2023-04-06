import React, { useState } from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { useEffect } from "react";
import moment from "moment";

export default function DateRangePickerValue({ arr, setArr }) {
  const [value, setValue] = useState([dayjs(arr[0]), dayjs(arr[1])]);

  useEffect(() => {
    if (value[1]) {
      setArr([
        moment(value[0]["$d"]).format("YYYY-MM-DD"),
        moment(value[1]["$d"]).format("YYYY-MM-DD"),
      ]);
    }
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        sx={{ mt: "2px", ml: 2 }}
        components={["DateRangePicker", "DateRangePicker"]}
      >
        <DemoItem component="DateRangePicker">
          <DateRangePicker
            value={value}
            onChange={(e) => {
              setValue(e);
            }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
