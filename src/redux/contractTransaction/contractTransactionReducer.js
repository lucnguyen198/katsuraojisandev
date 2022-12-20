import * as ActionTypes from "../defines/actiontypes";

const initialState = {
  loading: false,
  hasPendingTransaction: true,
  error: false,
  statusMsg: ""
};

const contractTransactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CONTRACT_TRANSACTION_REQUEST:
      return {
        ...initialState,
        loading: true,
        error: false,
        statusMsg: "Sending transaction..."
      };
    case ActionTypes.CONTRACT_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        hasPendingTransaction: false,
        statusMsg: action.payload
      };
    case ActionTypes.CONTRACT_TRANSACTION_FAILED:
      return {
        ...state,
        loading: false,
        error: true,
        statusMsg: action.payload
      };
    case ActionTypes.CHECK_TRANSACTION_PENDING:
      return {
        ...state,
        loading: false,
        hasPendingTransaction: action.payload.hasPendingTransaction,
        statusMsg: action.payload.message
      };
  }
  return state;
};

export default contractTransactionReducer;
