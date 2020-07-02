import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import key from './secrets';
import mongoose from 'mongoose';
import conversation from './controllers/conversations';
import auth from './controllers/auth';
import users from './controllers/users';
import reset from './controllers/reset';
import http from 'http';
import io from 'socket.io';
import ChatSocket from './controllers/chat_socket';
// Init server - Connect to No SQL
const app = express();
const server = http.Server(app);
const socket = io(server);
const router = express.Router();
mongoose.connect(key);
var db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error: "));

//Setting the API port
const API_PORT = process.env.API_PORT || 3001;

//Setting up the API
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use('/api/conversation', conversation);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/reset', reset);
new ChatSocket(socket).connect();
server.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
