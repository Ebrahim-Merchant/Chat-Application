import User from './models/user'
import Conversation from './models/converstation'
import Message from './models/message'
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import { getSecret } from './secrets';
import mongoose from 'mongoose';
import Crypto, { createHash } from 'crypto';

//Connect to DB
const app = express();
const router = express.Router();
mongoose.connect(getSecret('dbUri'));
var db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error: "));
//Setting the API port
const API_PORT = process.env.API_PORT || 3001;

//Setting up the API
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use('/api', router);
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));


router.get('/', (req,res)   => {
    res.json({message: "It's live"});
});

//get all conversations
router.get('/conversations/:userId', (req, res) => {
    const { userId } = req.params;
    Conversation.find({ participants: userId })
    .select('_id')
    .exec(function(err, conversations) {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      // Set up empty array to hold conversations + most recent message
      let fullConversations = [];
      conversations.forEach(function(conversation) {
        Message.find({ 'conversationId': conversation._id })
          .sort('-createdAt')
          .limit(1)
          .populate({
            path: "author",
            select: "profile.firstName profile.lastName"
          })
          .exec(function(err, message) {
            if (err) {
              res.send({ error: err });
              return next(err);
            }
            fullConversations.push(message);
            if(fullConversations.length === conversations.length) {
              return res.status(200).json({ conversations: fullConversations });
            }
          });
      });
  });
});

router.get('/conversation/:conversationId', (req, res) => {
    const { conversationId } = req.params;
    Message.find({ conversationId: conversationId })
    .select('createdAt body author')
    .sort('createdAt')
    .populate({
      path: 'author',
      select: 'profile.firstName profile.lastName'
    })
    .exec(function(err, messages) {
      if (err) return res.json({sucess: false, error:err})
      else res.json({ success: true, conversation: messages });
    });
})

router.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if(!firstName || !lastName)
    {
        return res.json({success:false, message: 'Please enter a username and password'})
    }
    else{
        const newUser = new User
        ({
            profile:{
                firstName: firstName,
                lastName: lastName
            },
            email: email,
            password: Crypto.createHash('md5').update(password).digest("hex")
        });

        newUser.save((err)=>{
            if (err) return res.json({success: false, message: 'That email already already exists'})
            else return res.json({success: true, message: "Successfully created the new user"});
        })
    }
});

router.delete('/user/:userId', (req, res) => {
    const { userId } = req.params
    console.log(userId)
    if(!userId){
        return res.json({success: false, error: "Please Enter a User ID"});
    }
    else if(userId == "all")
    {
        User.remove({}, (err) => {
            if (err) return res.json({success: false, error: "Unable to delete all users"})
            else return res.json({success:true, message: "Deleted All Users"});
        })
    }
    else
    {

    }
})

router.post('/authenticate', (req, res) => {
    console.log(req.body);
    const { firstName, lastName, password } = req.body;
    if(!firstName || !lastName)
    {
        return res.json({success:false, message: 'Please enter a username and password'})
    }
    else{
        const newUser = new User
        ({
            profile:{
                firstName: firstName,
                lastName: lastName
            },
            password: Crypto.createHash('md5').update(password).digest("hex")
        });

        newUser.save((err)=>{
            if (err) return res.json({success: false, message: 'That email already already exists'})
            else return res.json({success: true, message: "Successfully created the new user"});
        })
    }
});

router.get('/users', (req, res) => 
{
    User.find((err, users) =>{
        if (err) return res.json({success: false, error:err});
        return res.json({success : true, data: users});
    });
});


router.get('/user/:userId', (req, res) => 
{
    const { userId } = req.params;
    User.find({ "_id": userId })
    .exec(function(err, users){
        if (err) return res.json({success: false, error:err});
        return res.json({success : true, data: users});
    });
});



router.post('/new/conversation', (req, res) => {
    const {recipentId, composedMessage, userId} = req.body;
    console.log(recipentId+", "+composedMessage+", "+ userId)
    if(!recipentId) {return res.json({success: false, error:"Please add a recipents"});}
    if(!composedMessage){return res.json({sucess:false, error:"Please enter a message"});}
    const conversation = new Conversation({
        participants : [userId,recipentId]
    });
    console.log(conversation)

    conversation.save((err, newConversation)=>{
        if (err) return res.json({success: false, error: err._message})
        const message = new Message({
            conversationId: newConversation._id,
            body: composedMessage,
            author: userId
        });

        message.save((err, newMessage) =>
        {
            if (err) return res.json({success:false, error: err});
            else res.json({success: true, message: "Conversation started!"})
        });
    })
 });

router.post('/conversation', (req, res) =>{
    const reply = new Message();
    const {conversationId, body, author} = req.body;
    if(!conversationId || !body || !author)
    {
        return res.json({success:false, error: 'You must provide an converstaionId and message'
    });
    }
    reply.conversationId = conversationId;
    reply.body = body;
    reply.author = author;
    reply.save(err=> {
        if (err) return res.json({success: false, error: err});
        return res.json({success:true});
    });
});

