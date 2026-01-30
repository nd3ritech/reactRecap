import RSSParser from "rss-parser";
import express from "express";
import cors from "cors";

const parser = new RSSParser();

const feeds = [
  { name: "CNBC", url: "https://www.cnbc.com/id/100003114/device/rss/rss.html" },
  { name: "Investopedia", url: "https://feeds-api.dotdashmeredith.com/v1/rss/google/f6a0e92b-be8d-4abb-9106-703b04059e19" },
  { name: "Investing.com", url: "https://www.investing.com/rss/news_1.rss" }
];

let articles = [];

function normalizeItem(item, source) {
  return {
    id: `${source}-${item.guid || item.link}`,
    source ,
    title: item.title || "",
    summary: item.contentSnippet || item.content || "",
    link: item.link,
    pubDate: new Date(item.pubDate || item.isoDate).toISOString()
  };
}

//time filtering logic
function getTimeThreshold(timeRange){
  const  now = Date.now(); //Date.now() gives time in milliseconds

  //defining the time ranges that will reflect in the frontend in milliseconds
  const  ranges = {
    "30m" : 30 * 60 * 1000,
    "1h" : 60 * 60 *1000,
    "4h" : 4 * 60 *60 * 1000,
    "12h" : 12 * 60 * 60 * 1000,
    "1D" : 24 * 60 * 60 * 1000,
    "1W" : 7 * 24 * 60 * 60 * 1000
  }

  return ranges[timeRange] ? new Date(now - ranges[timeRange]) : null;
}


async function loadFeeds() {
  const results = await Promise.allSettled(
    feeds.map(async feed => {
      const parsed = await parser.parseURL(feed.url);
      return parsed.items.map(item =>
        normalizeItem(item, feed.name)
      );
    })
  );

  articles = results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value);
}

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json(articles);
});

app.get("/filtered", (req, res) => {
  const {
    timeRange,
    cursor,  //pagination cursor for next page 
    limit = 20  

  } = req.query;   
                         //extracting the timerange from query parameters from what the user wants to filter out
  let filteredArticles = articles;                       // using a copy of articles to filter because we don't want to modify the original articles array

  if (timeRange){                                         //checking if timerange is provided in the query parameters
    const threshold = getTimeThreshold(timeRange);                   //getting the threshold date based on the provided timerange
    if (threshold) {                                     //checking if the threshold is valid
      filteredArticles = articles.filter(article => new Date(article.pubDate) >= threshold) // filtering articles based on the threshold date and only keeping articles greater than threshold datte as thhey are the recent ones
    }
  }

  //pagination logic
  const  pageNum = Number(page);  //converting page and limit to numbers
  const pageSize = Number(limit); 

  const start = (pageNum - 1 ) * pageSize;  //calculating the start and end index for slicing the filtered articles array

  res.json(filteredArticles);        //sending the filtered articles as response
})

app.listen(4000, async () => {
  await loadFeeds();
  console.log("Listening on http://localhost:4000/");
});
