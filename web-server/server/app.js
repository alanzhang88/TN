var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {passport} = require('./services/passport');
const cookieSession = require('cookie-session');
const googleAuth = require('./routes/googleAuth');
const {cookieKey} = require('./config/config');
const api = require('./routes/api');
const publicPath = path.join(__dirname,'..','client','build');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(cookieSession({
  name: 'session',
  keys: [cookieKey],
  maxAge: 7 * 24 * 60 * 60 * 1000
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth/google',googleAuth);
app.use('/api',api);


app.use(express.static(publicPath));

app.get('*',(req,res)=>{
  res.sendFile(`${publicPath}/index.html`);
});

module.exports = app;
