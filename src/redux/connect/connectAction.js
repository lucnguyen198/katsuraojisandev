import * as ActionTypes from "../defines/actiontypes";
import { fetchExtraData } from "../contractData/contractDataAction";
import { getConfig } from "../Config";
import { ethers } from "ethers";
//import KatsuraOjisan from "../../artifacts/contracts/KatsuraOjisan.sol/KatsuraOjisan.json";
import KatsuraOjisanExtra from "../../artifacts/contracts/KatsuraOjisanExtra.sol/KatsuraOjisanExtra.json";
const contractAddresses = require("../../ContractAddresses.json");

const connectRequest = () => {
  return {
    type: ActionTypes.CONNECTION_REQUEST
  };
};

// const connectSuccess = payload => {
//   return {
//     type: ActionTypes.CONNECTION_SUCCESS,
//     payload: payload
//   };
// };

const initContractSuccess = payload => {
  return {
    type: ActionTypes.INIT_CONTRACT_SUCCESS,
    payload: payload
  };
};

const checkNetWorkDone = payload => {
  return {
    type: ActionTypes.CHECK_NETWORK_DONE,
    payload: payload
  };
};

const connectFailed = payload => {
  return {
    type: ActionTypes.CONNECTION_FAILED,
    payload: payload
  };
};

const connectMetaMaskFailed = payload => {
  return {
    type: ActionTypes.METAMASK_CONNECTION_FAILED,
    payload: payload
  };
};

const updateAccountRequest = payload => {
  return {
    type: ActionTypes.UPDATE_ACCOUNT,
    payload: payload
  };
};

const updateNetworkRequest = payload => {
  return {
    type: ActionTypes.UPDATE_NETWORK,
    payload: payload
  };
};

export const checkNetwork = (networkId, ethereum) => {
  return async dispatch => {
    const CONFIG = getConfig();
    if (networkId == CONFIG.NETWORK.ID) {
      dispatch(checkNetWorkDone(true));
      try {
        const metamaskProvider = new ethers.providers.Web3Provider(ethereum);
        const provider = ethers.getDefaultProvider(
          process.env.REACT_APP_ALCHEMY_RPC_URL
        );
        // const SmartContractObj = new ethers.Contract(
        //   contractAddresses.KatsuraOjisan,
        //   KatsuraOjisan.abi,
        //   provider
        // );
        const extraSmartContractObj = new ethers.Contract(
          contractAddresses.KatsuraOjisanExtra,
          KatsuraOjisanExtra.abi,
          provider
        );
        dispatch(
          initContractSuccess({
            provider: provider,
            metamaskConnected: true,
            smartContract: extraSmartContractObj,
            metamaskProvider: metamaskProvider
          })
        );
        dispatch(fetchExtraData());
      } catch (error) {
        dispatch(connectFailed("Something went wrong. " + error.message));
      }
    } else {
      dispatch(checkNetWorkDone(false));
      dispatch(
        connectFailed(
          `Please change network to ${CONFIG.NETWORK.NAME} on metamask`
        )
      );
      try {
        //request to switch net work
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: CONFIG.NETWORK.CHAINID }]
        });
      } catch (switchError) {
        //Add network on any error when switch
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: CONFIG.NETWORK.CHAINID,
                chainName: CONFIG.NETWORK.NAME,
                rpcUrls: [CONFIG.NETWORK.RPCURLS],
                blockExplorerUrls: [CONFIG.NETWORK.SCAN_LINK],
                nativeCurrency: {
                  symbol: CONFIG.NETWORK.SYMBOL,
                  decimals: 18
                }
              }
            ]
          });
        } catch (addError) {
          dispatch(connectFailed("Something went wrong!"));
        }
        // if (switchError.code === 4902) {

        // } else {
        //   dispatch(
        //     connectFailed(
        //       "Something went wrong when switch network. " + switchError.message
        //     )
        //   );
        // }
      }
    }
  };
};

export const initContract = () => {
  return async dispatch => {
    const { ethereum } = window;
    // if (!ethereum._state.initialized) {
    //   dispatch(
    //     connectMetaMaskFailed(
    //       "Cannot connect to metamask. Please wait a moment and try to reload page"
    //     )
    //   );
    // } else
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      const networkId = await ethereum.request({
        method: "net_version"
      });

      ethereum.on("chainChanged", chainId => {
        let decimalId = parseInt(chainId, 16);
        dispatch(updateNetwork(decimalId));
        dispatch(checkNetwork(decimalId, ethereum));
      });
      dispatch(checkNetwork(networkId, ethereum));
    } else {
      dispatch(connectFailed("Please install Metamask!"));
    }
  };
};

export const connect = () => {
  return async dispatch => {
    dispatch(connectRequest());
    const { ethereum } = window;
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });
      dispatch(updateAccount(accounts[0]));
      //account change listener
      ethereum.on("accountsChanged", accounts => {
        dispatch(updateAccount(accounts[0]));
      });
    } catch (err) {
      if (err.code == -32002 || err.code === 4001) {
        //reactive metamask
        dispatch(connectFailed("Please unlock your metamask and login"));
      } else {
        dispatch(connectFailed("Something went wrong!"));
      }
    }
  };
};

export const updateAccount = account => {
  return async dispatch => {
    dispatch(updateAccountRequest({ account: account }));
  };
};

export const updateNetwork = networkId => {
  return async dispatch => {
    dispatch(updateNetworkRequest({ networkId: networkId }));
  };
};
