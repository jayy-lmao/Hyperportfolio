```sh
.
├── app
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── entrypoint-dev.sh
│   ├── entrypoint.sh
│   ├── instruments
│   │   ├── admin.py
│   │   ├── api
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   ├── apps.py
│   │   ├── data
│   │   │   └── instruments.json
│   │   ├── models.py
│   │   ├── __pycache__
│   │   ├── tests.py
│   │   └── views.py
│   ├── manage.py
│   ├── old_db.sqlite3
│   ├── Pipfile
│   ├── Pipfile.lock
│   ├── portfolios
│   │   ├── admin.py
│   │   ├── api
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   ├── apps.py
│   │   ├── data
│   │   │   └── transactiontype.json
│   │   ├── migrations
│   │   ├── models.py
│   │   ├── sql
│   │   │   └── views
│   │   │       └── CreateViews.sql
│   │   ├── tests.py
│   │   └── views.py
│   ├── schema.yml
│   ├── stocks_django
│   │   ├── api.py
│   │   ├── __pycache__
│   │   ├── settings.py
│   │   ├── swagger_schema.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── testpoint
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── __pycache__
│   │   ├── tests.py
│   │   └── views.py
│   ├── users
│   │   ├── apps.py
│   │   ├── authentication.py
│   │   ├── data
│   │   │   └── auth.json
│   │   ├── migrations
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   └── views.py
│   └── watchlists
│       ├── admin.py
│       ├── api
│       │   ├── serializers.py
│       │   ├── urls.py
│       │   └── views.py
│       ├── apps.py
│       ├── migrations
│       ├── models.py
│       ├── schema.yml
│       ├── tests.py
│       └── views.py
├── code_structure.md
├── cypress
│   ├── integration
│   │   ├── authentication_test.js
│   │   ├── navigation_test.js
│   │   ├── portfolio_test.js
│   │   └── watchlist_tests.js
│   ├── plugins
│   │   └── index.js
│   └── support
│       ├── commands.js
│       └── index.js
├── cypress.json
├── docker-compose.yml
├── Dockerrun.aws.json
├── frontend
│   ├── config-override.js
│   ├── default.conf
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── esdoc.json
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── App.css
│   │   ├── app_source.css
│   │   ├── favicon.ico
│   │   ├── hyper_logo.svg
│   │   ├── hyperportfolio.svg
│   │   ├── imgs
│   │   │   ├── background_final.JPEG
│   │   │   └── background_final.webp
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── robots.txt
│   │   └── semantic.min.css
│   ├── README.md
│   ├── src
│   │   ├── apis
│   │   │   └── stocksDjango.js
│   │   ├── assets
│   │   │   └── images
│   │   │       └── hyperportfolio.svg
│   │   ├── components
│   │   │   ├── App.jsx
│   │   │   ├── charts
│   │   │   │   ├── ChartList.jsx
│   │   │   │   ├── MiniBarChart.jsx
│   │   │   │   ├── MultiChartSearchBar.jsx
│   │   │   │   ├── MultiStockChart.jsx
│   │   │   │   ├── Sparkline.jsx
│   │   │   │   ├── StockChart.css
│   │   │   │   ├── StockChartWithGui.jsx
│   │   │   │   └── StockList.jsx
│   │   │   ├── navbar
│   │   │   │   ├── NavbarDesktopMenu.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── NavbarMobileMenu.jsx
│   │   │   ├── news
│   │   │   │   ├── NewsFeedItem.jsx
│   │   │   │   └── NewsFeed.jsx
│   │   │   ├── pages
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── instruments
│   │   │   │   │   ├── AddToWatchlistMenu.jsx
│   │   │   │   │   ├── InstrumentCompanyInfo.jsx
│   │   │   │   │   ├── InstrumentPageChart.jsx
│   │   │   │   │   ├── InstrumentPageDirectors.jsx
│   │   │   │   │   ├── InstrumentPage.jsx
│   │   │   │   │   ├── InstrumentPageTracking.jsx
│   │   │   │   │   └── InstrumentSearchPage.jsx
│   │   │   │   ├── OptionsModal.jsx
│   │   │   │   ├── portfolios
│   │   │   │   │   ├── CreatePortfolioModal.jsx
│   │   │   │   │   ├── EditPortfolioModal.jsx
│   │   │   │   │   ├── PortfolioListItemDetail.jsx
│   │   │   │   │   ├── PortfolioListItem.jsx
│   │   │   │   │   ├── PortfolioListItemSummary.jsx
│   │   │   │   │   ├── PortfolioListPage.jsx
│   │   │   │   │   ├── PortfolioPage.jsx
│   │   │   │   │   ├── PortfolioReportPage.jsx
│   │   │   │   │   └── PortfolioTable.jsx
│   │   │   │   ├── transactions
│   │   │   │   │   ├── CreateTransactionModal.jsx
│   │   │   │   │   ├── TransactionPage.jsx
│   │   │   │   │   └── TransactionTable.jsx
│   │   │   │   ├── users
│   │   │   │   │   ├── LoginModal.jsx
│   │   │   │   │   └── RegisterModal.jsx
│   │   │   │   └── watchlists
│   │   │   │       ├── CreateWatchlistModal.jsx
│   │   │   │       ├── EditWatchlistModal.jsx
│   │   │   │       ├── WatchlistInstrumentSearch.jsx
│   │   │   │       ├── WatchlistItem.jsx
│   │   │   │       ├── WatchlistListPage.jsx
│   │   │   │       ├── WatchlistPage.jsx
│   │   │   │       └── WatchlistTable.jsx
│   │   │   └── searchbars
│   │   │       ├── HomeSearchBar.jsx
│   │   │       └── SearchBar.jsx
│   │   ├── helpers
│   │   │   ├── authHeader.js
│   │   │   ├── handleResponse.js
│   │   │   └── history.js
│   │   ├── index.jsx
│   │   └── services
│   │       ├── authenticationService.js
│   │       ├── instrumentService.js
│   │       ├── portfolioService.js
│   │       ├── transactionService.js
│   │       └── watchlistService.js
│   └── webpack.config.js
├── frontend_structure.md
└── nginx
    ├── default.conf
    ├── Dockerfile
    └── Dockerfile.dev

49 directories, 148 files
```
