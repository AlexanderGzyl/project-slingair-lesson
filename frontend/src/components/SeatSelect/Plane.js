import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Plane = ({ isFetched,_id, formInput, setFormInput, setSelectedSeat}) => {
  const [seating, setSeating] = useState([]);
  
  useEffect(() => {
    if(isFetched===true){
    fetch(`/flight/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setSeating(data.data.seats);
      })
      .catch((err) => {
        console.error('Error', err);
      });}
  }, [_id]);
  // console.log(...seating)
  let updateSeating = [...seating];

  return (
    <>
      <Wrapper>
        <Grid>
        {seating && seating.length > 0 ? (
          seating.map(
            (seat, index) =>
                <SeatWrapper key={`seat-${seat.id}`}>
                  <label>
                    {seat.isAvailable ? (
                      <>
                        <Seat
                          type="radio"
                          name="seat"
                          onChange={() => {
                            updateSeating[index].isAvailable = false;
                            setSeating(updateSeating);
                            setFormInput({
                              ...formInput,
                              flight: _id,
                              seat: seat.id,
                            });
                            //update SeatID in form component
                            setSelectedSeat(seat.id);
                          }}
                        />
                        <Available>{seat.id}</Available>
                      </>
                    ) : (
                      <Unavailable>{seat.id}</Unavailable>
                    )}
                  </label>
                </SeatWrapper>
          )
        ) : (
          <Placeholder>Select a Flight to view seating.</Placeholder>
        )}
        </Grid>
      </Wrapper>
    </>
  );
};



const Placeholder = styled.div`
  position: absolute;
  transform: translate(-2%, 0);
  height: 40vh;
  width:27vh;
  text-align: center;
  color: var(--color-orange);
  font-family: var(--font-heading);
  font-size: 32px;
  opacity: 0.5;
`;

const Wrapper = styled.div`
  display:flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-right: 15px solid var(--color-alabama-crimson);
  border-left: 15px solid var(--color-alabama-crimson);
  margin: 24px 24px 0 0;
`;
const Grid = styled.ol`
display: grid;
  grid-template-rows: repeat(10, 3vh);
  grid-template-columns: 3vh 3vh 6vh 3vh 3vh 3vh;
  gap: 1vh 1vh;
  height: 50vh;
  width:33vh;
  transform: translate(11%, 11%);
`
const SeatWrapper = styled.li`
  display: flex;
  font-size: 5px;
  font-weight: 500;
  position: relative;
  height: 3vh;
  width: 3vh;
  
`;
const Seat = styled.input`
  opacity: 0;
  position: absolute;
  height: 3vh;
  width: 3vh;
  margin: 0;
  &:checked {
    span {
      background: var(--color-alabama-crimson);
      color: #fff;
      font-weight: 700;
    }
  }
`;
const SeatNumber = styled.span`
  border-radius: 2px;
  color: var(--color-cadmium-red);
  font-family: var(--font-body);
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 3vh;
  width: 3vh;
  transition: all ease 300ms;
`;
const Available = styled(SeatNumber)`
  background: #fff;
  border: 1px solid var(--color-alabama-crimson);
  cursor: pointer;
  &.checked,
  &:hover {
    background: var(--color-alabama-crimson);
    color: #fff;
    font-weight: 700;
  }
`;
const Unavailable = styled(SeatNumber)`
  background: var(--color-selective-yellow);
  cursor: not-allowed;
  opacity: 0.4;
`;

export default Plane;
