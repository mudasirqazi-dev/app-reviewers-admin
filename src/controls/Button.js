import { Button as MdButton } from "@mui/material";

function Button({
  text,
  variant,
  onClick,
  color,
  width,
  height,
  size,
  icon,
  ...rest
}) {
  return (
    <MdButton
      variant={variant || "contained"}
      onClick={onClick}
      color={color || "primary"}
      size={size || "large"}
      fullWidth
      startIcon={icon ? icon : null}
      style={{ minHeight: height || 50, width: width, marginLeft: 2 }}
      {...rest}
    >
      {text}
    </MdButton>
  );
}

export default Button;
