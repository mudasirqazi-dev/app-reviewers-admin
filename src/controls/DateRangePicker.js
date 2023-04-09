import React, { useState } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect } from "react";
import moment from "moment";

function DateRangePicker({ arr, setArr }) {
	const [from, setFrom] = useState(moment(arr[0]));
	const [to, setTo] = useState(moment(arr[1]));

	useEffect(() => {
		setArr([from, to]);
	}, [from, to]);

	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<DemoContainer
				components={["DatePicker", "DatePicker"]}
				sx={{ mt: "2px" }}
			>
				<DatePicker
					label="Start date"
					value={from}
					onChange={setFrom}
				/>
				<DatePicker label="End date" value={to} onChange={setTo} />
			</DemoContainer>
		</LocalizationProvider>
	);
}

export default DateRangePicker;
