import React from "react";

import GlobalStyles from './components/styles/Global';
import { LayoutWrapper } from './components/styles/General.styled';
import Header from 'components/Header';
import Banner from 'components/Banner';
import ListCard from 'components/ListCard';
import Footer from 'components/Footer';
import MintContent from 'features/Mint';

function App() {
  

  return (
    <>
      <GlobalStyles />
      <LayoutWrapper>
        <Header />
        <Banner />
        <ListCard />
        <MintContent />
        <Footer />  
      </LayoutWrapper>
    </>
    
  );
}

export default App;
