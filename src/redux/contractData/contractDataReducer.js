import * as ActionTypes from "../defines/actiontypes";

const initialState = {
  loading: false,
  totalSupply: 0,
  extraMaxSupply: 0,
  revealed: false,
  isWhitelistSale: false,
  isWhitelisted: false,
  maxMintsPerWL: 0,
  whitelistSaleBalance: 0,
  isPublicSale: false,
  maxMintsPerPS: 0,
  publicSaleBalance: 0,
  maxMintPerTX: 0,
  balance: 0,
  eventBalance:0,
  accountLoad: false,
  contractLoad: false,
  extraMaxMint:0,
  isEventActive: false,
  conditionCheck: false,
  error: false,
  statusMsg: ""
};

const contractDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CONTRACT_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        statusMsg: "Fetching data..."
      };

    case ActionTypes.CONTRACT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        totalSupply: action.payload.totalSupply,
        revealed: action.payload.revealed,
        isWhitelistSale: action.payload.isWhitelistSale,
        maxMintsPerWL: action.payload.maxMintsPerWL,
        isPublicSale: action.payload.isPublicSale,
        maxMintsPerPS: action.payload.maxMintsPerPS,
        maxMintPerTX: action.payload.maxMintPerTX,
        contractLoad: true,
        statusMsg: ""
      };

    case ActionTypes.ACCOUNT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        isWhitelisted: action.payload.isWhitelisted,
        whitelistSaleBalance: action.payload.whitelistSaleBalance,
        publicSaleBalance: action.payload.publicSaleBalance,
        balance: action.payload.balance,
        accountLoad: true,
        statusMsg: ""
      };

     case ActionTypes.CONTRACT_EXTRA_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        extraMaxSupply: action.payload.extraMaxSupply,
        extraSupply: action.payload.extraSupply,
        extraMaxMint: action.payload.extraMaxMint,
        isEventActive: action.payload.isEventActive,
        contractLoad: true,
        statusMsg: ""
      };

    case ActionTypes.ACCOUNT_EXTRA_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        conditionCheck: action.payload.conditionCheck,
        eventBalance: action.payload.eventBalance,
        accountLoad: true,
        statusMsg: ""
      };

    case ActionTypes.CONTRACT_DATA_FAILED:
      return {
        ...state,
        loading: false,
        error: true,
        statusMsg: action.payload
      };
  }
  return state;
};

export default contractDataReducer;
