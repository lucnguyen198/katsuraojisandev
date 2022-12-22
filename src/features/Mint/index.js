import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { connect, initContract } from "redux/connect/connectAction";
import {
  fetchData,
  fetchAccountData,
  fetchExtraData,
  fetchAccountExtraData
} from "redux/contractData/contractDataAction";
import {
  sendWhitelistMintTransaction,
  sendPublicMintTransaction,
  sendExtraMintTransaction,
  checkPendingTransaction
} from "redux/contractTransaction/contractTransactionAction";
import { getConfig } from "redux/Config";

import {
  Container,
  Button,
  ButtonCircle,
  BlockCenter,
  Text,
  Title,
  LargeTitle,
  FlexWrapper,
  InputValue
} from "components/styles/General.styled";
//import Card from "components/Card";

export default function MintContent() {
  //config
  const CONFIG = getConfig();
  //action
  const dispatch = useDispatch();

  //reducer
  const connectState = useSelector(state => state.connect);
  const contractDataState = useSelector(state => state.contractData);
  const contractTransactionState = useSelector(
    state => state.contractTransaction
  );

  //component state
  const [statusMsg, setStatusMsg] = useState("");
  const [mintAmount, setMintAmount] = useState(1);
  const [mode, setMode] = useState(0);
  // const [firstLoad, setFirstLoad] = useState(false);

  // useEffect(() => {
  //   let timer = setTimeout(() => setFirstLoad(true), 3000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);

  //handle when data change
  // useEffect(() => {
  //   if (firstLoad) {
  //     dispatch(initContract());
  //   }
  // }, [firstLoad]);

  useEffect(() => {
    dispatch(initContract());
  }, []);

  useEffect(() => {
    getAccountData();
    getAccountExtraData();
    getPendingTransaction();
  }, [connectState.account]);

  useEffect(() => {
    setStatusMsg(connectState.statusMsg);
  }, [connectState.statusMsg]);

  useEffect(() => {
    setStatusMsg(contractTransactionState.statusMsg);
  }, [contractTransactionState.statusMsg]);

  useEffect(() => {
    setStatusMsg(contractDataState.statusMsg);
  }, [contractDataState.statusMsg]);

  //tag events
  const onConnectClick = e => {
    dispatch(connect());
  };

  const onOriginClick = e => {
    setMode(1);
    getContractData();
  };

  const onExtraClick = e => {
    setMode(2);
    getExtraContractData();
  };

  const onMintClick = e => {
    if (contractDataState.isWhitelistSale)
      dispatch(sendWhitelistMintTransaction(mintAmount));
    else dispatch(sendPublicMintTransaction(mintAmount));
  };

  const onExtraMintClick = e => {
    dispatch(sendExtraMintTransaction(mintAmount));
  };

  const decrementMintAmount = e => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }

    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = e => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > CONFIG.MAX_MIN_PER_TX) {
      newMintAmount = CONFIG.MAX_MIN_PER_TX;
    }
    setMintAmount(newMintAmount);
  };

  //utils
  const getContractData = () => {
    if (connectState.smartContract !== null) {
      dispatch(fetchData());
    }
  };

  const getExtraContractData = () => {
    if (connectState.extraSmartContract !== null) {
      dispatch(fetchExtraData());
    }
  };
  const getAccountData = () => {
    if (connectState.account !== null && connectState.smartContract !== null) {
      dispatch(fetchAccountData());
    }
  };

  const getAccountExtraData = () => {
    if (connectState.account !== null && connectState.smartContract !== null) {
      dispatch(fetchAccountExtraData());
    }
  };

  const getPendingTransaction = () => {
    if (connectState.account !== null && connectState.smartContract !== null) {
      dispatch(checkPendingTransaction(""));
    }
  };

  const isLoading = () => {
    return (
      contractDataState.loading ||
      contractTransactionState.loading ||
      contractTransactionState.hasPendingTransaction ||
      !connectState.isCorrectNetwork
    );
  };

  const canConnect = () => {
    return (
      !connectState.loading &&
      !contractDataState.loading &&
      !contractTransactionState.loading &&
      connectState.isCorrectNetwork
    );
  };

  const canWhitelistMint = () => {
    let newBalance =
      parseInt(contractDataState.whitelistSaleBalance) + mintAmount;
    let totalCheck = parseInt(contractDataState.totalSupply) + mintAmount;
    return (
      newBalance <= contractDataState.maxMintsPerWL &&
      contractDataState.isWhitelisted &&
      totalCheck <= CONFIG.MAX_SUPPLY
    );
  };

  const canPublicSaleMint = () => {
    let newBalance = parseInt(contractDataState.publicSaleBalance) + mintAmount;
    let totalCheck = parseInt(contractDataState.totalSupply) + mintAmount;
    //console.log("newBalance: " + newBalance);

    return (
      newBalance <= contractDataState.maxMintsPerPS &&
      totalCheck <= CONFIG.MAX_SUPPLY
    );
  };

  const canMint = () => {
    return contractDataState.isWhitelistSale
      ? canWhitelistMint()
      : canPublicSaleMint();
  };

  const canExtraMint = () => {
    let newBalance = parseInt(contractDataState.eventBalance) + mintAmount;
    let totalCheck = parseInt(contractDataState.extraSupply) + mintAmount;
    //console.log("newBalance: " + newBalance);

    return (
      newBalance <= contractDataState.extraMaxMint &&
      totalCheck <= contractDataState.extraMaxSupply
    );
  };

  //01_comingsoon.png saleNotLive == true
  //04_ok.png saleNotLive == false
  const saleNotLive = () => {
    return (
      !contractDataState.isPublicSale && !contractDataState.isWhitelistSale
    );
  };

  const extraSaleNotLive = () => {
    return contractDataState.isEventActive === false;
  };

  //02_soldout.png isSoldOut == true
  const isSoldOut = () => {
    return contractDataState.totalSupply == CONFIG.MAX_SUPPLY;
  };

  const isExtraSoldOut = () => {
    return (
      contractDataState.extraSupply == contractDataState.extraSupplyMaxSupply
    );
  };

  //03_list.png isNotWhitelisted == true
  const isNotWhitelisted = () => {
    return (
      !contractDataState.isWhitelisted && contractDataState.isWhitelistSale
    );
  };

  const extraConditionCheck = () => {
    return contractDataState.conditionCheck;
  };

  const isAccountConnected = () => {
    return connectState.account !== null;
  };

  const isAccountDataLoad = () => {
    return contractDataState.accountLoad;
  };

  const isLoadContractDone = () => {
    return contractDataState.contractLoad;
  };
  //05_mint.png canMint == true
  /* const canMint = () => {
    return (
      contractDataState.totalSupply < CONFIG.MAX_SUPPLY &&
      (contractDataState.isPublicSale ||
        (contractDataState.isWhitelisted &&
          contractDataState.isWhitelisted))
    );
  }; */
  return (
    <Container padding="30px 0">
      <BlockCenter>
        {isLoadContractDone() === true && (
          <>
            {isExtraSoldOut() === true && <Title>Sold Out</Title>}

            {extraSaleNotLive() === true && isExtraSoldOut() === false && (
              <>
                <Title>COMING SOON</Title>
                <Button disabled margin="20px 0 0">
                  Connect Wallet
                </Button>
              </>
            )}

            {extraSaleNotLive() === false &&
              isExtraSoldOut() === false &&
              isAccountDataLoad() === false && (
                <Button
                  disabled={!canConnect()}
                  onClick={onConnectClick}
                  margin="50px 0 0"
                >
                  Connect Wallet
                </Button>
              )}

            {extraSaleNotLive() === false &&
              isSoldOut() === false &&
              isAccountDataLoad() === true &&
              extraConditionCheck() === false && (
                <Title>NFTを持っていません</Title>
              )}

            {extraSaleNotLive() === false &&
              isSoldOut() === false &&
              extraConditionCheck() === true && (
                <>
                  <LargeTitle color="#edff55">
                    {contractDataState.extraSupply}/
                    {contractDataState.extraMaxSupply}
                  </LargeTitle>

                  <Text>Mint free</Text>
                  <Text margin="0 0 50px">
                    {contractDataState.extraMaxMint}Max Per Wallet
                  </Text>

                  <FlexWrapper
                    className="mintAmountBox"
                    justify="center"
                    align="center"
                  >
                    <ButtonCircle
                      disabled={mintAmount == 1 || isLoading()}
                      onClick={decrementMintAmount}
                    >
                      {" "}
                      -{" "}
                    </ButtonCircle>
                    <InputValue>{mintAmount}</InputValue>
                    <ButtonCircle
                      disabled={
                        mintAmount == contractDataState.extraMaxMint ||
                        isLoading()
                      }
                      onClick={incrementMintAmount}
                    >
                      +
                    </ButtonCircle>
                  </FlexWrapper>
                  <Button
                    disabled={isLoading() || !canExtraMint()}
                    onClick={onExtraMintClick}
                    margin="20px 0 0"
                  >
                    Mint
                  </Button>
                </>
              )}
          </>
        )}

        {statusMsg && <Text margin="20px 0 0">{statusMsg}</Text>}
      </BlockCenter>
    </Container>
  );
}
