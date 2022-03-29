import React, { useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SeatSelect from './SeatSelect';
import Confirmation from './Confirmation';
import GlobalStyles from './GlobalStyles';
import Reservation from './Reservation';

const App = () => {
  //states for header and confirmation
  const [userData, setuserData] = useState(null);
  
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header  />
      <Main>
        <Switch>
          <Route exact path="/">
            <SeatSelect  setuserData ={setuserData} />
          </Route>
          <Route exact path="/confirmed">
            <Confirmation userData = {userData}/>
          </Route>
          <Route exact path="/view-reservation">
            <Reservation />
          </Route>
          <Route path="">404: Oops!</Route>
        </Switch>
        <Footer />
      </Main>
    </BrowserRouter>
  );
};

const Main = styled.div`
  background: var(--color-orange); 
  display: flex;
  flex-direction: column;
  height: calc(100vh - 110px);
  
`;

export default App;