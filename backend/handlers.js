"use strict";
//this code can be refactored there is a lot of resuable components
const { MongoClient } = require("mongodb");
require("dotenv").config();
const assert = require("assert");
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

// use this data. Changes will persist until the server (backend) restarts.
// const { flights, reservations } = require("./data");

//get list of flight names...note currently there is only 1 flight
const getFlights = async (req, res) => {
  const client =  new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("slingair");
  console.log("Connected");
  try {
    //get the data from server
    const flightList = await db.collection("flights").find().toArray();
    //map through each flight and get their ids
    const flightId = [];
    flightList.map((flight) => {
      return flightId[flightId.length]=flight._id;
    });
    //find will return an empty array if it doesn't find anything...
    if (flightList.length === 0) {
        res.status(404).json({ status: 404, error: "No Flights in database" });
    } else {
        res.status(200).json({status: 200, data:flightId});
    }
} catch (err) {
    console.log(err);
}
client.close();
console.log("disconnected!");
};


//get list of seats for a specific flight based on the flight id
const getFlight = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("slingair");
  console.log("Connected");
  const _id   = req.params._id;
  try {
    const result = await db.collection("flights").findOne({ _id });
    // console.log(result['seats'])
    if (result === null||result.length === 0||result === undefined){
      res.status(404).json({ status: 404, error: "Flight doesn't exist" });
      console.log("error")
    }else
      {res.status(200).json({status: 200,_id, data: result});}
      console.log("success")
  } catch (err) {
    console.log(err);
  }
  client.close();
  console.log("disconnected!");
};


//add reservation 
const addReservations = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("slingair");
  console.log("Connected");
  //check seat availabilty
  //if available update seat and add reservation
  const { flight, seat } = req.body;
  const _id   = flight
  let flightSeats =[]
  let booked = true;
  try {
    const result = await db.collection("flights").findOne({ _id });
    if (result.length === 0||result === null) {
      res.status(404).json({ status: 404, error: "Flight doesn't exist" });
  } else {
    flightSeats = result['seats']
  }
  } catch (err) {
    console.log(err);
  }
  
  flightSeats.forEach((seat) => {
    if (seat.isAvailable===true && seat.id === req.body.seat) {
      booked=false;
      console.log("success")
    }
  });
  
//$ dynamically point to index of sub document
//dot notation is needed to access seat properties
//https://www.youtube.com/watch?v=yLjfS5iKZPM
  if (booked===false) {
    try {
        let query ={ _id: flight, "seats.id": seat };
        let newValue = { $set: { "seats.$.isAvailable": false } };
        const updateFlight = await db.collection("flights").updateOne( query,newValue);
        const reservation = {
          _id: uuidv4(),
          ...req.body,
        };
        const addReservation =await db.collection("reservations").insertOne(reservation);
        // assert.equal(1, addReservation.insertedCount);
        res.status(201).json({ status: 201,message: "reservation added", data: reservation });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(400).json({status: 400,err: "seat unavailable"});
  }
  client.close();
  console.log("disconnected!");
  
};

const getReservations = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("slingair");
  console.log("Connected");
  try {
    //get the data from server
    const reservationList = await db.collection("reservations").find().toArray();
    //find will return an empty array if it doesn't find anything...
    if (reservationList.length === 0||null) {
        res.status(404).json({ status: 404, error: "array is empty" });
    } else {
        res.status(200).json({status: 200, data: reservationList});
    }
} catch (err) {
    console.log(err);
}
client.close();
console.log("disconnected!");
};

const getSingleReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("slingair");
  console.log("Connected");
  const _id   = req.params._id;
  try {
    const result = await db.collection("reservations").findOne({ _id });
    if (result.length === 0||null) {
      res.status(404).json({ status: 404, error: "reservation doesn't exist" });
  } else {
    // console.log(result['seats'])
      res.status(200).json({status: 200,_id, data: result});
      console.log('success')
  }
  } catch (err) {
    console.log(err);
  }
  client.close();
  console.log("disconnected!");
};

const deleteReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("slingair");
  console.log("Connected");
  const _id   = req.params._id;
  //find reservation
  //if found update seat and delete reservation
  let reservationFound = false;
  let reservation = []
  try {
    const result = await db.collection("reservations").findOne({ _id });
    if (result.length === 0||null) {
      res.status(404).json({ status: 404, error: "reservation doesn't exist" });
  } else {
    reservationFound = true;
    reservation = result
  }
  } catch (err) {
    console.log(err);
  }
    if (reservationFound === true) {
      try {
        let query ={ _id: reservation.flight, "seats.id": reservation.seat };
        let newValue = { $set: { "seats.$.isAvailable": true } };
        const updateFlight = await db.collection("flights").updateOne( query,newValue);
        const deleteReservation = await db.collection("reservations").deleteOne({ _id });
        res.status(200).json({status: 200,_id, data: deleteReservation});
      } catch (err) {
        console.log(err);
      }
    } else {
      res.status(404).json({ status: 404, error: "reservation doesn't exist" });
    }
    client.close();
    console.log("disconnected!");

};

const updateReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("slingair");
  console.log("Connected");
  //check if reservation exists
  //if it exists update registration and update both seat availabilities
  const _id   = req.params._id;
   //store updated resevation data
  const { flight, seat, givenName, surname, email } = req.body;

  let reservationFound = false;
  //store old resrevation data
  let oldReservation = []
  try {
    const result = await db.collection("reservations").findOne({ _id });
    if (result.length === 0||null) {
      res.status(404).json({ status: 404, error: "reservation doesn't exist" });
  } else {
    reservationFound = true;
    oldReservation = result
  }
  } catch (err) {
    console.log(err);
    
  }
  const query = { _id };
  const updatedReservationInfo = {
    $set: {
      flight: flight,
      seat: seat,
      givenName: givenName,
      surname: surname,
      email: email,
    },
  };
  if (reservationFound === true) {
    //check if old seat === new seat
    if (oldReservation["seat"]===seat) {
      //update reservation
      const updatedReservation = await db.collection("reservations").updateOne(query, updatedReservationInfo);
      res.status(200).json({status: 200,_id, data: updatedReservation});
    }else{
      //if not check if seat is available
      let flightSeats =[]
      let booked = true;
      try {
        const foundFlight = await db.collection("flights").findOne({ _id: flight });
        if (foundFlight.length === 0||null) {
          res.status(404).json({ status: 404, error: "Flight doesn't exist" });
      } else {
        flightSeats = foundFlight['seats']
      }
      } catch (err) {
        console.log(err);
      }
      flightSeats.forEach((seat) => {
        if (seat.isAvailable===true && seat.id === req.body.seat) {
          booked=false;
          console.log("success")
        }
      });

    if (booked===false) {
      try {
        let query2 ={ _id: flight, "seats.id": seat };
        let newValue2 = { $set: { "seats.$.isAvailable": false } };
        const updateNewFlight = await db.collection("flights").updateOne( query2,newValue2);
        let query3 ={ _id: flight, "seats.id": oldReservation["seat"] };
        let newValue3 = { $set: { "seats.$.isAvailable": true } };
        const updateOldFlight = await db.collection("flights").updateOne( query3,newValue3);
        const updatedReservation = await db.collection("reservations").updateOne(query, updatedReservationInfo);
        res.status(200).json({status: 200,_id, data: updatedReservation});} 
        catch (err) {
        console.log(err);
      }
      
    }

    }
    client.close();
    console.log("disconnected!");
  }  

};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservations,
  getSingleReservation,
  deleteReservation,
  updateReservation,
};
