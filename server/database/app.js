const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const  cors = require('cors')
const app = express()
const port = 3030;

app.use(cors())

const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

mongoose.connect("mongodb://mongo_db:27017/",{'dbName':'dealershipsDB'});


const Reviews = require('./review');

const Dealerships = require('./dealership');

Reviews.insertMany(reviews_data['reviews']);
Dealerships.insertMany(dealerships_data['dealerships'])

app.get('/insert', async (req, res) => {
  const review = new Reviews({
		"id": req.query['id'],
		"name": req.query['name'],
		"dealership": req.query['dealership'],
		"review": req.query['review'],
		"purchase": req.query['purchase'],
		"purchase_date": req.query['purchase_date'],
		"car_make": req.query['car_make'],
		"car_model": req.query['car_model'],
		"car_year": req.query['car_year'],
	});

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
		console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Express route to fetch all documents
app.get('/fetch', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
