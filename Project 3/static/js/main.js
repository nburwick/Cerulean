const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'mydatabase';

// Create a new MongoClient
const client = new MongoClient(url);

// Connect to the MongoDB server
client.connect(function(err) {
  if (err) throw err;

  // Select the database
  const db = client.db(dbName);

  // Retrieve the data from the collection
  db.collection('mycollection').find({}).toArray(function(err, data