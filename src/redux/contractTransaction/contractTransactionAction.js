import store from "../store";
import * as ActionTypes from "../defines/actiontypes";
import {
  fetchData,
  fetchAccountData,
  fetchExtraData,
  fetchAccountExtraData
} from "../contractData/contractDataAction";
import { getConfig } from "../Config";
const { getProof } = require("../../WhitelistUtil");
require("dotenv").config();
const sendTransactionRequest = () => {
  return {
    type: ActionTypes.CONTRACT_TRANSACTION_REQUEST
  };
};

const sendTransactionSuccess = payload => {
  return {
    type: ActionTypes.CONTRACT_TRANSACTION_SUCCESS,
    payload: payload
  };
};

const sendTransactionFailed = payload => {
  return {
    type: ActionTypes.CONTRACT_TRANSACTION_FAILED,
    payload: payload
  };
};

const pendingTransactionRequest = payload => {
  return {
    type: ActionTypes.CHECK_TRANSACTION_PENDING,
    payload: payload
  };
};

export const sendPublicMintTransaction = mintAmount => {
  return async dispatch => {
    dispatch(sendTransactionRequest());
    let smartContract = store.getState().connect.smartContract;
    let provider = store.getState().connect.metamaskProvider;
    const contractWithSigner = smartContract.connect(provider.getSigner());
    const gasEstimated = await contractWithSigner.estimateGas.publicSaleMint(
      mintAmount
    );
    const marginGas = Math.ceil(gasEstimated * 1.1);
    const CONFIG = getConfig();
    contractWithSigner
      .publicSaleMint(mintAmount, {
        gasPrice: CONFIG.GAS_PRICE,
        gasLimit: marginGas
      })
      .then(txRes => {
        txRes
          .wait()
          .then(receipt => {
            if (receipt !== null) {
              dispatch(sendTransactionSuccess("Transaction successfully"));
              dispatch(fetchData());
              dispatch(fetchAccountData());
            } else {
              dispatch(checkPendingTransaction("Something went wrong!"));
            }
          })
          .catch(error => {
            dispatch(checkPendingTransaction("Something went wrong!"));
          });
      })
      .catch(error => {
        dispatch(checkPendingTransaction("Something went wrong!"));
      });
    // .on("receipt", receipt => {
    //   dispatch(sendTransactionSuccess("Transaction successfully"));
    //   dispatch(fetchData());
    // })
    // .on("error", error => {
    //   dispatch(checkPendingTransaction(error.message));
    // });
  };
};

export const sendWhitelistMintTransaction = mintAmount => {
  return async dispatch => {
    dispatch(sendTransactionRequest());
    let smartContract = store.getState().connect.smartContract;
    const account = store.getState().connect.account;
    let provider = store.getState().connect.metamaskProvider;
    const signer = provider.getSigner();
    const contractWithSigner = smartContract.connect(signer);
    const proof = getProof(account);
    const CONFIG = getConfig();
    const gasEstimated = await contractWithSigner.estimateGas.whitelistMint(
      mintAmount,
      proof
    );
    const marginGas = Math.ceil(gasEstimated * 1.1);

    contractWithSigner
      .whitelistMint(mintAmount, proof, {
        gasPrice: CONFIG.GAS_PRICE,
        gasLimit: marginGas
      })
      .then(txRes => {
        txRes
          .wait()
          .then(receipt => {
            if (receipt !== null) {
              dispatch(sendTransactionSuccess("Transaction successfully"));
              dispatch(fetchData());
              dispatch(fetchAccountData());
            } else {
              dispatch(checkPendingTransaction("Something went wrong!"));
            }
          })
          .catch(error => {
            dispatch(checkPendingTransaction("Something went wrong!"));
          });
      })
      .catch(error => {
        dispatch(checkPendingTransaction("Something went wrong!"));
      });
    // .on("receipt", receipt => {
    //   dispatch(sendTransactionSuccess("Transaction successfully"));
    //   dispatch(fetchData());
    // })
    // .on("error", error => {
    //   dispatch(checkPendingTransaction(error.message));
    // });
  };
};

export const sendExtraMintTransaction = mintAmount => {
  return async dispatch => {
    dispatch(sendTransactionRequest());
    let smartContract = store.getState().connect.smartContract;
    let provider = store.getState().connect.metamaskProvider;
    const contractWithSigner = smartContract.connect(provider.getSigner());
    const gasEstimated = await contractWithSigner.estimateGas.mintKatsuraOjisanExtra(
      process.env.REACT_APP_EVENT_ID,
      mintAmount
    );
    const marginGas = Math.ceil(gasEstimated * 1.1);
    const CONFIG = getConfig();
    contractWithSigner
      .mintKatsuraOjisanExtra(process.env.REACT_APP_EVENT_ID, mintAmount, {
        gasPrice: CONFIG.GAS_PRICE,
        gasLimit: marginGas
      })
      .then(txRes => {
        txRes
          .wait()
          .then(receipt => {
            if (receipt !== null) {
              dispatch(sendTransactionSuccess("Transaction successfully"));
              dispatch(fetchExtraData());
              dispatch(fetchAccountExtraData());
            } else {
              dispatch(checkPendingTransaction("Something went wrong!"));
            }
          })
          .catch(error => {
            dispatch(checkPendingTransaction("Something went wrong!"));
          });
      })
      .catch(error => {
        dispatch(checkPendingTransaction("Something went wrong!"));
      });
    // .on("receipt", receipt => {
    //   dispatch(sendTransactionSuccess("Transaction successfully"));
    //   dispatch(fetchData());
    // })
    // .on("error", error => {
    //   dispatch(checkPendingTransaction(error.message));
    // });
  };
};

export const checkPendingTransaction = txError => {
  return async dispatch => {
    try {
      let provider = store.getState().connect.provider;
      const allTransactions = await provider.getTransactionCount(
        store.getState().connect.account,
        "pending"
      );
      const confirmedTransactions = await provider.getTransactionCount(
        store.getState().connect.account,
        "latest"
      );
      // console.log(
      //   "allTransactions: " +
      //     allTransactions +
      //     "confirmedTransactions: " +
      //     confirmedTransactions
      // );
      let diff = allTransactions - confirmedTransactions;
      let hasPendingTx = false;
      let message = "";
      if (diff > 0) {
        hasPendingTx = true;
        message =
          "Your transaction is pending, please cancel or speed up it on metamask. Please refresh page after transaction complete";
      } else {
        message = txError;
      }
      dispatch(
        pendingTransactionRequest({
          hasPendingTransaction: hasPendingTx,
          message: message
        })
      );
    } catch (error) {
      dispatch(sendTransactionFailed("Check pending transaction failed."));
    }
  };
};
