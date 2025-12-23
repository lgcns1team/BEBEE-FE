import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

interface HoneyRangeProps {
  value: number[];
  onChange: (value: number[]) => void;
}

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 100,
    label: "",
  },
  {
    value: 200,
    label: "",
  },
  {
    value: 300,
    label: "",
  },
  {
    value: 400,
    label: "",
  },
  {
    value: 500,
    label: "500",
  },
  {
    value: 600,
    label: "",
  },
  {
    value: 700,
    label: "",
  },
  {
    value: 800,
    label: "",
  },
  {
    value: 900,
    label: "",
  },
  {
    value: 1000,
    label: "1000+",
  },
];

function valuetext(value: number) {
  return `${value}`;
}

export default function HoneyRange({ value, onChange }: HoneyRangeProps) {
  // const [value, setValue] = React.useState<number[]>([200, 500]);
  const minDistance = 100;

  const handleChange = (_: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) return;

    const [min, max] = newValue;
    if (max - min < minDistance) return;

    onChange(newValue);
  };
  return (
    <Box sx={{ width: 340 }}>
      <Slider
        value={value}
        onChange={handleChange}
        step={100}
        marks={marks}
        min={0}
        max={1000}
        disableSwap
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => (v === 1000 ? "1000+" : v)}
        sx={{
          color: "#FFBE00",
          height: 6,

          "& .MuiSlider-valueLabel": {
            background: "transparent",
            color: "#FFBE00",
            fontWeight: 400,
            fontSize: "12px",
            top: 21,
            transform: "translateY(0)",
          },

          "& .MuiSlider-track": {
            border: "none",
          },

          "& .MuiSlider-rail": {
            background: "#F5F5F5",
          },

          "& .MuiSlider-mark": {
            display: "none",
          },

          "& .MuiSlider-thumb": {
            width: 15,
            height: 15,
            backgroundColor: "#FFBE00",
            boxShadow: "none",
            border: "1px solid #FFFFFF",

            "&.Mui-active": { boxShadow: "none" },
            "&.Mui-focusVisible": { boxShadow: "none" },
          },

          "& .MuiSlider-markLabel": {
            fontSize: "12px",
            color: "#A1A1A1",
          },

          "& .MuiSlider-markLabelActive": {
            color: "#FFBE00",
            fontWeight: 600,
          },
        }}
      />
    </Box>
  );
}
