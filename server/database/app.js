const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));


const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));


mongoose.connect("mongodb://mongo_db:27017/",{'dbName':'dealershipsDB'});


const Reviews = require('./review');
const Dealerships = require('./dealership');


try {
  Reviews.deleteMany({}).then(()=>{
    Reviews.insertMany(reviews_data['reviews']);
  });
  Dealerships.deleteMany({}).then(()=>{
    Dealerships.insertMany(dealerships_data['dealerships']);
  });
} catch (error) {
  res.status(500).json({ error: 'Error fetching documents' });
}


app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API")
});


app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});


app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({dealership: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});


app.get('/fetchDealers', async (req, res) => {
    try {
      const documents = await Dealerships.find();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching documents' });
    }
});


app.get('/fetchDealers/:state', async (req, res) => {
    try {
      const documents = await Dealerships.find({ state: req.params.state });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching documents' });
    }
});


app.get('/fetchDealer/:id', async (req, res) => {
    try {
        const document = await Dealerships.findOne({ id: req.params.id });
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching document' });
    }
});


app.listen(3030, () => {
    console.log("Server running on port 3030");
});
