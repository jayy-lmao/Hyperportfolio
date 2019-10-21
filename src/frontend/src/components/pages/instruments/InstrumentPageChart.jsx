import React from 'react';
import { Grid, Card } from 'semantic-ui-react';
import StockChart from '../../charts/StockChartWithGui';

/**
 * Loads the chart to be displayed on a given instrument page, with its relevant data
 * @param {Object} props
 */
const InstrumentPageChart = (props) => {
  const { symbol } = props;
  return (
    <Grid divided="vertically">
      <Grid.Row columns={1}>
        <Card fluid className="instrument-chart">
          <StockChart symbol={symbol} range="5y" interval="1d" />
        </Card>
      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column></Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default InstrumentPageChart;
