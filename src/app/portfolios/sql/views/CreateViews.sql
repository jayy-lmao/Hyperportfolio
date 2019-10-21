-- Drops the view vw_portfolios_summary if it already exists.
-- Then it creates the view to total the portfolios by portfolio_id
-- and symbols summing if it's a buy or otherwise subtracting (as a 
-- sell transaction).
DROP VIEW IF EXISTS vw_portfolios_summary;
CREATE VIEW vw_portfolios_summary AS
  SELECT
    id,
    portfolio_id_id,
    symbol,
    units,
    value,
    CASE
      WHEN units = 0.0
      THEN 0.0
    ELSE (value * 1.0)/units END AS average_price
  FROM
    (SELECT
      ROW_NUMBER() OVER() AS id,
      detail.portfolio_id_id,
      detail.symbol,
      SUM(CASE
            WHEN trans_type.code = 'BUY'
            THEN 1 
          ELSE -1 END * units) AS units,
      SUM(CASE
            WHEN trans_type.code = 'BUY'
            THEN 1
          ELSE -1 END * price * units) AS value
    FROM
      portfolios_portfoliodetail detail
      INNER JOIN portfolios_transactiontype trans_type
        ON detail.transaction_type_id_id = trans_type.id 
    GROUP BY
      detail.portfolio_id_id,
      detail.symbol) base;
  
  
-- Drops the view vw_owner_portfolios_summary if it already exists.
-- Then it creates the view to total the portfolios by portfolio_id
-- including the header information such as name, description, by
-- summing if it's a buy or otherwise subtracting (as a sell 
-- transaction).
DROP VIEW IF EXISTS vw_owner_portfolios_summary;
CREATE VIEW vw_owner_portfolios_summary AS
  SELECT
    id,
    name,
    description,
    owner_id,
    units,
    value,
    CASE
      WHEN units = 0.0
      THEN 0.0
    ELSE (value * 1.0)/units END AS average_price,
    latest_transaction_date,
    date_created,
    date_modified
  FROM
    (SELECT
      portfolio.id,
      portfolio.name,
      portfolio.description,
      portfolio.owner_id,
      SUM(CASE
            WHEN trans_type.code = 'BUY'
            THEN 1 
          ELSE -1 END * units) AS units,
      SUM(CASE
            WHEN trans_type.code = 'BUY'
            THEN 1
          ELSE -1 END * price * units) AS value,
      MAX(portfolio.date_created) AS date_created,
      MAX(portfolio.date_modified) AS date_modified,
      MAX(detail.transaction_date) AS latest_transaction_date
    FROM
      portfolios_portfolio portfolio
      LEFT OUTER JOIN portfolios_portfoliodetail detail
        ON portfolio.id = detail.portfolio_id_id
      LEFT OUTER JOIN portfolios_transactiontype trans_type
        ON detail.transaction_type_id_id = trans_type.id 
    GROUP BY
      portfolio.id,
      portfolio.name,
      portfolio.description,
      portfolio.owner_id) base;

-- Drops the view vw_owner_portfolios_summary if it already exists.
-- Then it creates the view to total the portfolios by portfolio_id
-- and symbol, including the header information such as name, description,
-- by summing if it's a buy or otherwise subtracting (as a sell 
-- transaction).
DROP VIEW IF EXISTS vw_owner_portfolios_summary_symbols;
CREATE VIEW vw_owner_portfolios_summary_symbols AS
  SELECT
    ROW_NUMBER() OVER() AS id,
    portfolio_id_id,
    owner_id,
    units,
    value,
    symbol,
    CASE
      WHEN units = 0.0
      THEN 0.0
    ELSE (value * 1.0)/units END AS average_price,
    latest_transaction_date
  FROM
    (SELECT
      portfolio.id AS portfolio_id_id,
      portfolio.owner_id,
      detail.symbol,
      SUM(CASE
            WHEN trans_type.code = 'BUY'
            THEN 1 
          ELSE -1 END * units) AS units,
      SUM(CASE
            WHEN trans_type.code = 'BUY'
            THEN 1
          ELSE -1 END * price * units) AS value,
      MAX(detail.transaction_date) AS latest_transaction_date
    FROM
      portfolios_portfolio portfolio
      LEFT OUTER JOIN portfolios_portfoliodetail detail
        ON portfolio.id = detail.portfolio_id_id
      LEFT OUTER JOIN portfolios_transactiontype trans_type
        ON detail.transaction_type_id_id = trans_type.id 
    GROUP BY
      portfolio.id,
      portfolio.owner_id,
      detail.symbol) base;
