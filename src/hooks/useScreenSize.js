import { useState, useEffect } from "react";

const BreakPointWidth = {
	xs: 576,
	s: 576,
	m: 768,
	l: 992,
	xl: 1200
};

const BreakPoint = {
	xs: "xs",
	s: "s",
	m: "m",
	l: "l",
	xl: "xl"
};

const getScreen = width => {
	if (width < BreakPointWidth.xs) return BreakPoint.xs;
	else if (width >= BreakPointWidth.xs && width < BreakPointWidth.s)
		return BreakPoint.s;
	else if (width >= BreakPointWidth.s && width < BreakPointWidth.m)
		return BreakPoint.m;
	else if (width >= BreakPointWidth.m && width < BreakPointWidth.l)
		return BreakPoint.l;
	else if (width >= BreakPointWidth.l && width < BreakPointWidth.xl)
		return BreakPoint.xl;
	else if (width >= BreakPointWidth.xl) return BreakPoint.xl;
};

function getWindowDimensions() {
	const { innerWidth: width, innerHeight: height } = window;
	return {
		width,
		height,
		screen: getScreen(width)
	};
}

function useScreenSize() {
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions()
	);

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return windowDimensions;
}

export { BreakPoint, BreakPointWidth, useScreenSize as default };
