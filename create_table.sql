CREATE TABLE currency_conversions (
    id SERIAL PRIMARY KEY,        -- Unique identifier for each record
    idr_value NUMERIC(15, 2),     -- Amount in IDR (up to 15 digits, 2 decimal places)
    usd_value NUMERIC(15, 2),     -- Converted amount in USD
    eur_value NUMERIC(15, 2),     -- Converted amount in EUR
    conversion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Date and time of conversion
);