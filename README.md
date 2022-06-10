# Project: SlingAir!

<img src='frontend/src/assets/screenshots/header.png' style='width:100%' />
Slingair was a seat booking app project for Concordia’s full stack web development bootcamp. We were provided with some assets and an incomplete frontend. The goal of the project was to fix the frontend, hook it up to a Node.JS backend and migrate the data in `backend/data.js` to a brand-new MongoDB database in order to obtain an MVP. The server endpoints were made to be RESTful.

---

## The App

### Functionality

- When a user navigates to `http://localhost:3000`, they are presented with an input to enter the flight number.
![slingair1](https://user-images.githubusercontent.com/50504143/173108227-96fd1472-9e11-45a0-94b2-d7ffa7ee48e0.png)

- With the flight number, make a request to the server for the seating availability on that flight.
![slingair2](https://user-images.githubusercontent.com/50504143/173108561-cd78023f-40bd-4095-a583-3fe653b30119.png)

- When a response with seating is received, display the seating input as well as the form requesting user's information.
![slingair3](https://user-images.githubusercontent.com/50504143/173109206-22829214-11cd-4b8b-8a9d-093ca6982bc4.png)

- User selects a seat, enters information and clicks 'Confirm'.
![slingair4](https://user-images.githubusercontent.com/50504143/173109261-b2234131-4999-4ca4-8714-48d674aa4331.png)

- Contact the server with the data, and wait for a success response to redirect to the `/confirmed` page.
- The confirmed page should display a confirmation message to the user with the info that they entered on the previous screen.
![slingair5](https://user-images.githubusercontent.com/50504143/173109446-4e394758-bed2-43da-b5dc-ddeeb11f4128.png)







### Backend

1. Server endpoints are RESTful.
2. There are endpoints for the following actions:
   - retrieve all flight numbers
   - retrieve single flight data (seating)
   - retrieve all reservations
   - retrieve a single reservation
   - create a reservation
   - delete a reservation 
   - update a reservation 
3. server should respond in a complete fashion.
   - Send the status and the json separately.
   - send the status in the json object as well.
   - when a request succeeds respond with requested `data`.
   - when a request fails, respond with the `data` that was sent to the server.
   - when a request does not need any data to be returned, provide a message explaining the status: i.e. "reservation deleted."

```js
res.status(200).json({ status: 200, data: {}, message: {} });
```



