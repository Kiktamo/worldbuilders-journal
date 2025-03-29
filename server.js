// Get dependencies
var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// import the routing file to handle the default (index) route
var index = require('./server/routes/app');

const characterRoutes = require('./server/routes/characters');
const entriesRoutes = require('./server/routes/entries');
const commentsRoutes = require('./server/routes/comments');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(logger('dev'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use(express.static(path.join(__dirname, 'dist/app/browser')));

app.use('/', index);
app.use('/api/characters', characterRoutes);
app.use('/api/entries', entriesRoutes);
app.use('/api/comments', commentsRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cms/browser/index.html'));
});

async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/worldbuilder', { useNewUrlParser: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Connection error:', err);
  }
}

connectDB();

// Define the port address and tell express to use this port
const port = process.env.PORT || '8080';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Tell the server to start listening on the provided port
server.listen(port, function() {
  console.log('API running on localhost: ' + port)
});
