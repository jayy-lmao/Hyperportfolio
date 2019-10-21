import React, { Suspense, lazy } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import history from '../helpers/history';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginModal = lazy(() => import('./pages/users/LoginModal'));
const RegisterModal = lazy(() => import('./pages/users/RegisterModal'));
const WatchlistListPage = lazy(() => import('./pages/watchlists/WatchlistListPage'));
const WatchlistPage = lazy(() => import('./pages/watchlists/WatchlistPage'));
const InstrumentSearchPage = lazy(() => import('./pages/instruments/InstrumentSearchPage'));
const PortfolioListPage = lazy(() => import('./pages/portfolios/PortfolioListPage'));
const PortfolioPage = lazy(() => import('./pages/portfolios/PortfolioPage'));
const TransactionPage = lazy(() => import('./pages/transactions/TransactionPage'));
const InstrumentPage = lazy(() => import('./pages/instruments/InstrumentPage'));
const PortfolioReportPage = lazy(() => import('./pages/portfolios/PortfolioReportPage'));

const App = () => (
  <div className="app-display">
    <Router history={history}>
      <Suspense fallback={<div className="lazy-loading"><Loader /></div>}>
        <Switch>
          <Route exact path="/home" component={HomePage} />
          <Route path="/login" component={LoginModal} />
          <Route path="/register" component={RegisterModal} />
          <Route exact path="/watchlists" component={WatchlistListPage} />
          <Route path="/watchlists/:id" component={WatchlistPage} />
          <Route path="/search" component={InstrumentSearchPage} />
          <Route exact path="/portfolios" component={PortfolioListPage} />
          <Route exact path="/portfolios/:id" component={PortfolioPage} />
          <Route path="/portfolios/:id/transactions/:symbol" component={TransactionPage} />
          <Route path="/instruments/:symbol" component={InstrumentPage} />
          <Route path="/Report" component={PortfolioReportPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </Suspense>
    </Router>
  </div>
);

export default App;
