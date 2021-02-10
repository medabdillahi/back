const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routes/user');
const contrUser = require('./controllers/user');
const { body, validationResult } = require('express-validator');
const port = process.env.PORT || 3000;

const app = express();

mongoose.connect('mongodb://localhost:27017/uber', {useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex: true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use(cors());
app.post('/api/login',body('email','Email non valide').trim().isEmail(), contrUser.login);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log('Le serveur ecoute le port ' + port);
});