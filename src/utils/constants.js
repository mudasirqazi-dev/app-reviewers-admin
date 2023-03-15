export default class {
	static TOKEN_NAME = `${process.env.REACT_APP_NAME?.replaceAll(
		" ",
		"_"
	).toLowerCase()}_auth`;
}
