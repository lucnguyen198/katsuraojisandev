import * as ActionTypes from "../defines/actiontypes";

const initialState = {
  loading: false,
  account: null,
  smartContract: null,
  extraSmartContract: null,
  provider: null,
  metamaskProvider: null,
  networkId: 0,
  metamaskConnected: false,
  isCorrectNetwork: false,
  statusMsg: ""
};

const connectReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CONNECTION_REQUEST:
      return {
        ...state,
        loading: true,
        statusMsg: "Connecting..."
      };
    case ActionTypes.INIT_CONTRACT_SUCCESS:
      return {
        ...state,
        loading: false,
        smartContract: action.payload.smartContract,
        extraSmartContract: action.payload.extraSmartContract,
        metamaskConnected: action.payload.metamaskConnected,
        provider: action.payload.provider,
        metamaskProvider: action.payload.metamaskProvider,
        statusMsg: ""
      };

    case ActionTypes.CONNECTION_FAILED:
      return {
        ...state,
        loading: false,
        statusMsg: action.payload
      };

    case ActionTypes.CHECK_NETWORK_DONE:
      return {
        ...state,
        isCorrectNetwork: action.payload
      };

    case ActionTypes.METAMASK_CONNECTION_FAILED:
      return {
        ...state,
        loading: false,
        metamaskConnected: false,
        statusMsg: action.payload
      };

    case ActionTypes.UPDATE_ACCOUNT:
      return {
        ...state,
        account: action.payload.account
      };
    case ActionTypes.UPDATE_NETWORK:
      return {
        ...state,
        networkId: action.payload.networkId
      };
  }
  return state;
};

export default connectReducer;
