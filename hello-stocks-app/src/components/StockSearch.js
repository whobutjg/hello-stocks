import React, {useState, useEffect,  useContext} from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper';
// import {
//   Chart,
//   ArgumentAxis,
//   ValueAxis,
//   LineSeries,
//   Title,
//   Legend,
//   Tooltip,
// } from '@devexpress/dx-react-chart-material-ui';
import { EventTracker } from '@devexpress/dx-react-chart';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment';
import SliderComponent from "./SliderComponent";
import '../App.css';
import tealeaf from '../images/tealeaf.svg';
import greentea from '../images/green-tea-1.svg';
import mainimage from '../images/stocks-home-image.svg';
import mainImage2 from '../images/rectangle-1.svg';
import mainImage3 from '../images/rectangle-2.png';
import ponderGirl from '../images/ponder-girl.png';
import Pagination from '@material-ui/lab/Pagination';
import TextLoop from "react-text-loop";

import Chart, {
  ArgumentAxis,
  ValueAxis,
  Series,
  Legend,
  VisualRange,
  Label,
  Tooltip,
  Title, 
  CommonSeriesSettings,
  CommonAnnotationSettings,
  Image,
  Annotation,
  Crosshair,
  Point,
  Font,
  Grid,
} from 'devextreme-react/chart';
import rocket from '../images/rocket.png';
import redRocket from '../images/red-rocket.png';
import computer from '../images/computer.png';
import errorImage from '../images/error-image.png';
import closeButton from '../images/close-button.png';
import { makeStyles } from "@material-ui/core/styles";
import loadingRobot from '../images/error-robot.png';
import tutorial1 from '../images/tutorial-1.png';
import tutorial2 from '../images/tutorial-2.png';
import tutorial3 from '../images/tutorial-3.png';
import tutorial4 from '../images/tutorial-4.png';
import tutorial5 from '../images/tutorial-5.png';
import astroGirl from '../images/astro-girl.png';

const useStyles = makeStyles(theme => ({
  inputRoot: {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#474747"
    }
  }
}));


const StockSearch = ( ) => {

const classes = useStyles();

const format = () => tick => tick;
const legendStyles = () => ({
  root: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
  },
});
const legendLabelStyles = theme => ({
  label: {
    paddingTop: theme.spacing(1),
    whiteSpace: 'nowrap',
  },
});
const legendItemStyles = () => ({
  item: {
    flexDirection: 'column',
  },
});

const legendRootBase = ({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
);
const legendLabelBase = ({ classes, ...restProps }) => (
  <Legend.Label className={classes.label} {...restProps} />
);
const legendItemBase = ({ classes, ...restProps }) => (
  <Legend.Item className={classes.item} {...restProps} />
);
const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);
const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase);
const Item = withStyles(legendItemStyles, { name: 'LegendItem' })(legendItemBase);
const demoStyles = () => ({
  chart: {
    paddingRight: '20px',
  },
  title: {
    whiteSpace: 'pre',
  },
});

const ValueLabel = (props) => {
  const { text } = props;
  return (
    <ValueAxis.Label
      {...props}
      text={`$${text}`}
    />
  );
};

const titleStyles = {
  title: {
    whiteSpace: 'pre',
  },
};
const TitleText = withStyles(titleStyles)(({ classes, ...props }) => (
  <Title.Text {...props} className={classes.title} />
));





  const [stockIndexes, setStockIndexes] = useState(null);
  const [tickers, setTickers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentTicker, setCurrentTicker] = useState(null);
  const [newsStories, setNewsStories] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [currentChartData, setCurrentChartData] = useState(chartData);
  const [currentChartPoint, setCurrentChartPoint] = useState(null);
  const [currentTickerDetails, setCurrentTickerDetails] = useState(null);
  const [currentTickerPrice, setCurrentTickerPrice] = useState(null);
  const [totalNewsPages, setTotalNewsPages] = useState(null);
  const [allNewsStories, setAllNewsStories] = useState(null);
  const [currentNewsSlice, setCurrentNewsSlice] = useState(null);
  const [currentNewsPage, setCurrentNewsPage] = useState([0, 10]);
  const [priceQuote, setPriceQuote] = useState(null);
  const [basicFinancials, setBasicFinancials] = useState(null);

  const [searchImage, setSearchImage] = useState(true);
  const [timeFrameButton, setTimeFrameButton] = useState('1Y');
  const [cycleTickers, setCycleTickers] = useState(['TSLA', 'AAPL', 'NVDA', 'AMZN', 'MSFT']);
  const [currentCycle, setCurrentCycle] = useState(cycleTickers[0]);
  const [fiveSignificantDates, setFiveSignificantDates] = useState([]);
  const [annotationsArray, setAnnotationaArray] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [errorLoadingData, setErrorLoadingData] = useState(false);
  const [resetSliders, setResetSliders] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialArray, setTutorialArray] = useState([
    {
      image: tutorial1, 
      description: 'Hover over annotations to see what happened at major price movements 👀'
    },
    {
      image: tutorial2,
      description: 'Headlines are sorted from newest to oldest date published. '
    },
    {
      image: tutorial3,
      description: 'Move the sliders to view data from specific date ranges. Headlines below will change dynamically based on the date range selected.'
    },
    {
      image: tutorial4,
      description: 'Click the reset button to return to the current day view.'
    },
    {
      image: tutorial5,
      description: 'Start a new search on the top right corner!'
    }
  ]);


// Refactor API calls and useEffects, need to use formatted chart data chartData for this useEffect
  useEffect(() => {
    if (currentTicker) {
    console.log('TEST');

    setApiLoading(true);

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    let yearAgo = (yyyy - 1) + '-' + mm + '-' + dd;

    
    axios.get(`https://api.polygon.io/v1/meta/symbols/${currentTicker}/company?&apiKey=vHjNP5FWBDFMkOyTytTHerS_1MYNXG5z`)
      .then(details => {
        setCurrentTickerDetails(details.data);
      
    

    axios.get(`https://api.polygon.io/v2/aggs/ticker/${currentTicker}/range/1/day/${yearAgo}/${today}?unadjusted=false&sort=asc&limit=550&apiKey=vHjNP5FWBDFMkOyTytTHerS_1MYNXG5z`)
      .then(res => {

        const tempChartData = [];

        res.data.results.map(data => {
          console.log(data);
          tempChartData.push({ month: moment(data.t).format('MMMM Do YYYY'), price: data.c, monthYear: moment(data.t).format('MMMM YYYY'), newsDates: moment(data.t).format('YYYY-MM-DD'), mmddyyy: moment(data.t).format('MM/DD/YYYY'), allInfo: data })
        })

        const fiveSignificantDates = [];

        const mainSegmentsLength = Math.floor(tempChartData.length / 5);

              for (let i = 0; i < 5; i++) {

                const mainSegment = tempChartData.slice(i * mainSegmentsLength, (i * mainSegmentsLength) + mainSegmentsLength);
      
                const currentSegmentLargest = {
                  indexes: [],
                  value: 0,
                  middlePoint: {},
                  date: '',
                  description: 'Test',
                  image: rocket,
                  stories: [],
                  dateRange: []
                };
      
                for (let j = 0; j < mainSegment.length; j++) {
      
                  if (mainSegment[j + 5]) {
                    if (Math.abs(mainSegment[j].price - mainSegment[j + 5].price) > currentSegmentLargest.value) {
                      // currentSegmentLargest.indexes = [j, j + 5];
                      currentSegmentLargest.indexes = [tempChartData.indexOf(mainSegment[j]), tempChartData.indexOf(mainSegment[j + 5])];
                      currentSegmentLargest.value = Math.abs(mainSegment[j].price - mainSegment[j + 5].price);
                      currentSegmentLargest.middlePoint = tempChartData[tempChartData.indexOf(mainSegment[j + 3])];
                      currentSegmentLargest.date = tempChartData[tempChartData.indexOf(mainSegment[j + 3])].newsDates;
                      currentSegmentLargest.dateRange = [tempChartData[tempChartData.indexOf(mainSegment[j])].month, tempChartData[tempChartData.indexOf(mainSegment[j + 5])].month]
                    }
                  } else {
                    if (Math.abs(mainSegment[j] - mainSegment[mainSegment.length - 1]) > currentSegmentLargest.value) {
                      // currentSegmentLargest.indexes = [j, mainSegment.length - 1];
                      currentSegmentLargest.indexes = [tempChartData.indexOf(mainSegment[j]), tempChartData.indexOf(mainSegment[mainSegment.length - 1])];
                      currentSegmentLargest.value = Math.abs(mainSegment[j].price - mainSegment[mainSegment.length - 1].price);
                      currentSegmentLargest.middlePoint = tempChartData[tempChartData.indexOf(mainSegment[j])];
                      currentSegmentLargest.date = tempChartData[tempChartData.indexOf(mainSegment[j])].newsDates;
                      currentSegmentLargest.dateRange = [tempChartData[tempChartData.indexOf(mainSegment[j])].month, tempChartData[tempChartData.indexOf(mainSegment[mainSegment.length - 1])].month]
                    }
                  }
                }
      
                console.log(tempChartData[currentSegmentLargest.indexes[0]].newsDates)   
                console.log(tempChartData[currentSegmentLargest.indexes[1]].newsDates)
                
                axios.get(`https://finnhub.io/api/v1/company-news?symbol=${currentTicker}&from=${tempChartData[currentSegmentLargest.indexes[0]].newsDates}&to=${tempChartData[currentSegmentLargest.indexes[1]].newsDates}&token=c2mjfh2ad3idu4ai7v4g`)
                  .then(news => {
                        const stories = [];
                        let k = 0;
                        while (stories.length < 3) {
                          console.log('Looping');
                          if (news.data[k].headline.includes(details.data.name.split(' ')[0]) || news.data[k].headline.includes(details.data.name.split(' ')[0] + 's') || news.data[k].headline.includes(currentTicker)) {
                            stories.push(news.data[k]);
                          }
                          k++;
                        }
                        currentSegmentLargest.stories = stories;
              
                        fiveSignificantDates.push(currentSegmentLargest);
                  })
      
                
      
              }
            
 
        console.log(fiveSignificantDates);
        setFiveSignificantDates(fiveSignificantDates);
        setApiLoading(false);
      })
      .catch(() => setErrorLoadingData(true))
    })
    .catch(() => setErrorLoadingData(true))
    }
  }, [currentTicker])




  useEffect(() => {
    if (allNewsStories) {
      setCurrentNewsSlice(allNewsStories.slice(0, 10));
    }
  }, [allNewsStories])



  

  useEffect(() => {
    if (chartData) {
        axios.get(`https://finnhub.io/api/v1/company-news?symbol=${currentTicker}&from=${chartData[stockIndexes[0]].newsDates}&to=${chartData[stockIndexes[1]].newsDates}&token=c2mjfh2ad3idu4ai7v4g`)
        .then(res => {
          console.log(res.data);
          setAllNewsStories(res.data);
          setTotalNewsPages((res.data.length % 10 > 0) ? Math.floor((res.data.length / 10) + 1) : res.data.length / 10);      
        });
    }
  }, [stockIndexes])


  const returnTimeFrame = () => {
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();

      today = yyyy + '-' + mm + '-' + dd;
      let yearAgo = (yyyy - 1) + '-' + mm + '-' + dd;
      let twoYearsAgo = (yyyy - 2) + '-' + mm + '-' + dd;

      let d = new Date();
      d.setMonth(d.getMonth() - 3);
      let threeMonthsAgo = d.toLocaleDateString().split('/').reverse();
      [threeMonthsAgo[1], threeMonthsAgo[2]] = [threeMonthsAgo[2], threeMonthsAgo[1]];
      threeMonthsAgo = threeMonthsAgo.join('-');

      let d2 = new Date();
      d2.setMonth(d.getMonth() - 1);
      let oneMonthAgo = d2.toLocaleDateString().split('/').reverse();
      [oneMonthAgo[1], oneMonthAgo[2]] = [oneMonthAgo[2], oneMonthAgo[1]];
      oneMonthAgo = oneMonthAgo.join('-');

      let d3 = new Date();
      let fiveDaysAgo = new Date(d3);
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      fiveDaysAgo = fiveDaysAgo.toLocaleDateString().split('/').reverse();
      [fiveDaysAgo[1], fiveDaysAgo[2]] = [fiveDaysAgo[2], fiveDaysAgo[1]];
      fiveDaysAgo = fiveDaysAgo.join('-');

      let d4 = new Date();
      let oneDayAgo = new Date(d4);
      oneDayAgo.setDate(oneDayAgo.getDate() - 5);
      oneDayAgo = oneDayAgo.toLocaleDateString().split('/').reverse();
      [oneDayAgo[1], oneDayAgo[2]] = [oneDayAgo[2], oneDayAgo[1]];
      oneDayAgo = oneDayAgo.join('-');

      switch(true) {
        case(timeFrameButton === '1D'):
          return [today, oneDayAgo];
          break;
        case(timeFrameButton === '5D'):
          return [today, fiveDaysAgo];
          break;
        case(timeFrameButton === '1M'):
          return [today, oneMonthAgo];
          break;
        case(timeFrameButton === '3M'):
          return [today, threeMonthsAgo];
          break;
        case (timeFrameButton === '1Y'):
          return [today, yearAgo];
          break;
        case (timeFrameButton === '2Y'):
          return [today, twoYearsAgo];
          break;
      }
  }



  useEffect(() => {
    if (currentTicker) {

      if (chartData) {

        axios.get(`https://finnhub.io/api/v1/company-news?symbol=${currentTicker}&from=${chartData[stockIndexes[0]].newsDates}&to=${chartData[stockIndexes[1]].newsDates}&token=c2mjfh2ad3idu4ai7v4g`)
        .then(res => {
          console.log(res.data);
          setAllNewsStories(res.data);
          setTotalNewsPages((res.data.length % 10 > 0) ? Math.floor((res.data.length / 10) + 1) : res.data.length / 10);      
        });
      }

      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();

      today = yyyy + '-' + mm + '-' + dd;
      let yearAgo = (yyyy - 1) + '-' + mm + '-' + dd;

      axios.get(`https://api.polygon.io/v2/aggs/ticker/${currentTicker}/range/1/day/${returnTimeFrame()[1]}/${returnTimeFrame()[0]}?unadjusted=false&sort=asc&limit=550&apiKey=vHjNP5FWBDFMkOyTytTHerS_1MYNXG5z`)
        .then(res => {setStockData(res.data.results); console.log(res.data)});

      

      // axios.get(`https://api.polygon.io/v1/meta/symbols/${currentTicker}/company?&apiKey=vHjNP5FWBDFMkOyTytTHerS_1MYNXG5z`)
      //   .then(res => {
      //     setCurrentTickerDetails(res.data);
      //     console.log(res.data);
      //   })

      axios.get(`https://finnhub.io/api/v1/stock/metric?symbol=${currentTicker}&metric=all&token=c2mjfh2ad3idu4ai7v4g`)
        .then(res => {
          console.log(res.data);
          setBasicFinancials(res.data);
        });

      axios.get(`https://finnhub.io/api/v1/quote?symbol=${currentTicker}&token=c2mjfh2ad3idu4ai7v4g`)
        .then(res => {
          console.log(res.data);
          setPriceQuote(res.data);
        });
    }
    
  }, [currentTicker, timeFrameButton]);

  useEffect(() => {
    if (search === '') {
      return;
    }
    axios.get(`https://api.polygon.io/v3/reference/tickers?market=stocks&search=${search}&active=true&sort=ticker&order=asc&limit=10&apiKey=vHjNP5FWBDFMkOyTytTHerS_1MYNXG5z`)
      .then(res => {
        if (res.data.results) {
          setTickers(res.data.results);
          setSearchImage(true);
        } else {
          setSearchImage(false);
        }
      })
  }, [search])

  useEffect(() => {
    if (stockData) {

      const tempChartData = [];

      stockData.map(data => {
        // console.log(moment(data.t).format('YYYY-MM-DD'));
        tempChartData.push({ month: moment(data.t).format('MMMM Do YYYY'), price: data.c, monthYear: moment(data.t).format('MMMM YYYY'), newsDates: moment(data.t).format('YYYY-MM-DD'), allInfo: data })
      })

      console.log(tempChartData);
      setChartData(tempChartData);
      setCurrentChartData(tempChartData); 
      setStockIndexes([0, tempChartData.length - 1]);


      // Run the stock data algorithm here

      // const fiveSignificantDates = [];

      // const mainSegmentsLength = Math.floor(tempChartData.length / 5);

      // for (let i = 0; i < 5; i++) {

      //   const mainSegment = tempChartData.slice(i * mainSegmentsLength, (i * mainSegmentsLength) + mainSegmentsLength);

      //   const currentSegmentLargest = {
      //     indexes: [],
      //     value: 0,
      //     middlePoint: {},
      //     date: '',
      //     description: 'Test',
      //     image: rocket,
      //     stories: [],
      //   };

      //   for (let j = 0; j < mainSegment.length; j++) {

      //     if (mainSegment[j + 5]) {
      //       if (Math.abs(mainSegment[j].price - mainSegment[j + 5].price) > currentSegmentLargest.value) {
              
      //         // currentSegmentLargest.indexes = [j, j + 5];
      //         currentSegmentLargest.indexes = [tempChartData.indexOf(mainSegment[j]), tempChartData.indexOf(mainSegment[j + 5])];
      //         currentSegmentLargest.value = Math.abs(mainSegment[j].price - mainSegment[j + 5].price);
      //         currentSegmentLargest.middlePoint = tempChartData[tempChartData.indexOf(mainSegment[j + 3])];
      //         currentSegmentLargest.date = tempChartData[tempChartData.indexOf(mainSegment[j + 3])].newsDates;
      //       }
      //     } else {
      //       if (Math.abs(mainSegment[j] - mainSegment[mainSegment.length - 1]) > currentSegmentLargest.value) {
      //         // currentSegmentLargest.indexes = [j, mainSegment.length - 1];
      //         currentSegmentLargest.indexes = [tempChartData.indexOf(mainSegment[j]), tempChartData.indexOf(mainSegment[mainSegment.length - 1])];
      //         currentSegmentLargest.value = Math.abs(mainSegment[j].price - mainSegment[mainSegment.length - 1].price);
      //         currentSegmentLargest.middlePoint = tempChartData[tempChartData.indexOf(mainSegment[j])];
      //         currentSegmentLargest.date = tempChartData[tempChartData.indexOf(mainSegment[j])].newsDates;
      //       }
      //     }
      //   }

      //   if (allNewsStories) {
      //     const stories = [];
      //     let k = 0;
      //     while (stories.length < 3) {
      //       if (allNewsStories[k].headline.includes('Apple') || allNewsStories[k].headline.includes('Apples') || allNewsStories[k].headline.includes('AAPL')) {
      //         stories.push(allNewsStories[k]);
      //       }
      //     }
      //     currentSegmentLargest.stories = stories;
      //   }


      //   fiveSignificantDates.push(currentSegmentLargest);

      // }

      // console.log(fiveSignificantDates);
      // setFiveSignificantDates(fiveSignificantDates);

    }
  }, [stockData])

  const handleChange = (event, value) => {
    // setSearch(event.target.value);
    console.log(event)
    console.log(value)
    setSearch(value)
    setNewsStories(null);
    setCurrentTicker(null);
    setTickers([]);
    setAllNewsStories(null);
    setCurrentNewsSlice(null);
    setChartData(null);
    setCurrentChartData(chartData);
    setBasicFinancials(null);
    setPriceQuote(null);
    setCurrentNewsPage([0, 10]);
    setCurrentTickerDetails(null);
    // setSearchImage(null);

  }

  const selectTicker = (event, value) => {
    if (value?.ticker) {
      setCurrentTicker(value.ticker);
      console.log(value.ticker);
      // setTickers([]);
    }
  }

  const navHandleChange = (event) => {
    setSearch(event.target.value);
  }

  const navSelectTicker = (event, value) => {
    if (value?.ticker) {
      setCurrentTicker(value.ticker);
      console.log(value.ticker);
      // setTickers([]);
    }
  }





  // const labelHalfWidth = 50;
  const labelHalfWidth = 75;
  let lastLabelCoordinate;

  const ArgumentLabel = props => {
    const { x } = props;
    const { text } = props;
    // filter Labels
    if (
      lastLabelCoordinate &&
      lastLabelCoordinate < x &&
      x - lastLabelCoordinate <= labelHalfWidth
    ) {
      return null;
    }
    lastLabelCoordinate = x;
    console.log();
    return <ArgumentAxis.Label 
              {...props} 
              // text={text.split(' ')[0]}
              text={(text.split(' ')[0] === 'January') ? text.split(' ')[0] + ' ' + text.split(' ')[2] : text.split(' ')[0]}
           />;
  };

  const activeTimeframeButton = (time) => {
    setTimeFrameButton(time);
  }

  
  const customizeLabel = (arg) => {
    return {
      visible: true,
      backgroundColor: '#ff7c7c',
      customizeText: function(e) {
        return (
          <svg overflow="visible">
            <image y="0" width="100" height="100" href={rocket}>
            </image>
          </svg>
        );
      }
    }
  }


  const customizeText =(arg) => {
    // return 'Sleiffseff';
    return <img src={rocket} />
  }

  const customizeTooltip = (annotation) => {
    return {
      // html: `<div class='tooltip'>${annotation.description.map(story => {
      //   console.log(story);
      //   return <h5>{story.headline}</h5>
      // })}</div>`,
      html: `<div class='tooltip'>
              <h2 class="tooltip-date-style">${annotation.dateRange[0]} - ${annotation.dateRange[1]}</h2>
              <div class="rocket-headline-flex">
                <div>
                  <img class="tooltip-rocket-style" src="${rocket}" />
                </div>
                <h3 class="tooltip-headline-style">${annotation.description[0].headline}</h3>
              </div>
              <div class="rocket-headline-flex">
                <div>
                  <img class="tooltip-rocket-style" src="${rocket}" />
                </div>
                <h3 class="tooltip-headline-style">${annotation.description[1].headline}</h3>
              </div>
              <div class="rocket-headline-flex">
                <div>
                  <img class="tooltip-rocket-style" src="${rocket}" />
                </div>
                <h3 class="tooltip-headline-style">${annotation.description[2].headline}</h3>
              </div>
            </div>`,
    };
  }

  const returnHome = () => {
    setNewsStories(null);
    setCurrentTicker(null);
    setTickers([]);
    setAllNewsStories(null);
    setCurrentNewsSlice(null);
    setChartData(null);
    setCurrentChartData(chartData);
    setBasicFinancials(null);
    setPriceQuote(null);
    setCurrentNewsPage([0, 10]);
    setCurrentTickerDetails(null);
    setSearch('');
    setSearchImage(true);
    setErrorLoadingData(false);
    setApiLoading(false);
  }


  const customizeLineToolTip = (pointInfo) => {
    console.log(pointInfo);
    return {
      // text: `${pointInfo.point.data.month} - $${pointInfo.point.data.price}`,
      html: `<div class="points-tooltip-style">
              <h2>${pointInfo.point.data.month}</h2>
              <h3>Open: ${pointInfo.point.data.allInfo.o}</h3>
              <h3>Close: ${pointInfo.point.data.allInfo.c}</h3>
              <h3>High: ${pointInfo.point.data.allInfo.h}</h3>
              <h3>Low: ${pointInfo.point.data.allInfo.l}</h3>
              <h3>Volume: ${pointInfo.point.data.allInfo.v}</h3>
            </div>`
    }
  }


  const chartRef = React.createRef();


  const annotationTemplate = (annotation) => {
  console.log(annotation);
  return (
      <svg>
        <image href={rocket} width="60" height="40" />
        <text x="70" y="25" className="state">Test</text>
      </svg>
    )
  }


  return (
    <div className="main-div">
      <div className="nav-bar-container">
        <div onClick={returnHome} className="hello-stocks-logo-flex">
          <div className="hello-leaf-flex">
            <h2 className="hello-stocks-style">HelloStocks</h2>
            <img className="nav-rocket-style" src={redRocket} alt="Tea Leaf"/>
          </div>
          <h3 className="stock-research-style">Stock Research Made Simple</h3>
        </div>
        {(currentTicker) ? 
          <div className="nav-search-container">
            <div className="nav-search-button-flex">
              <div className="nav-search-background">
                <Autocomplete
                  id="combo-box-demo"
                  options={tickers}
                  getOptionLabel={(option) => option.ticker}
                  onInputChange={navHandleChange}
                  onChange={navSelectTicker}
                  fullWidth={true}
                  noOptionsText={(!search.length) ? 'Please Enter A Symbol' : 'Hmm 🤔 Looks like you’ve entered an invalid symbol or we haven’t added that symbol yet. Please try a new search 🙏'}
                  // style={{ height: 75 }}
                  renderInput={(params) => <TextField {...params} label="Search Symbol" variant="outlined" />}
                  classes={classes}
                />
              </div>
              <div>
                <h2 className="search-button-style">Search</h2>
              </div>
            </div>
          </div>
        :
          <div className="nav-items-flex">
            <h2 className="nav-item-style">About Us</h2>
            <h2 className="nav-item-style">Contact</h2>
            <h2 className="nav-item-style disclaimer-padding">Disclaimer</h2>
          </div>
        }
      </div>




      {(tutorialOpen) ? 
        <div className="tutorial-container-style">
          <div className="inner-tutorial-container">
            <div className="close-button-align">
              <img src={closeButton} alt="Close Button" onClick={() => setTutorialOpen(false)}/>
            </div>
            <img className="tutorial-slide-style" src={tutorialArray[0].image} alt="Tutorial Slide"/>
            <div className="description-container">
              <h2 className="tutorial-description-style">{tutorialArray[0].description}</h2>
              <div className="previous-next-flex">
                <div>
                  <h2 className="previous-next-button-style" onClick={() => {
                    let array = [...tutorialArray];

                    if (tutorialArray[0].image === tutorial1) {
                      return;
                    }

                    array.unshift(array.pop());
                    setTutorialArray(array);
                  }}>
                    Previous
                  </h2>
                </div>
                <div>
                  <h2 className="previous-next-button-style" onClick={() => {
                    let array = [...tutorialArray];
                    console.log(array);

                    if (tutorialArray[1].image === tutorial1) {
                      setTutorialOpen(false);
                      array.push(array.shift());
                      setTutorialArray(array);
                      return
                    }
                    
                    array.push(array.shift())
                    console.log(array);
                    setTutorialArray(array);
                  }}>
                    Next
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      : null}


      
      {(!currentTicker) ? 
        <div className="search-bar-container">
          <h1 className="search-tsla-style">Search ‘
            <TextLoop children={cycleTickers} />
          ’...
          </h1>
          <div className="nav-search-button-flex">
            <Autocomplete
              id="combo-box-demo"
              options={tickers}
              getOptionLabel={(option) => option.ticker}
              onInputChange={(e, value) => handleChange(e, value)}
              onChange={selectTicker}
              fullWidth={true}
              noOptionsText={(!search.length) ? 'Please Enter A Symbol' : 'Hmm 🤔 Looks like you’ve entered an invalid symbol or we haven’t added that symbol yet. Please try a new search 🙏'}
              renderInput={(params) => <TextField {...params} label="Search Symbol" variant="outlined" />}
              classes={classes}
            />
            <div>
              <h2 className="search-button-style">Search</h2>
            </div>
          </div>
        </div>
      : null}

    {(currentTickerDetails && priceQuote && basicFinancials && !apiLoading) ? 
      <div className="basic-financials-tutorial-flex">
        <div className="name-financials-flex">
          <div className="stock-name-logo-flex">
            <h1 className="company-name-style">{currentTickerDetails.symbol} ({currentTickerDetails.name})</h1>
            <img className="stock-logo-style" src={currentTickerDetails.logo} alt={currentTickerDetails.name + ' Logo'} />
          </div>
          <div className="financials-flex">
            <div className="open-close-flex">
              <h1 className="open-close-price-style">{priceQuote.o} <span className="usd-style">USD</span></h1>
              <h3 className="open-close-time-style">At Open: 9:30AM EDT</h3>
            </div>
            <div className="open-close-flex">
              <h1 className="open-close-price-style">{priceQuote.c} <span className="usd-style">USD</span></h1>
              <h3 className="open-close-time-style">At Close: 4:00PM EDT</h3>
            </div>
            <div className="percent-difference">
              <h3 className={(priceQuote.o > priceQuote.c) ? "percent-difference-style" : "percent-difference-red"}>{(priceQuote.o > priceQuote.c) ? '-' : '+'}{Math.abs(priceQuote.o - priceQuote.c).toString().slice(0, Math.abs(priceQuote.o - priceQuote.c).toString().indexOf('.') + 3)} ({(priceQuote.o > priceQuote.c) ? '-' : '+'}{(100 * Math.abs( (priceQuote.o - priceQuote.c) / ((priceQuote.o + priceQuote.c) / 2))).toString().slice(0, (100 * Math.abs( (priceQuote.o - priceQuote.c) / ((priceQuote.o + priceQuote.c) / 2))).toString().indexOf('.') + 3)}%)</h3>
            </div>
            <div className="fiftytwo-high-low-flex">
              <h3 className="fiftytwo-high-low-style">52 Week High: {basicFinancials.metric["52WeekHigh"]}</h3>
              <h3 className="fiftytwo-high-low-style">52 Week Low: {basicFinancials.metric["52WeekLow"]}</h3>
            </div>
          </div>
        </div>
        <div>
          <h1 className="tutorial-button" onClick={() => setTutorialOpen(true)}>VIEW TUTORIAL</h1>
        </div>
      </div>
    : null}
    
   

    {(currentChartData && currentTickerDetails && priceQuote && basicFinancials && !apiLoading) ?
        <div className="align-ticker-details">
          
          <div className="chart-company-info-flex">
          <Paper className="chart-paper paper-z-index">


            <div className="timeframe-buttons-flex">
              <h3 className={(timeFrameButton === '1D') ? 'active-timeframe-button' : 'timeframe-button-style'} onClick={() => activeTimeframeButton('1D')}>1D</h3>
              <h3 className={(timeFrameButton === '5D') ? 'active-timeframe-button' : 'timeframe-button-style'} onClick={() => activeTimeframeButton('5D')}>5D</h3>
              <h3 className={(timeFrameButton === '1M') ? 'active-timeframe-button' : 'timeframe-button-style'} onClick={() => activeTimeframeButton('1M')}>1M</h3>
              <h3 className={(timeFrameButton === '3M') ? 'active-timeframe-button' : 'timeframe-button-style'} onClick={() => activeTimeframeButton('3M')}>3M</h3>
              <h3 className={(timeFrameButton === '1Y') ? 'active-timeframe-button' : 'timeframe-button-style'} onClick={() => activeTimeframeButton('1Y')}>1Y</h3>
              <h3 className={(timeFrameButton === '2Y') ? 'active-timeframe-button' : 'timeframe-button-style'} onClick={() => activeTimeframeButton('2Y')}>2Y</h3>
            </div>

            <Chart
              // ref={chartRef}
              dataSource={currentChartData}
              // customizeLabel={customizeLabel}
              onPointHoverChanged={(e) => {
                const point = e.target;
                if (point.isHovered()) {
                    point.showTooltip();
                }
              }}
              // onSeriesHoverChanged={(e) => {
              //   const series = e.target;
              //   console.log('Test');
              //   if (series.isHovered()) {
              //       console.log('Hovering');
              //   }}
              // }
              className="chart-z-index"
            >
              <Tooltip
                customizeTooltip={customizeLineToolTip}
                enabled={true}
                arrowLength={50}
              />
              <CommonSeriesSettings argumentField="date" type="line" hoverMode="onlyPoint">
                <Point hoverMode="onlyPoint" visible={true} />
              </CommonSeriesSettings>
              <Series 
                // name={currentTicker}
                name="stock"
                valueField="price"
                // argumentField="month"
                argumentField="newsDates"
                type="line"
              >
                <Point hoverMode="onlyPoint" visible={true} />
              </Series>
              <ArgumentAxis 
                // tickFormat={format}
                // showTicks={false}
                // labelComponent={ArgumentLabel}
                argumentType="datetime"
                discreteAxisDivisionMode="crossLabels"
                valueMarginsEnabled={false}
              >
                <Grid visible={true} />
              </ArgumentAxis>
              <ValueAxis
                max={50}
                labelComponent={ValueLabel}
              />




              <CommonAnnotationSettings series="stock" type="image" customizeTooltip={customizeTooltip} interactive={true}>
                <Image 
                  width={50.5} 
                  height={105.75}
                />
              </CommonAnnotationSettings>
              {
                (fiveSignificantDates) ?
                (fiveSignificantDates.map((annotation, idx) => {
                  return <Annotation
                              key={idx}
                              argument={annotation.date}
                              type="image"
                              description={annotation.stories}
                              dateRange={annotation.dateRange}
                              color="rgba(255, 255, 255, 0)"
                              border="rgba(255, 255, 255, 0)"
                              width="30"
                              offsetX={0}
                              offsetY={-40}
                              interactive={true}
                          >
                              <Image url={annotation.image}/>
                          </Annotation>
                }))
                :
                null
              }
              

              <Legend visible={false} />

              
            </Chart>



            <div className="slider-lines-container">
              <div className="lines-flex">
                {chartData.map((line, idx) => {
                  return <div key={idx} className={(stockIndexes[0] === idx || stockIndexes[1] === idx) ? ((stockIndexes[0] === 0 && stockIndexes[1] === currentChartData.length - 1) ? 'tallLineInvisible' : 'tallLineStyle') : 'noLineStyle'}></div>
                })}
              </div>
              <SliderComponent
                setStockIndexes={setStockIndexes}
                chartData={chartData}
                sliderLength={currentChartData.length - 1}
                resetSliders={resetSliders}
              />
            </div>
            
          </Paper>




          <div className="company-profile-container">
            <div>
              <h2 className="company-profile-style">Company Profile</h2>
              <h3 className="profile-para-style">{currentTickerDetails.description}</h3>
            </div>
            <div>
              <h2 className="reset-button-style" onClick={() => setResetSliders(!resetSliders)}>Reset</h2>
            </div>
          </div>
        </div>
      </div>
    : null}




    {(!currentChartData) ? 
      <div>
        {(searchImage) ? 
          <img className="main-image-style" src={astroGirl} />
        :
          <img src={errorImage} alt="Unexpected Error!" className="ponder-girl-style"/>
        }
      </div>
    : null}





    {(currentNewsSlice && !apiLoading) ? 
      <div className="stories-align-flex">
        <div className="all-stories-container"> 

          <div className="all-stories-align">
            <div className="news-dates-flex">
              <h2 className="news-header-style">News | Press Releases</h2>
              <h2 className="news-range-style">{chartData[stockIndexes[1]].month} - {chartData[stockIndexes[0]].month}</h2>
            </div>
            {currentNewsSlice.map(story => {
              return <a href={story.url}>
                        <div className="story-container">
                          <h3 className="story-source-style">{story.source} <span className="story-date-padding">{moment.unix(story.datetime).format('MMMM Do YYYY')}</span></h3>
                          <h2 className="story-headline-style">{story.headline}</h2>
                          <p className="story-para-style">{story.summary}</p>
                        </div>
                      </a>
            })}
          </div>

          
          <div className="pagination-container">
            <Pagination 
              count={10} 
              variant="outlined" 
              shape="rounded" 
              hidePrevButton 
              hideNextButton 
              color="primary"
              size="large"
              count={totalNewsPages}
              onChange={(event, page) => {
                let pageIndexes = currentNewsPage;
                pageIndexes[0] = page * 10;
                pageIndexes[1] = pageIndexes[0] + 10
                setCurrentNewsSlice(allNewsStories.slice(...pageIndexes));

              }}
            />
          </div>
        </div>
        <div className="news-empty-space">
        </div>
    </div>
    : null}



     {(apiLoading && !errorLoadingData) ? 
        <div>
          <h1 className="loading-search-header-style">Just a second, we are working on loading your search..</h1>
          <img className="loading-robot-style" src={loadingRobot} alt="Loading Data"/>
        </div>
     : null}

     {(errorLoadingData) ? 
        <div>
          <h1 className="abort-mission-style">Abort Mission!</h1>
          <h1 className="please-try-again-style">Looks like there's an error on our end, please try again!</h1>
          <img className="api-error-image-style" src={errorImage} alt="Error!" />
        </div>
     : null}
    
    </div>
  )
}

export default StockSearch;