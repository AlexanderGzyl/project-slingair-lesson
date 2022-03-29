//needed to move batchimport and env to backend

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require('assert');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
//get data
const {flights,reservations} = require("./data")

//how to organize the data
//1) I need a flight number that I can retrieve
//2) attached to the flight number are data for the seats on that flight
//put data into iterable array {} to []
flightData = [];
Object.keys(flights).map((flight) => {
    return flightData[flightData.length]={
        _id: flight,
        seats: flights[flight]
    };
});

const batchImport = async () => {
    const client = await new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db("slingair");
        console.log("Connected");
    try {
        const flightCollection = await db.collection("flights").insertMany(flightData);
        assert.equal(flightData.length, flightCollection.insertedCount);
        console.log("success");
        const reservationCollection = await db.collection("reservations").insertMany(reservations);
        assert.equal(reservations.length, reservationCollection.insertedCount);
        console.log("success2");
    } catch (err) {
        console.log(err);
    }
    client.close();
    console.log("disconnected!");
};
batchImport();
