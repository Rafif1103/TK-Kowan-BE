const express = require('express')
const app = express()
const port = 80;
const cors = require('cors')
const pool = require("./db");

// Base currency and API configurations
const BASE_URL = "https://v6.exchangerate-api.com/v6/d728832c1528091949e3a1c3/latest/IDR";

// middleware
app.use(cors());

app.use(express.json());

app.post('/convert', async (req, res) => {
  try {
        // Fetch the conversion rate from the API
        let response = await fetch(BASE_URL, {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                },
        })
        if (!response.ok) {
                throw new Error(`failed to fetch data`);
        }
        const parsedRes = await response.json();
        console.log(parsedRes);
        const rates = parsedRes.conversion_rates;

        // Set the rate conversion
        const idrToEur = rates.EUR;
        const idrToUsd = rates.USD;

        // Perform Conversion
        let { amount } = req.body
        const eurAmount = parseFloat((amount * idrToEur).toFixed(5));
        const usdAmount = parseFloat((amount * idrToUsd).toFixed(5));

        // Insert the data into the database
        const query = `
            INSERT INTO currency_conversions (idr_value, usd_value, eur_value)
            VALUES ($1, $2, $3)
            RETURNING id, conversion_date;
        `;
        const values = [amount, usdAmount, eurAmount];
        await pool.query(query, values);

        res.json({status: 200, IDR:amount, USD: usdAmount, EUR:eurAmount})
  } catch (err) {
        console.error(err.message);
        return res.status(500).json({status: 500, message: err.message});
  }
})

app.get('/history', async (req, res) => {
    try {
        const query = `SELECT idr_value, usd_value, eur_value from currency_conversions`
        const data = await pool.query(query)
        const dataRows = data.rows

        return res.status(200).json({
            status: 200,
            message: "Conversion history fetched successfully",
            data: dataRows
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({status: 500, message: err.message});
    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
