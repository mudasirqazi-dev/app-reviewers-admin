import React, { useEffect, useState } from "react";
import useStore from "../../../store/store";
import moment from "moment";
import {
	Grid,
	Typography,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Paper
} from "@mui/material";
import { Chart } from "chart.js";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Button } from "../../../controls";
import statsService from "../../../services/stats";
import useScreenSize, { BreakPoint } from "../../../hooks/useScreenSize";

Chart.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	BarElement
);

const options = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false
		}
	}
};

function Searches() {
	const size = useScreenSize();
	const [interval, setInterval] = useState("daily");
	const [month, setMonth] = useState(dayjs());
	const [year, setYear] = useState(dayjs());
	const [selectedMonth, setSelectedMonth] = useState(dayjs().get("month"));
	const [selectedYear, setSelectedYear] = useState(dayjs().get("year"));
	const [data, setData] = useState({
		labels: [],
		datasets: [
			{
				maxBarThickness: 40,
				data: [],
				borderColor: "rgb(54, 162, 235)",
				backgroundColor: "rgba(54, 162, 235, 0.5)"
			}
		]
	});

	useEffect(() => setSelectedYear(dayjs(year).get("year")), [year]);
	useEffect(() => {
		setSelectedMonth(dayjs(month).get("month"));
		setSelectedYear(dayjs(month).get("year"));
	}, [month]);

	const { token, setIsLoading, setErrorMessage } = useStore(state => state);

	useEffect(() => {
		getSearches();
	}, []);

	const getSearches = () => {
		statsService
			.getSearches(token, {
				interval: interval,
				month: selectedMonth,
				year: selectedYear
			})
			.then(result => {
				if (result.error) {
					setErrorMessage(result.error);
					setIsLoading(false);
					return;
				}

				let _data = [];
				if (interval === "daily") {
					let _l = result.data.map(k =>
						parseInt(moment(k._id).format("D"))
					);
					for (
						let i = 1;
						i <=
						moment()
							.month(selectedMonth)
							.year(selectedYear)
							.daysInMonth();
						i++
					) {
						if (_l.indexOf(i) === -1) {
							_data.push({ _id: i, total: 0 });
						} else {
							let _t = result.data.find(
								k => parseInt(moment(k._id).format("D")) === i
							);
							_data.push({ _id: i, total: _t.total });
						}
					}
				}

				if (interval === "monthly") {
					let _l = result.data.map(k =>
						parseInt(moment(k._id).format("M"))
					);
					for (let i = 1; i <= 12; i++) {
						if (_l.indexOf(i) === -1) {
							_data.push({ _id: i, total: 0 });
						} else {
							let _t = result.data.find(
								k => parseInt(moment(k._id).format("M")) === i
							);
							_data.push({ _id: i, total: _t.total });
						}
					}
				}

				if (interval === "yearly") {
					result.data
						.sort((a, b) => a._id - b._id)
						.map(f => _data.push(f));
				}

				setData({
					labels:
						interval === "monthly"
							? _data.map(k =>
									moment()
										.month(k._id - 1)
										.format("MMM")
							  )
							: _data.map(k => k._id),
					datasets: [
						{
							maxBarThickness: 40,
							data: _data.map(k => k.total),
							borderColor: "rgb(54, 162, 235)",
							backgroundColor: "rgba(54, 162, 235, 0.5)"
						}
					]
				});
				setIsLoading(false);
			});
	};

	const handleApplyFilter = e => {
		e.preventDefault();
		getSearches();
	};

	let height =
		size.screen === BreakPoint.xs || size.screen === BreakPoint.s
			? 300
			: 500;
	let padding =
		size.screen === BreakPoint.xs || size.screen === BreakPoint.s ? 0 : 1;

	return (
		<>
			<Grid item xs={12} md={12} sx={{ mt: 3 }}>
				<Typography component="p" variant="h5">
					Searches chart
				</Typography>
			</Grid>
			<Grid item xs={12} md={12}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={12} md={8}>
						<FormControl fullWidth>
							<InputLabel>Choose filter type</InputLabel>
							<Select
								variant="outlined"
								value={interval}
								label="Choose filter type"
								onChange={e => setInterval(e.target.value)}
							>
								<MenuItem value="daily">
									Daily &nbsp;
									<small>
										(day-wise sum of the searches of a
										selected month)
									</small>
								</MenuItem>
								<MenuItem value="monthly">
									Monthly &nbsp;
									<small>
										(month-wise sum of the searches of a
										selected year)
									</small>
								</MenuItem>
								<MenuItem value="yearly">
									Yearly &nbsp;
									<small>
										(year-wise sum of all of the searches)
									</small>
								</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					{(interval === "monthly" || interval === "daily") && (
						<Grid item xs={12} sm={6} md={2}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DemoContainer
									components={["DatePicker", "DatePicker"]}
									sx={{ pt: 0 }}
								>
									{interval === "monthly" && (
										<DatePicker
											value={year}
											onChange={setYear}
											views={["year"]}
											openTo="year"
											slotProps={{
												textField: {
													helperText: "Choose a year"
												}
											}}
										/>
									)}
									{interval === "daily" && (
										<DatePicker
											value={month}
											onChange={setMonth}
											views={["month", "year"]}
											openTo="month"
											slotProps={{
												textField: {
													helperText: "Choose a month"
												}
											}}
										/>
									)}
								</DemoContainer>
							</LocalizationProvider>
						</Grid>
					)}
					<Grid item xs={12} sm={6} md={2}>
						<Button
							text="Apply"
							onClick={handleApplyFilter}
							height={55}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} md={12}>
				<Box sx={{ pl: padding, pr: padding, height: height }}>
					<Bar options={options} data={data} />
				</Box>
			</Grid>
		</>
	);
}

export default Searches;
