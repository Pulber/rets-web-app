'use strict';

const path = require('path');
const serveStatic = require('feathers').static;
const compress = require('compression');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
//const socketio = require('feathers-socketio');
const bodyParser = require('body-parser');
const middleware = require('./middleware');
const services = require('./services');

const app = feathers();

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
  .use('/', serveStatic( app.get('public') ))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  //.configure(socketio())
  .configure(services)
  .configure(middleware);

module.exports = app;