import React from "react";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, prefix, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix={prefix}
    />
  );
});

function Number({ label, value, onChange, prefix = "$", ...rest }) {
  return (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      color="primary"
      type="text"
      style={{ marginTop: 10, marginBottom: 10 }}
      InputProps={{
        inputComponent: NumericFormatCustom,
      }}
      {...rest}
    ></TextField>
  );
}

export default Number;
