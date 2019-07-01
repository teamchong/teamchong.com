import axios from "axios";

const { AlphaVantageApiKey } = process.env;

exports.handler = (event, context, callback) => {
  Promise.all(
    axios
      .get(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=HKD&apikey=${AlphaVantageApiKey}`
      )
      .then(function(response) {
        // handle success
        callback(null, {
          statusCode: 200,
          body: response
        });
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
  );
};
