import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

interface Props {
  radius: number;
  onChangeRadius: (value: number) => void;
}

const marks = [
  {
    value: 1,
    label: "1km",
  },
  {
    value: 2,
    label: "2km",
  },
  {
    value: 3,
    label: "3km",
  },
  {
    value: 4,
    label: "4km",
  },
  {
    value: 5,
    label: "5km",
  },
];

function valuetext(value: number) {
  return `${value}km`;
}

export default function DiscreteSliderMarks({ radius, onChangeRadius }: Props) {
  return (
    <Box sx={{ width: 320 }}>
      <Slider
        aria-label="Custom marks"
        defaultValue={1}
        getAriaValueText={valuetext}
        step={1}
        marks={marks}
        min={1}
        max={5}
        value={radius}
        onChange={(_, value) => onChangeRadius(value as number)}
        sx={{
          color: "#FFBE00",
          height: 6,

          "& .MuiSlider-thumb": {
            width: 15,
            height: 15,
            backgroundColor: "#FFBE00",
            boxShadow: "none",

            "& .MuiSlider-track": {
              border: "none",
            },

            "&:hover": {
              boxShadow: "none",
            },

            "&.Mui-focusVisible": {
              boxShadow: "none",
            },

            "&.Mui-active": {
              boxShadow: "none",
            },
          },
          "& .MuiSlider-mark": {
            display: "none",
          },
          "& .MuiSlider-track": {
            border: "none",
          },

          "& .MuiSlider-rail": {
            background: "#F5F5F5",
          },

          "& .MuiSlider-markLabel": {
            fontSize: "12px",
            color: "#A1A1A1",
          },
        }}
      />
    </Box>
  );
}
