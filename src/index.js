import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017";

let db;

MongoClient.connect(uri, function(err, client) {
  if (err) {
    console.log('Error occurred while connecting to MongoDB Atlas...\\n', err);
  }
  console.log('Connected...');
  db = client.db("fitnessTracker");
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
