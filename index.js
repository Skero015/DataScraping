//imports
const axios = require('axios');
const cheerio = require('cheerio');

//web page to scrape
const url = 'https://www.investing.com/funds/allan-gray-balanced-fund-c-chart';

//get request to get the html data
axios.get(url).then((res) => {

    //variables
    let fundDetailsMap = new Map();
    let fundType = '', fundMarket = '', fundIssuer = '', fundIsin = '', fundClass = ''; //general info
    let morningStarRating = '';

    //loads the html data into a constant
    const $ = cheerio.load(res.data);

    //gets the name of the fund which is in a h1 heading
    const name = $('.instrumentHead').find('h1').text().trim();

    //retrieves the first element in text inside the div, which is the fund's current price
    const price = $("div[class='top bold inlineblock']").children('span').first().text()

    //retrieves the next elements in text inside the div, which is the fund's daily movement in both price value and percent value
    const daily_movement = $("div[class='top bold inlineblock']").children('span').next().text()

    //retrieves the general information of the fund
    //Each child in the div has a child with class 'elp', which represents the value of each information
    $("div[class='right general-info']").each((index, element) => {
        fundType = $(element).children("div:nth-child(1)").children("span[class='elp']").text();
        fundMarket = $(element).children("div:nth-child(2)").children("span[class='elp']").text();
        fundIssuer = $(element).children("div:nth-child(3)").children("span[class='elp']").text();
        fundIsin = $(element).children("div:nth-child(4)").children("span[class='elp']").text();
        fundClass = $(element).children("div:nth-child(5)").children("span[class='elp']").text();
          
    });


    $("span[class='morningStarsWrap']").each((index, element) => {
        //gets the number of children with the .morningStarDark class and stores in a variable
        //the dark star represents the fund's morning star rating
        morningStarRating = $(element).children(".morningStarDark").length;  
    });

    //storing scraped data into map
    fundDetailsMap = {
        name: name,
        type: fundType,
        issuer: fundIssuer,
        isin: fundIsin,
        class: fundClass,
        price: price,
        daily_movement: daily_movement,
        morning_star_rating: morningStarRating,
    }

    //displaying the map data
    console.log(fundDetailsMap);
});