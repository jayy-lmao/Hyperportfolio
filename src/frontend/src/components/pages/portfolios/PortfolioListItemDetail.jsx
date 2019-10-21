import React from 'react';
import { Grid, Item } from 'semantic-ui-react';
import { sum } from 'd3';
import history from '../../../helpers/history';

/**
 * Details within a portfolio item
 */
class PortfolioItemDetail extends React.Component {
  /**
   * constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      title: props.title,
      data: props.data ? props.data : [],
      symbols: props.symbols,
      totalUnits: 0,
      totalValue: 0,
      totalMarketValue: 0,
    };
  }

  /**
   * Lifecycle function that runs after a component has loaded
   */
  componentDidMount() {
    const { data } = this.state;
    this.setState({
      totalUnits: sum(data, d => d.value.totalUnits),
      totalValue: sum(data, d => d.value.totalValue),
      totalMarketValue: sum(data, d => d.value.marketValue),
    });
  }

  /**
   * Format a number to include commas
   * @param {string} x - an unstructured float
   * @returns {string} y - a float separated by commas at thousands.
   */
  numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');


  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    let topPerformerOrdinal;
    let topPerformerDaily;
    let worstPerformerOrdinal;
    let worstPerformerDaily;

    const {
      data, symbols, id, title, totalMarketValue, totalUnits, totalValue,
    } = this.state;

    /**
     * Set class (apply red/green colour) depending on whether number for
     * field is describes is negative for positive
     */
    if (data.length > 0 && data[0].key !== 'null') {
      const bestSymbol = data[0].key;
      const bestOrdinalChangeValue = data[0].value.marketValueChange;
      const bestOrdinalChangeRate = data[0].value.totalValue !== 0
        ? (data[0].value.marketValueChange / data[0].value.totalValue)
            * 100
        : 0;

      const bestOrdinalDailyChangeValue = data[0].value.totalUnits
        * (symbols[data[0].key][0]
          - symbols[data[0].key][1]);
      const bestOrdinalDailyChangeRate = symbols[data[0].key][1] !== 0
        ? ((symbols[data[0].key][0]
              - symbols[data[0].key][1])
              / symbols[data[0].key][1])
            * 100
        : 0;
      const ordinalBestPlusMinus = bestOrdinalChangeValue > 0 ? '+' : '';
      const dailyBestPlusMinus = bestOrdinalDailyChangeValue > 0 ? '+' : '';

      const worstSymbol = data[data.length - 1].key;
      const worstOrdinalChangeValue = data[data.length - 1].value
        .marketValueChange;
      const worstOrdinalChangeRate = data[data.length - 1].value.totalValue !== 0
        ? (data[data.length - 1].value.marketValueChange
              / data[data.length - 1].value.totalValue)
            * 100
        : 0;

      const worstOrdinalDailyChangeValue = data[data.length - 1].value.totalUnits
        * (symbols[data[data.length - 1].key][0]
          - symbols[data[data.length - 1].key][1]);
      const worstOrdinalDailyChangeRate = symbols[data[data.length - 1].key][1] !== 0
        ? ((symbols[data[data.length - 1].key][0]
              - symbols[data[data.length - 1].key][1])
              / symbols[data[data.length - 1].key][1])
            * 100
        : 0;
      const ordinalWorstPlusMinus = worstOrdinalChangeValue > 0 ? '+' : '';
      const dailyWorstPlusMinus = worstOrdinalDailyChangeValue > 0 ? '+' : '';

      topPerformerOrdinal = (
        <Item.Description>
          <p className={bestOrdinalChangeValue > 0 ? 'dailyGain' : 'dailyLoss'}>
            {`${bestSymbol} ${ordinalBestPlusMinus}${this.numberWithCommas(parseFloat(bestOrdinalChangeValue).toFixed(
              2,
            ))} (${ordinalBestPlusMinus}${this.numberWithCommas(parseFloat(bestOrdinalChangeRate).toFixed(2))}%)`}
          </p>
        </Item.Description>
      );
      topPerformerDaily = (
        <Item.Description>
          <p className={bestOrdinalDailyChangeValue > 0 ? 'dailyGain' : 'dailyLoss'}>
            {`- Daily: ${dailyBestPlusMinus}${this.numberWithCommas(parseFloat(bestOrdinalDailyChangeValue).toFixed(
              2,
            ))} (${dailyBestPlusMinus}${this.numberWithCommas(parseFloat(bestOrdinalDailyChangeRate).toFixed(2))}%)`}
          </p>
        </Item.Description>
      );

      worstPerformerOrdinal = (
        <Item.Description>
          <p className={worstOrdinalChangeValue > 0 ? 'dailyGain' : 'dailyLoss'}>
            {`${worstSymbol} ${ordinalWorstPlusMinus}${this.numberWithCommas(parseFloat(worstOrdinalChangeValue).toFixed(
              2,
            ))} (${ordinalWorstPlusMinus}${this.numberWithCommas(parseFloat(worstOrdinalChangeRate).toFixed(2))}%)`}
          </p>
        </Item.Description>
      );
      worstPerformerDaily = (
        <Item.Description>
          <p className={worstOrdinalDailyChangeValue > 0 ? 'dailyGain' : 'dailyLoss'}>
            {`- Daily: ${dailyWorstPlusMinus}${this.numberWithCommas(parseFloat(worstOrdinalDailyChangeValue).toFixed(
              2,
            ))} (${dailyWorstPlusMinus}${parseFloat(worstOrdinalDailyChangeRate).toFixed(2)}%)`}
          </p>
        </Item.Description>
      );
    }

    /**
     * render
     * @return {ReactElement} markup
     */
    return (
      <Item
        className="portfolio-item"
        as="a"
        onClick={() => history.push(`/portfolios/${id}`)}
      >
        {/* Set content for individual portfolio list items with formats above and relevant retrieved info */}
        <Item.Content>
          <Item.Header>{title}</Item.Header>
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column>
                <Item.Meta>
                  <span className="dateCreated">Details:</span>
                </Item.Meta>
                <Item.Description>
                  Total Units:
                  {' '}
                  {this.numberWithCommas(parseFloat(totalUnits).toFixed(2))}
                </Item.Description>
                <Item.Description>
                  Total Value:
                  {' '}
                  {this.numberWithCommas(parseFloat(totalMarketValue).toFixed(2))}
                </Item.Description>
                <Item.Description>
                  Total Gain/Loss:
                  {' '}
                  {`${(totalMarketValue > totalValue ? '+' : '')
                    + this.numberWithCommas(parseFloat(totalMarketValue - totalValue).toFixed(2))} (${
                    totalMarketValue > totalValue ? '+' : ''
                  }${this.numberWithCommas(parseFloat(
                    totalValue !== 0
                      ? ((totalMarketValue - totalValue)
                          / totalValue)
                          * 100
                      : 0,
                  ).toFixed(2))}%)`}
                </Item.Description>
              </Grid.Column>
              <Grid.Column>
                <Item.Meta>
                  <span className="dateCreated">Top Performer:</span>
                </Item.Meta>
                {topPerformerOrdinal}
                {topPerformerDaily}
              </Grid.Column>
              <Grid.Column>
                <Item.Meta>
                  <span className="dateCreated">Worst Performer:</span>
                </Item.Meta>
                {worstPerformerOrdinal}
                {worstPerformerDaily}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Item.Content>
      </Item>
    );
  }
}

export default PortfolioItemDetail;
