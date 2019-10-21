import React, { Component } from 'react';
import moment from 'moment';
import {
  Table,
  Segment,
  Button,
  Container,
  Step,
  Grid,
  Icon,
} from 'semantic-ui-react';
import ReactToPrint from 'react-to-print';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import portfolioService from '../../../services/portfolioService';
import history from '../../../helpers/history';
import Navbar from '../../navbar/Navbar';

/**
 * Handles tax report from portfolio
 */
class Report extends Component {
  /**
   * constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      toDate: '',
      fromDate: '',
    };
  }

  /**
   * Handles the formatting of a date change for report for final date
   */
  handleToDateChange = (event, { value }) => {
    if (!value) {
      this.setState({ toDate: '' });
      return;
    }
    const dateObj = moment(value, 'DD/MM/YYYY hh/mm').toDate();
    this.setState({
      toDate: dateObj.toLocaleString(),
    });
  };

  /**
   * Handles the formatting of a date change for report for start date
   */
  handleFromDateChange = (event, { value }) => {
    if (!value) {
      this.setState({ fromDate: '' });
      return;
    }
    const dateObj = moment(value, 'DD/MM/YYYY hh/mm').toDate();
    this.setState({
      fromDate: dateObj.toLocaleString(),
    });
  };


  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const { toDate, fromDate } = this.state;
    const { transactions, headers } = this.props;
    if (transactions.length === 0) {
      return '';
    }
    return (
      <Segment className="animated fadeIn faster">
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column>
              <h4>From</h4>
              <DateTimeInput
                name="All time"
                clearable
                clearIcon={<Icon name="remove" color="red" />}
                placeholder="From"
                animation="false"
                maxDate={new Date()}
                value={fromDate}
                iconPosition="left"
                onChange={this.handleFromDateChange}
              />
            </Grid.Column>
            <Grid.Column>
              <h4>To</h4>
              <DateTimeInput
                name="toDate"
                clearable
                clearIcon={<Icon name="remove" color="red" />}

                placeholder="Now"
                animation="false"
                maxDate={new Date()}
                value={toDate}
                iconPosition="left"
                onChange={this.handleToDateChange}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table>
          <Table.Header>
            <Table.Row>
              {headers.map(x => (
                <Table.HeaderCell key={x}>{x}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {transactions
              .filter(
                x => (!fromDate || moment(x.transaction_date) > moment(fromDate, 'DD/MM/YYYY hh/mm'))
                  && (!toDate || moment(x.transaction_date) < moment(toDate, 'DD/MM/YYYY hh/mm')),
              )
              .map(x => (
                <Table.Row key={x.id}>
                  <Table.Cell>{x.symbol}</Table.Cell>
                  <Table.Cell>
                    {moment(x.transaction_date).format('DD-MM-YYYY')}
                  </Table.Cell>
                  <Table.Cell>
                    {x.transaction_type_id === 1 ? 'Buy' : 'Sell '}
                  </Table.Cell>
                  <Table.Cell>
$
                    {parseFloat(x.price).toFixed(2)}
                  </Table.Cell>
                  <Table.Cell>{parseFloat(x.units).toFixed(2)}</Table.Cell>
                  <Table.Cell>
                    $
                    {parseFloat(x.units * x.price).toFixed(2)}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </Segment>
    );
  }
}

/**
 * Component for the actual report page itself
 */
class ReportPage extends Component {
  /**
   * constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    const headers = [
      'Symbol',
      'Date',
      'time',
      'Transaction Type',
      'price',
      'units',
      'total',
    ];
    this.state = { headers, transactions: [] };
  }

  /**
   * sorts transactions within a portfolio
   * @param {Array} transactions - list of transactions to sort
   */
  sortTransactions = (transactions) => {
    const sortedTransactions = transactions.sort((tx1, tx2) => {
      if (moment(tx1.transaction_date) < moment(tx2.transaction_date)) {
        return 1;
      }
      if (moment(tx1.transaction_date) > moment(tx2.transaction_date)) {
        return -1;
      }
      return 0;
    });
    return sortedTransactions;
  };

  /**
   * Lifecycle function which runs upon the loading completion of a component
   */
  componentDidMount = () => {
    this.getTransactions();
  };

  /**
   * get all transactions of a portfolio and sort
   */
  getTransactions = () => {
    portfolioService.getAllTransactions(
      transactions => this.setState({
        transactions: this.sortTransactions(transactions),
      }),
    );
  };

  /**
   * Retrieve on row of transactions
   * @param {Object} transaction - The transaction to convert to a row.
   * @returns {Array} transactionRow - An array of values for a given csv row.
   */
  getRow = transaction => [
    transaction.symbol,
    moment(transaction.transaction_date).format('DD-MM-YYYY, HH:mm '),
    transaction.transaction_type_id === 1 ? 'Buy' : 'Sell',
    transaction.price,
    transaction.units,
    transaction.price * transaction.units,
  ];

  /**
   * Retrieve relevant csv data to construct data structure of report
   * @param {Array} transactions - list of transactions to map to CSV.
   * @returns {Array<Array>} CSVData - A matrix of values suited for CSV.
   */
  getCSVData = (transactions) => {
    if (transactions.length > 0) {
      const { headers } = this.state;
      const CSVData = [headers];
      const rows = transactions.map(row => this.getRow(row));
      return CSVData.concat(rows);
    }
    return 0;
  };

  /**
   * Download the CSV upon request
   * @param {Array} rows - relevant rows to map and append to pdf according to transactions
   */
  downloadCSV = (rows) => {
    const csvContent = `data:text/csv;charset=utf-8,${rows
      .map(e => e.join(','))
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'transaction_history.csv');
    document.body.appendChild(link); // Required for FF

    link.click();
  };


  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const { transactions, headers } = this.state;
    return (
      <Container>
        <Navbar page="Portfolios" />
        <Step.Group unstackable size="mini">
          <Step as="a" onClick={() => history.push('/portfolios/')}>
            <Icon size="small" name="chart line" />
            <Step.Content>
              <Step.Title>Portfolios</Step.Title>
              <Step.Description>Manage Portfolios</Step.Description>
            </Step.Content>
          </Step>
          <Step active as="a">
            <Icon size="small" name="file alternate outline" />
            <Step.Content>
              <Step.Title>Report</Step.Title>
              <Step.Description>Print report or save as csv</Step.Description>
            </Step.Content>
          </Step>
        </Step.Group>
        <br />
        <ReactToPrint
          trigger={() => <Button alt="print pdf">Print this out!</Button>}
          content={() => this.componentRef}
        />
        <Button
          alt="download csv"
          disable={transactions.length === 0 ? 'true' : 'false'}
          onClick={() => this.downloadCSV(this.getCSVData(transactions))}
        >
          Download CSV
        </Button>
        <Report
          transactions={transactions}
          headers={headers}
          ref={(el) => {
            this.componentRef = el;
          }}
        />
      </Container>
    );
  }
}

export default ReportPage;
