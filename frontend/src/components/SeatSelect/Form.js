import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
const { v4: uuidv4 } = require('uuid');

const Form = ({flightChosen,selectedSeat,formInput,setFormInput,setuserData}) => {
  let history = useHistory();

    const handleUpdate = (value, name) => {
      //update form before sending through post
    const updateFormInput = { ...formInput };
    updateFormInput[name] = value;
    setFormInput(updateFormInput);
  };

  const handleConfirm = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    const data = {
      _id: uuidv4(),
      flight: flightChosen,
      seat: selectedSeat,
      givenName: formInput.givenName,
      surname: formInput.surname,
      email: formInput.email,
    };
    //to reaccess reservation data
    localStorage.setItem('_id', data._id);
    localStorage.setItem('flight', data.flight);
    localStorage.setItem('seat', data.seat);
    localStorage.setItem('givenName', data.givenName);
    localStorage.setItem('surname', data.surname);
    localStorage.setItem('email', data.email);
    //confirmation page data
    setuserData(data);
    //add reservation
    fetch('/add-reservations', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    
    
    //push too confrimed page verify with getreservation
    history.push('/confirmed');
  };

  ///
  
  
  return (
    <Wrapper>
      <StyledForm onSubmit={handleConfirm}>
        <StyledInput
          type="text"
          name="fname"
          placeholder="First Name"
          handleUpdate={handleUpdate}
          onChange={(event) => {
            setFormInput({...formInput,givenName: event.target.value,});
          }}
        />
        <StyledInput
          type="text"
          name="lname"
          placeholder="Last Name"
          handleUpdate={handleUpdate}
          onChange={(event) => {
            setFormInput({...formInput,surname: event.target.value,});
          }}
        />
        <StyledInput
          type="email"
          name="email"
          placeholder="Email"
          handleUpdate={handleUpdate}
          onChange={(event) => {
            setFormInput({...formInput,email: event.target.value,});
          }}
        />
        {flightChosen !== '' && selectedSeat !== undefined &&formInput.givenName !== '' &&
          formInput.surname !== '' &&formInput.email !== '' ? (
          <Confirm type="submit">Confirm</Confirm>) 
          : (<Confirm type="submit" disabled>Confirm</Confirm>)
        }
      </StyledForm>
    </Wrapper>
  );
};
//styles
const Wrapper = styled.div`
  font-size: 16px;
  display: flex;
  align-items:center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  height: 40vh;
  padding: 2vh;
  border: 3px solid var(--color-alabama-crimson);
`;

const StyledInput = styled.input`
  margin-top: 2px;
  margin-bottom: 2px;
`;

const Confirm = styled.button`
  margin-top: 2px;
  margin-bottom: 2px;
  color: #fff;
  font-family: var(--font-heading);
  font-size: 30px;
  text-align: center;
  background-color: var(--color-alabama-crimson);
  border: none;
  cursor: pointer;
  padding: 5px 0px;
  &:disabled {
    cursor: not-allowed;
    opacity: 50%;
  }
`;

export default Form;