import React from 'react';
import { Segment } from 'semantic-ui-react';

/**
 * Displays relevant information about a given company, with certain fields prioritised
 * @param {Object} props
 * @return {ReactElement} markup
 */
const InstrumentCompanyInfo = (props) => {
  /**
   * Initial state
   */
  const {
    assetProfile, calendarEvents, summaryDetail, fmt,
  } = props;

  /**
   * renders component
   * @return {ReactElement} markup
   */
  return (
    <Segment>
      {assetProfile && (
      <div>
        <b>Industry:</b>
        {' '}
        {assetProfile.industry}
        <br />
        <b>Sector:</b>
        {' '}
        {assetProfile.sector}
        <br />
        <b>Website:</b>
        {' '}
        <a href={assetProfile.website}>{assetProfile.website}</a>
        <br />
      </div>
      )}
      {calendarEvents && calendarEvents.dividentDate && (
      <p>
        <b>Dividend date:</b>
        {' '}
        {calendarEvents.dividendDate.fmt}
        <br />
      </p>
      )}
      {calendarEvents
      && calendarEvents.earnings
      && calendarEvents.earnings.revenueAverage.fmt && (
        <p>
          <b>Revenue Average:</b>
          {' '}
          {calendarEvents.earnings.revenueAverage.fmt}
          <br />
        </p>
      )}
      {calendarEvents
      && calendarEvents.earnings
      && calendarEvents.earnings.earningsAverage.fmt && (
        <p>
          <b>Earnings Average:</b>
          {' '}
          {calendarEvents.earnings.earningsAverage.fmt}
          <br />
        </p>
      )}
      <b>Market Cap:</b>
      {' '}
      {fmt}
      <br />
      {summaryDetail.beta && (
      <div>
        <b>Beta:</b>
        {' '}
        {summaryDetail.beta.fmt}
        <br />
      </div>
      )}
      {summaryDetail.forwardPE && summaryDetail.forwardPE.fmt && (
      <p>
        <b>PE:</b>
        {' '}
        {summaryDetail.forwardPE.fmt}
        <br />
      </p>
      )}
    </Segment>
  );
};

export default InstrumentCompanyInfo;
