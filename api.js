const axios = require('axios').default;
const apiKey = "&apiKey=HK4NQoeRq9x_93F6FNUq6BXvseZpT5w1";
// const schedule = require('node-schedule');

const apiFunctions = {
  
  getTickerInfo: async function getTickerInfo() {
      let nextResponseUrl = "https://api.polygon.io/v3/reference/tickers?active=true&sort=ticker&order=asc&limit=1000" + apiKey;
      let resultsArr = [];
        setInterval(async () => {
          try {
            const response = await axios.get(nextResponseUrl);
            nextResponseUrl = response.data.next_url + apiKey;
            resultsArr = resultsArr.concat(response.data.results);   
            // console.log(resultsArr);
          } catch (error) {
            console.error(error);
          }
          console.log(nextResponseUrl);
          console.log(resultsArr.length);
        }, 5000) 
      }
  
  // getNewsArticles: async function getNews() {
  //   let newsUrl = "https://api.polygon.io/v2/reference/news?limit=10&order=descending&sort=published_utc&ticker=AAPL&published_utc.gte=2021-04-26" + apiKey;
  //   let newsArr = [];
  //   setInterval(async () => {
  //     try {
  //       const response = await axios.get(newsUrl);
  //       newsUrl = response.data.article_url + apiKey;
  //       newsArr = newsArr.concat(response.data.results);
  //       console.log(newsArr);
  //     } catch (error) {
  //         console.error(error);
  //     }
  //     // console.log(newsUrl);
  //     // console.log(newsArr.length);
  //   }, 5000)
  // } 
}


  // const job = schedule.scheduleJob('* 1 * * * *', function() {
  //   console.log(getData());
  // });

  module.exports = apiFunctions;