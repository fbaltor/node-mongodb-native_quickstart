const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "qs_mongodb";

// Create a new MongoClient
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Inserting document function definition
const insertDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection("documents");

  // Insert some documents
  collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function (err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    //assert.equal(3, result.ops.lenght); // Not working... result.ops.length is undefined
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
};

// Query function definition
const findDocuments = function (db, callback) {
  const collection = db.collection("documents");

  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
};

// Function to check if the collection already have documents, reinitializating it if so
const reintializeCollection = function (db, callback) {
  const collection = db.collection("documents");

  collection.deleteMany({}, function (err, result) {
    assert.equal(err, null);
    console.log("Reinitializating collection");
    console.log("A total of " + result.result.n + " were deleted");
    callback(result);
  });
};

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  reintializeCollection(db, () => {
    insertDocuments(db, () => {
      findDocuments(db, () => {
        client.close();
      });
    });
  });
});
