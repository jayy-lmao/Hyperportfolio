import handleResponse from '../helpers/handleResponse';
// import history from '../helpers/history';
import authHeader from '../helpers/authHeader';
import stocksDjango from '../apis/stocksDjango';


/*
 * Transaction service is for creating/reading/updating
 * from the hyperportfol.io/api/watclists REST API.
 */
class TransactionService {
  /**
   * Retrieves a form with given transaction data
   * @param {Object} transaction - contains information regarding requested transaction
   * @return {formData} formData of transaction information
   */
  getTransactionFormData = ({
    portfolio,
    code,
    price,
    units,
    transactionDate,
    transactionType,
  }) => {
    const details = new FormData();
    details.set('portfolio', portfolio);
    details.set('code', code);
    details.set('price', price);
    details.set('units', units);
    details.set('transaction_date', transactionDate);
    details.set('transaction_type', transactionType);
    return details;
  };

  /**
   * Retrieves the current header of the request
   */
  getHeader = async () => ({
    headers: {
      ...await authHeader(),
      'content-type': 'multipart/form-data',
    },
  });

  /**
   * Edits a given transaction within a portfolio
   * @param {string} id - id of the transaction being edited
   * @param {Object} transaction - relevant transaction information
   */
  editTransaction = async (id, transaction) => {
    await stocksDjango.put(
      `/transactions/${id}/`,
      this.getTransactionFormData(transaction),
      await this.getHeader(),
    )
      .then(handleResponse)
      .then((data) => {
        console.log(data);
      })
      .catch(err => console.log(err));
  };

  /**
   * Deletes a given transaction within a portfolio
   * @param {string} id - id of the transaction being deleted
   */
  deleteTransaction = async (id) => {
    await stocksDjango.delete(
      `/transactions/${id}`,
      await this.getHeader(),
    )
      .then(handleResponse)
      .then((data) => {
        console.log(data);
        // console.log(data)
      })
      .catch((err) => {
        console.err('an error deleting');
        console.err(err);
      });
  };

  /**
   * Edits a given transaction within a portfolio
   * @param {Object} transaction - relevant transaction information
   */
  createTransaction = async (transaction) => {
    await stocksDjango.post(
      '/transactions/',
      this.getTransactionFormData(transaction),
      await this.getHeader(),
    )
      .then(handleResponse)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };
}

export default new TransactionService();
