import axios from "axios";

const { AlphaVantageApiKey } = process.env;

exports.handler = async (event, context) => {
  try {
    const { data } = await axios.get(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=HKD&apikey=${AlphaVantageApiKey}`
    );
    return {
      statusCode: 200,
      body: data
    };
  } catch (err) {
    const { message } = err;
    return {
      statusCode: 500,
      body: message
    };
  }
};
