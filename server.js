require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const constants = require('constants');

const Config = {
  host: "::",
  whitelist: ["www.domain.com", "domain.com", "localhost"],
  certificate: process.env.ssl.certificate,
  ca_bundle: process.env.ssl.ca_bundle,
  privateKey: process.env.ssl.private"
};

const corsOptionsDelegate = function(request, callback) {
  let corsOptions;
  if (Config.whitelist.indexOf(request.header("Origin")) !== -1) {
    // reflect (enable) the requested origin in the CORS response
    corsOptions = { origin: true };
  } else {
    // disable CORS for this request
    corsOptions = { origin: false };
  }
  // callback expects two parameters: error and options
  callback(null, corsOptions);
};

const server = express();
server.use(cors(corsOptionsDelegate));

server.set('views', __dirname + '/www/views');
server.set('view engine', 'jsx');
server.engine('jsx', require('express-react-views').createEngine({ beautify: true}));
server.use('/', express.static(path.join(__dirname, 'views', 'public')));
const body = '/index.jsx';

server.get('/', (req, res) => {
  // TODO Return a response that documents the other routes/operations available
  res.render(body);
});

// ADD This to router page.
//var route1 = require('express').Router();
//route1.use(bodyParser.json());
//route1.post('/*', (req, res, next) => { /* Route Middleware for all of this sub route*/ next(); });
//route1.put('/*', (req, res, next) => { /* Route Middleware for all of this sub route*/ next(); });
//route1.get('/*', (req, res, next) => { /* Route Middleware for all of this sub route*/ next(); });
//route1.delete('/*', (req, res, next) => { /* Route Middleware for all of this sub route*/ next(); });
//route1.all('/sub-route/*',/* Middleware for sub-route*/);
//module.export = route1;

//const route1 = require('location_to_route_1');
//const route2 = require('location_to_route_2');
//const route3 = require('location_to_route_3');
//Primary Routes
//server.use('/route1', route1);
//server.use('/route2', route2);
//server.use('/route3', route3);

let privateKeyFile = undefined;
if (fs.existsSync(Config.privateKey))
  privateKeyFile = fs.readFileSync(Config.privateKey, "utf8");

let certificateFile = undefined;
if (fs.existsSync(Config.certificate))
  certificateFile = fs.readFileSync(Config.certificate, "utf8");

let caBundleFile = undefined;
if (fs.existsSync(Config.ca_bundle))
  caBundleFile = fs.readFileSync(Config.ca_bundle, "utf8");

if (privateKeyFile && certificateFile && caBundleFile && argv[2].toLowerCase() === 'https' || argv[2].toLowerCase() === 'both') {
  const credentials = {
    cert: certificateFile,
    ca: caBundleFile,
    key: privateKeyFile,
    secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2
  };
  Config.port = '443';
  const httpsServer = https.createServer(credentials, server);
  
  const serverHttpsApp = httpsServer.listen(Config.port, Config.host, () => {
    console.log(
      "Secure Server listening on : \n\t" +
        serverHttpsApp.address().address +
        ":" +
        serverHttpsApp.address().port
    );
  });
} 
Config.port = '3000';
//TODO :: ADD SOCKET.IO
if( argv[2].toLowerCase() === 'http' || argv[2].toLowerCase() === 'both')
  const serverApp = server.listen(Config.port, Config.host, () => {
    console.log(
      "Server listening on : \n\t" +
        serverApp.address().address +
        ":" +
        serverApp.address().port
    );
  });
};
console.log('Start Up Completed', Date().toString());
