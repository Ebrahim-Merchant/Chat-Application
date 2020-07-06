import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
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

const dbUrl = process.env.DB_URL;
// Init server - Connect to No SQL
const app = express();
const server = http.Server(app);
const socket = io(server);
const router = express.Router();
mongoose.connect(dbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error: "));

//Setting the API port
const PORT = process.env.PORT || 8080;

//Setting up the API
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use('/api/conversation', conversation);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/reset', reset);
app.use(express.static(path.join(__dirname, '../../../client')));
app.use('/', react_app);

new ChatSocket(socket).connect();
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
