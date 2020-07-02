import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import key from './secrets';
import mongoose from 'mongoose';
import conversation from './controllers/conversations';
import auth from './controllers/auth';
import users from './controllers/users';
import reset from './controllers/reset';
import react_app from './controllers/react_app';
import http from 'http';
import io from 'socket.io';
const path = require('path');
import ChatSocket from './controllers/chat_socket';

const dbUrl = process.env.DB_URL || key;
// Init server - Connect to No SQL
const app = express();
const server = http.Server(app);
const socket = io(server);
const router = express.Router();
mongoose.connect(dbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error: "));

//Setting the API port
const API_PORT = process.env.API_PORT || 3005;

//Setting up the API
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use('/api/conversation', conversation);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/reset', reset);
console.log(path.join(__dirname, '../client/build'))
app.use(express.static(path.join(__dirname, '../client/build')))
app.use('/', react_app);

new ChatSocket(socket).connect();
server.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
