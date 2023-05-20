var express = require("express");
const { Client } = require('pg');
const http = require('http');
const cors = require('cors'); 
const fetch = require('node-fetch');

const app = express();
app.use(cors());
const server = http.createServer(app);

const client = new Client({
  connectionString: `postgresql://${process.env.user}:${process.env.password}@${process.env.HOSTNAME}/test_db`,
});
  
client.connect();

client.query('LISTEN salesforce');

client.on('notification', (msg) => {
  fetch(`http://${process.env.HOSTNAME}:8000/api/streaming`, {
    method: 'POST',
    body: JSON.stringify({ payload: msg.payload }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Response:', response);
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

server.listen(8888, function() {
    console.log("listening on port 8888");
});