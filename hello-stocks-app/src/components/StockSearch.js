import React, {useState, useEffect,  useContext} from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  LineSeries,
  Title,
  Legend,
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker } from '@devexpress/dx-react-chart';
import { withStyles } from '@material-ui/core/styles';
import { Animation } from '@devexpress/dx-react-chart';
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



const StockSearch = ( ) => {

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

  useEffect(() => {
    if (allNewsStories) {
      setCurrentNewsSlice(allNewsStories.slice(0, 10));
    }
  }, [allNewsStories])

  // const [currentDate, setCurrentDate] = useState(new Date());
  // const [currentEpoch, setCurrentEpoch] = useState(Math.round(currentDate.getTime() / 1000));
  // const [yearAgoEpoch, setYearAgoEpoch] = useState(Math.round(currentDate.setFullYear(currentDate.getFullYear() - 1)));
  // const [sliderVal, setSliderVal] = useState([yearAgoEpoch, currentEpoch]);

  const [monthsAxis, setMonthsAxis] = useState([]);

  useEffect(() => {
    console.log(stockIndexes);

    if (chartData) {
      // console.log(chartData);
      // console.log(chartData.slice(...stockIndexes));
      // setCurrentChartData(chartData.slice(...stockIndexes));

      // console.log(chartData[stockIndexes[0]].newsDates);
      // console.log(chartData[stockIndexes[1]].newsDates);

      axios.get(`https://api.polygon.io/v2/reference/news?limit=10&order=descending&sort=published_utc&ticker=${currentTicker}&published_utc.lte=${chartData[stockIndexes[1]].newsDates}&published_utc.gt=${chartData[stockIndexes[0]].newsDates}&apiKey=vHjNP5FWBDFMkOyTytTHerS_1MYNXG5z`)
        .then(res => {setNewsStories(res.data.results); console.log(res.data.results)});

        axios.get(`https://finnhub.io/api/v1/company-news?symbol=${currentTicker}&from=${chartData[stockIndexes[0]].newsDates}&to=${chartData[stockIndexes[1]].newsDates}&token=c2mjfh2ad3idu4ai7v4g`)
        .then(res => {
          console.log(res.data);
          setAllNewsStories(res.data);
          setTotalNewsPages((res.data.length % 10 > 0) ? Math.floor((res.data.length / 10) + 1) : res.data.length / 10);      
        });

      const tempMonths = [];
      const hashMap = {};

      currentChartData.map(data => {
        if (!hashMap[data.monthYear]) {
          hashMap[data.monthYear] = 1;
        }
      })

      for (const key of Object.keys(hashMap)) {
        tempMonths.push(key);
      }

      setMonthsAxis(tempMonths);
      console.log(tempMonths);
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

      

      axios.get(`https://api.polygon.io/v1/meta/symbols/${currentTicker}/company?&apiKey=vHjNP5FWBDFMkOyTytTHerS_1MYNXG5z`)
        .then(res => {
          setCurrentTickerDetails(res.data);
          console.log(res.data);
        })

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
        tempChartData.push({ month: moment(data.t).format('MMMM Do YYYY'), price: data.c, monthYear: moment(data.t).format('MMMM YYYY'), newsDates: moment(data.t).format('YYYY-MM-DD') })
      })

      console.log(tempChartData);
      setChartData(tempChartData);
      setCurrentChartData(tempChartData); 
      setStockIndexes([0, tempChartData.length - 1]);
    }
  }, [stockData])

  const handleChange = (event) => {
    setSearch(event.target.value);
    setNewsStories(null);
    setCurrentTicker(null);
    setTickers([]);
    setAllNewsStories(null);
    setCurrentNewsSlice(null);
    setChartData(null);
    setCurrentChartData(chartData);
  }

  const selectTicker = (event, value) => {
    if (value?.ticker) {
      setCurrentTicker(value.ticker);
      console.log(value.ticker);
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

  // useEffect(() => {
  //   setInterval(() => {

  //     const temp = cycleTickers;
  //     temp.push(temp.shift());
  
  //     setCycleTickers(temp);
  //     setCurrentCycle(cycleTickers[0]);
  //     console.log(currentCycle);
  //   }, 3000);
  // }, []);  

  


  return (
    <div>
      <div className="nav-bar-container">
        <div className="hello-stocks-logo-flex">
          <div className="hello-leaf-flex">
            <h2 className="hello-stocks-style">HelloStocks</h2>
            <img src={greentea} alt="Tea Leaf"/>
          </div>
          <h3 className="stock-research-style">Stock Research Made Simple</h3>
        </div>
        <div className="nav-items-flex">
          <h2 className="nav-item-style">About Us</h2>
          <h2 className="nav-item-style">Contact</h2>
          <h2 className="nav-item-style disclaimer-padding">Disclaimer</h2>
        </div>
      </div>


      <div className="search-bar-container">
        <h1 className="search-tsla-style">Ex: Search ‘{currentCycle}’...</h1>
        <Autocomplete
          id="combo-box-demo"
          options={tickers}
          getOptionLabel={(option) => option.ticker}
          onInputChange={handleChange}
          onChange={selectTicker}
          fullWidth={true}
          noOptionsText={(!search.length) ? 'Please Enter A Symbol' : 'Hmm 🤔 Looks like you’ve entered an invalid symbol or we haven’t added that symbol yet. Please try a new search 🙏'}
          // style={{ height: 75 }}
          renderInput={(params) => <TextField {...params} label="Search Symbol" variant="outlined" />}
        />
      </div>



      {/* {(currentTickerDetails) ? 
        <div>
          <div className="stock-info-main-flex">
            <div className="stock-name-logo-flex">
              <h1 className="company-name-style">{currentTickerDetails.symbol} ({currentTickerDetails.name})</h1>
              <h1>{currentTickerDetails.symbol} - ({currentTickerDetails.name})</h1>
              <img className="stock-logo-style" src={currentTickerDetails.logo} alt={currentTickerDetails.name + ' Logo'} />
            </div>
            <div className="prices-flex">

            </div>
          </div>
          
        </div>
      : null} */}


    
   

    {(currentChartData && currentTickerDetails && priceQuote && basicFinancials) ?
        <div className="align-ticker-details">
          <div className="basic-financials-price-flex">
            <div className="stock-info-main-flex">
              <div className="stock-name-logo-flex">
                <h1 className="company-name-style">{currentTickerDetails.symbol} ({currentTickerDetails.name})</h1>
                <img className="stock-logo-style" src={currentTickerDetails.logo} alt={currentTickerDetails.name + ' Logo'} />
              </div>
              <div className="prices-flex">
                <h2 className="open-close-price">O: {priceQuote.o}</h2>
                <h2 className="open-close-price">C: {priceQuote.c}</h2>
              </div>
            </div>  
            <div className="high-low-52-week-flex">
              <div className="high-low-flex">
                <h3>High: {priceQuote.h}</h3>
                <h3>Low: {priceQuote.l}</h3>
              </div>
              <div className="fiftytwo-week-flex">
                <h3>52 Week High: {basicFinancials.metric["52WeekHigh"]}</h3>
                <h3>52 Week Low: {basicFinancials.metric["52WeekLow"]}</h3>
              </div>
            </div>
          </div>
          <div className="chart-company-info-flex">
          <Paper className="chart-paper">

            <div className="timeframe-buttons-flex">
              <h3 className={(timeFrameButton === '1D') ? 'active-timeframe-button' : 'timeframe-button-style'} onClick={() => activeTimeframeButton('1D')}>1D</h3>
              <h3 className={(timeFrameButton === '5D') ? 'active-timeframe-button' : 'timeframe-button-style'} onClick={() => activeTimeframeButton('5D')}>5D</h3>
              <h3 className={(timeFrameButton === '1M') ? 'active-timeframe-button' : 'timeframe-button-style'} onClick={() => activeTimeframeButton('1M')}>1M</h3>
              <h3 className={(timeFrameButton === '3M') ? 'active-timeframe-button' : 'timeframe-button-style'} onClick={() => activeTimeframeButton('3M')}>3M</h3>
              <h3 className={(timeFrameButton === '1Y') ? 'active-timeframe-button' : 'timeframe-button-style'} onClick={() => activeTimeframeButton('1Y')}>1Y</h3>
              <h3 className={(timeFrameButton === '2Y') ? 'active-timeframe-button' : 'timeframe-button-style'} onClick={() => activeTimeframeButton('2Y')}>2Y</h3>
            </div>

            <Chart
              data={currentChartData}
            >
              <ArgumentAxis 
                tickFormat={format}
                // showLabels={false}
                // showTicks={false}
                labelComponent={ArgumentLabel}
              />
              <ValueAxis
                max={50}
                labelComponent={ValueLabel}
              />
              
              <LineSeries
                  name={currentTicker}
                  valueField="price"
                  argumentField="month"
                />

              
              <EventTracker
                  onPointerMove={(TargetData) => {

                    if (TargetData.targets.length) {
                      // console.log(currentChartData[TargetData.targets[0].point]);
                      setCurrentChartPoint(currentChartData[TargetData.targets[0].point])
                    }
                  }}
              />


              <Tooltip 
                contentComponent={() => <h5>{currentChartPoint.month} {currentChartPoint.price}</h5>}
              />
              {/* <Legend position="bottom" rootComponent={Root} itemComponent={Item} labelComponent={Label} /> */}
              <Title
                // text={`${currentTicker} Price History`}
                textComponent={TitleText}
              />
              {/* <Animation /> */}
            </Chart>

            <div className="slider-lines-container">
              <div className="lines-flex">
                {chartData.map((line, idx) => {
                  return <div key={idx} className={(stockIndexes[0] === idx || stockIndexes[1] === idx) ? 'tallLineStyle' : 'noLineStyle'}></div>
                })}
              </div>

              <SliderComponent
                setStockIndexes={setStockIndexes}
                chartData={chartData}
                sliderLength={currentChartData.length - 1}
              />
            </div>

            
          </Paper>
          <div className="company-profile-container">
            <h2>Company Profile</h2>
            <h3>{currentTickerDetails.description}</h3>
          </div>
        </div>
      </div>
    : null}




    {(!currentChartData) ? 
      <div>
        {(searchImage) ? 
          <img className="main-image-style" src={mainImage3} />
        :
          <img src={ponderGirl} alt="Pondering Girl" className="ponder-girl-style"/>
        }
      </div>
    : null}





    {(currentNewsSlice) ? 
      <div className="stories-align-flex">
        <div className="all-stories-container">

          <h1 className="news-date-range-style">{chartData[stockIndexes[0]].newsDates} - {chartData[stockIndexes[1]].newsDates}</h1>

          {currentNewsSlice.map(story => {
            return <a href={story.url}>
                      <div className="story-container">
                        <h2>{story.headline}</h2>
                        <h3>{story.source}</h3>
                        <p>{story.summary}</p>
                      </div>
                    </a>
          })}
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
    </div>
  )
}

export default StockSearch;