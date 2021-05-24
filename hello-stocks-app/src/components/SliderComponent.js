import React, {useState, useEffect,  useContext} from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const SliderComponent = (props) => {
  // const useStyles = makeStyles((theme) => ({
  //   root: {
  //     width: 300 + theme.spacing(3) * 2,
  //   },
  //   margin: {
  //     height: theme.spacing(3),
  //   },
  // }));

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentEpoch, setCurrentEpoch] = useState(Math.round(currentDate.getTime() / 1000));
  const [yearAgoEpoch, setYearAgoEpoch] = useState(Math.round(currentDate.setFullYear(currentDate.getFullYear() - 1)));
  const [sliderVal, setSliderVal] = useState([0, 250]);

  useEffect(() => {
    props.setStockIndexes(sliderVal);
  }, [sliderVal])

  const AirbnbSlider = withStyles({
    root: {
      color: '#3a8589',
      height: 3,
      padding: '13px 0',
    },
    thumb: {
      height: 27,
      width: 27,
      backgroundColor: '#fff',
      border: '1px solid currentColor',
      marginTop: -12,
      marginLeft: -13,
      boxShadow: '#ebebeb 0 2px 2px',
      '&:focus, &:hover, &$active': {
        boxShadow: '#ccc 0 2px 3px 1px',
      },
      '& .bar': {
        // display: inline-block !important;
        height: 9,
        width: 1,
        backgroundColor: 'currentColor',
        marginLeft: 1,
        marginRight: 1,
      },
    },
    active: {},
    track: {
      height: 3,
    },
    rail: {
      color: '#d8d8d8',
      opacity: 1,
      height: 3,
    },
  })(Slider);

  function AirbnbThumbComponent(props) {
    return (
      <span {...props}>
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </span>
    );
  }

  // export default function CustomizedSlider() {
  //   const classes = useStyles();

  return (
    <div>
      <AirbnbSlider
        ThumbComponent={AirbnbThumbComponent}
        getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
        onChange={(event, value) => {
          setSliderVal(value);
        }}
        // value={sliderVal}
        value={sliderVal}
        defaultValue={sliderVal}
        max={252}
        min={0}
      />
    </div>
  )
}

export default SliderComponent;