import React from 'react';
import styled from 'styled-components';
import tombstone from '../assets/tombstone.png';

const Reservation = () => {


  return (
      <Wrapper>
          <UserInfoWrapper>
          <Message>Reservation Information</Message>
            <UserInfo><b>Reservation #:</b> {localStorage.getItem('_id')}</UserInfo>
            <UserInfo><b>Flight #:</b> {localStorage.getItem('flight')}</UserInfo>
            <UserInfo><b>Seat #:</b> {localStorage.getItem('seat')}</UserInfo>
            <UserInfo><b>Name:</b> {localStorage.getItem('givenName')} {localStorage.getItem('surname')}</UserInfo>
            <UserInfo><b>Email:</b> {localStorage.getItem('email')}</UserInfo>
          </UserInfoWrapper>
          <StyledImg src={tombstone} alt="image" />
      </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items:center;
  margin:auto;
`;
const Message= styled.h2`
  font-family: var(--font-body);
  width:80%
  border-bottom: 3px solid var(--color-alabama-crimson);
  font-weight: bolder;
  padding:10px;
`;

const UserInfoWrapper = styled.div`
  font-family: var(--font-body);
  font-size: 20px;
  border: 3px solid var(--color-alabama-crimson);
`;
const UserInfo = styled.div`
  padding:5px;
`;

const StyledImg = styled.img`
  width: 200px;
  padding-top:10px;
`;

export default Reservation;