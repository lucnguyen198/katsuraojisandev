import store from "../store";
import * as ActionTypes from "../defines/actiontypes";
const {getProof} = require("../../WhitelistUtil");
require('dotenv').config();
const fetchDataRequest = () => {
  return {
    type: ActionTypes.CONTRACT_DATA_REQUEST
  };
};

const fetchDataSuccess = payload => {
  return {
    type: ActionTypes.CONTRACT_DATA_SUCCESS,
    payload: payload
  };
};

const fetchAccountDataSuccess = payload => {
  return {
    type: ActionTypes.ACCOUNT_DATA_SUCCESS,
    payload: payload
  };
};

const fetchExtraDataSuccess = payload => {
  return {
    type: ActionTypes.CONTRACT_EXTRA_DATA_SUCCESS,
    payload: payload
  };
};

const fetchAccountExtraDataSuccess = payload => {
  return {
    type: ActionTypes.ACCOUNT_EXTRA_DATA_SUCCESS,
    payload: payload
  };
};

const fetchDataFailed = payload => {
  return {
    type: ActionTypes.CONTRACT_DATA_FAILED,
    payload: payload
  };
};


export const fetchData = () => {
  return async dispatch => {
    dispatch(fetchDataRequest());
    try {
      let smartContract = store.getState().connect.smartContract;
      let totalSupply = await smartContract.totalSupply();

      let isWhitelistSale = await smartContract.isWhitelistSale();

      let isPublicSale = await smartContract.isPublicSale();

      let maxMintsPerWL = await smartContract.maxMintsPerWL();

      let maxMintsPerPS = await smartContract.maxMintsPerPS();

      let maxMintPerTX = await smartContract.maxMintPerTX();

      let revealed = await smartContract.revealed();

      dispatch(
        fetchDataSuccess({
          totalSupply: totalSupply.toNumber(),
          revealed: revealed,
          isWhitelistSale: isWhitelistSale,
          maxMintsPerWL: maxMintsPerWL.toNumber(),
          isPublicSale: isPublicSale,
          maxMintsPerPS: maxMintsPerPS.toNumber(),
          maxMintPerTX: maxMintPerTX.toNumber()
        })
      );
    } catch (error) {
      dispatch(
        fetchDataFailed("Something went wrong!")
      );
    }
  };
};

export const fetchAccountData = () => {
  return async dispatch => {
    dispatch(fetchDataRequest());
    try {
      let smartContract = store.getState().connect.smartContract;
      const account = store.getState().connect.account;
      const proof = getProof(account);
      let isWhitelisted = await smartContract.isWhitelisted(account, proof);

      const nftBalance = await smartContract.balanceOf(
        store.getState().connect.account
      );

      const publicSaleBalance = await smartContract.psMinted(
        store.getState().connect.account
      );

      const whitelistSaleBalance = await smartContract.wlsMinted(
        store.getState().connect.account
      );

      dispatch(
        fetchAccountDataSuccess({
          isWhitelisted: isWhitelisted,
          whitelistSaleBalance: whitelistSaleBalance.toNumber(),
          publicSaleBalance: publicSaleBalance.toNumber(),
          balance: nftBalance.toNumber()
        })
      );
    } catch (error) {
      dispatch(
        fetchDataFailed("Something went wrong!")
      );
    }
  };
};


export const fetchExtraData = () => {
  return async dispatch => {
    dispatch(fetchDataRequest());
    try {
      let smartContract = store.getState().connect.extraSmartContract;
      const eventData = await smartContract.events(process.env.REACT_APP_EVENT_ID);
      let extraMaxSupply = eventData.maxSupply;
      let extraSupply = eventData.supply;
      let extraMaxMint = eventData.maxMintsPerAddress;
      let isEventActive = eventData.isActive;

      dispatch(
        fetchExtraDataSuccess({
          extraMaxSupply: extraMaxSupply.toNumber(),
          extraSupply: extraSupply.toNumber(),
          extraMaxMint: extraMaxMint.toNumber(),
          isEventActive: isEventActive
        })
      );
    } catch (error) {
      dispatch(
        fetchDataFailed("Something went wrong!")
      );
    }
  };
};

export const fetchAccountExtraData = () => {
  return async dispatch => {
    dispatch(fetchDataRequest());
    try {
      let smartContract = store.getState().connect.extraSmartContract;
      const account = store.getState().connect.account;
      const conditionCheck = await smartContract.conditionCheck(process.env.REACT_APP_EVENT_ID, account);
      const eventBalance = await smartContract.getEventBalance(process.env.REACT_APP_EVENT_ID, account);
      dispatch(
        fetchAccountExtraDataSuccess({
          conditionCheck:conditionCheck,
          eventBalance: eventBalance.toNumber()
        })
      );
    } catch (error) {
      dispatch(
        fetchDataFailed("Something went wrong!")
      );
    }
  };
};
