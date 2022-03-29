import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Plane from './Plane';
import Form from './Form';

const SeatSelect = ({ setuserData }) => {

  //drop down states
  const [flights, setFlights] = useState();
  const [isFetched, setIsFetched] = useState(false);
  const [flightChosen, setFlightChosen] = useState();
  
  //get all flights
  useEffect(() => {
    fetch('/flights')
      .then((res) => {
      if(res.ok)
      {return res.json()}
    else{
      throw new Error(`Error! status: ${res.status}`);
    }})
      .then((data) => {
        setFlights(data.data);
        setIsFetched(true);
      })
      .catch((err) => {
        console.error('Error', err);
      });
  }, []);
  
//handle flight choice
  const handleSelect = (ev) => {
    setFlightChosen(ev.target.value);
  };

  //form and plane states
  const initialState = {
    _id: '',
    flight: '',
    seat: '',
    givenName: '',
    surname: '',
    email: '',
  };
  const [formInput, setFormInput] = useState(initialState);
  const [selectedSeat, setSelectedSeat] = useState();

  return (
    <Wrapper>
      {isFetched && (
        <FlightNumberWrapper>
          <FlightNumber>
            <label htmlFor="flightNumber">Flight Number:</label>
            <DropDown
              name="flightNumber"
              id="flightNumber"
              onChange={handleSelect}
              autoFocus
              defaultValue={null}
            >
              <option value="1">Select a flight</option>
              {flights.map((flight) => {
                return (
                  <option value={flight} key={flight}>{flight}</option>
                );
              })}
            </DropDown>
          </FlightNumber>
        </FlightNumberWrapper>
      )}
        <Prompt>Select your seat and provide your information!</Prompt>
        <Booking>
          <Plane
          isFetched={isFetched}
            _id={flightChosen}
            setSelectedSeat={setSelectedSeat}
            formInput={formInput}
            setFormInput={setFormInput}
          />
          <Form
            flightChosen={flightChosen}
            selectedSeat={selectedSeat}
            formInput={formInput}
            setFormInput={setFormInput}
            setuserData ={setuserData}
          />
        </Booking>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 80vh
`;

const FlightNumberWrapper = styled.div`
display:flex;
  background-color: var(--color-cadmium-red);
  height:10vh;
  align-items:center;
`;

const FlightNumber = styled.div`
position: absolute;
  margin-left: 20px;
`;

const DropDown = styled.select`
position: absolute;
  margin-left: 20px;
  height: 40px;
  border: none;
  border-radius: 5px;
`;
const Prompt = styled.h2`
padding-top:1%;
`
const Booking = styled.div`
display: flex;
  flex-direction: row;
  justify-content: center;
`;

export default SeatSelect;