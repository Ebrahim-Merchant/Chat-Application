import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import conversation from './controllers/conversations';
import auth from './controllers/auth';
import users from './controllers/users';
import reset from './controllers/reset';
import staticServer from './controllers/static.files'
import http from 'http';
import io from 'socket.io';
import { chatServer } from './controllers/chat.socket.server';
import { config } from 'dotenv';
import path from 'path';

config();
const dbUrl = process.env.DB_URL ? process.env.DB_URL : '';
// Init server - Connect to No SQL
const app = express();
const server = new http.Server(app);
const socket = io(server);
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error: "));

//Setting the API port
const PORT = process.env.PORT || 3005;

//Setting up the API
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use('/api/conversation', conversation);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/reset', reset);
app.use(express.static(path.join(__dirname, '../../../client')));
app.use('/', staticServer);

chatServer(socket);
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
